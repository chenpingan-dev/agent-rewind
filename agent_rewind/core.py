from __future__ import annotations

import hashlib
import json
import re
from collections import defaultdict
from datetime import datetime
from importlib.resources import files
from typing import Any

MAX_BYTES = 16 * 1024 * 1024
MAX_RECORDS = 20_000
MAX_TEXT = 16_384
SECRET_KEYS = re.compile(r"^(?:authorization|api[_-]?key|access[_-]?token|token|password|secret)$", re.I)
ASSIGNMENT = re.compile(
    r"(?i)([\"']?(?:api[_-]?key|access[_-]?token|token|password|secret|authorization)[\"']?\s*[:=]\s*)"
    r"(?:[\"'][^\"']*[\"']|[^\s,};&]+)"
)


class TraceFormatError(ValueError):
    pass


def redact(text: str) -> str:
    text = re.sub(r"(?i)\bBearer\s+[^\s\"']+", "Bearer [REDACTED]", text)
    text = ASSIGNMENT.sub(lambda match: match.group(1) + "[REDACTED]", text)
    text = re.sub(r"\b(?:sk-|ghp_|github_pat_|xoxb-)[A-Za-z0-9_-]{16,}", "[REDACTED]", text)
    return re.sub(r"(https?://)[^/\s:@]+:[^/\s@]+@", r"\1[REDACTED]@", text)


def _clean(value: Any) -> Any:
    if isinstance(value, dict):
        return {str(key): "[REDACTED]" if SECRET_KEYS.fullmatch(str(key)) else _clean(item)
                for key, item in value.items()}
    if isinstance(value, list):
        return [_clean(item) for item in value]
    return redact(value) if isinstance(value, str) else value


def _text(value: Any) -> str:
    if value is None:
        return ""
    if isinstance(value, str):
        return value
    return json.dumps(value, ensure_ascii=False, sort_keys=True)


def _time(record: dict) -> float | None:
    value = record.get("timestamp")
    if isinstance(value, str):
        try:
            parsed = datetime.fromisoformat(value.replace("Z", "+00:00"))
            if parsed.tzinfo is not None:
                return parsed.timestamp() * 1000
        except ValueError:
            pass
    return None


def _integer(value: Any) -> int | None:
    return value if isinstance(value, int) and not isinstance(value, bool) and value >= 0 else None


def analyze(text: str, title: str = "Session replay") -> dict:
    """Normalize an explicit codex exec --json export; never run its commands."""
    if len(text.encode("utf-8")) > MAX_BYTES:
        raise TraceFormatError("Trace exceeds the 16 MiB limit")
    events: list[dict] = []
    items: dict[str, dict] = {}
    raw_items: dict[str, dict] = {}
    starts: dict[str, float] = {}
    signatures: dict[str, str] = {}
    turns: list[dict] = []
    warnings: list[dict] = []
    thread_id = ""
    records = 0
    origin: float | None = None
    synthetic = False
    active_turn = 0
    for line_number, line in enumerate(text.lstrip("\ufeff").splitlines(), 1):
        if not line.strip():
            continue
        records += 1
        if records > MAX_RECORDS:
            raise TraceFormatError("Trace exceeds the 20,000-record limit")
        try:
            record = json.loads(line)
        except (ValueError, RecursionError) as error:
            raise TraceFormatError(f"Line {line_number}: invalid JSON") from error
        if not isinstance(record, dict) or not isinstance(record.get("type"), str):
            raise TraceFormatError(f"Line {line_number}: expected an event object with a type")
        timestamp = _time(record)
        if timestamp is not None and origin is None:
            origin = timestamp
        at = round(timestamp - origin, 3) if timestamp is not None and origin is not None else None
        kind = record["type"]
        if kind == "thread.started":
            if thread_id:
                raise TraceFormatError(f"Line {line_number}: use one thread per trace")
            thread_id = _text(record.get("thread_id"))[:160]
            synthetic = record.get("synthetic") is True
            continue
        if kind == "turn.started":
            active_turn += 1
            continue
        if kind in ("turn.completed", "turn.failed"):
            usage = record.get("usage")
            usage = usage if isinstance(usage, dict) else {}
            values = {key: _integer(usage.get(key)) for key in
                      ("input_tokens", "cached_input_tokens", "output_tokens")}
            cached, total = values["cached_input_tokens"], values["input_tokens"]
            if cached is not None and total is not None and cached > total:
                warnings.append({"code": "invalid_cached_usage", "line": line_number})
                values["cached_input_tokens"] = None
            turns.append({"number": active_turn or len(turns) + 1, "status": kind.split(".")[1],
                          "usage": values, "source_line": line_number})
            if kind == "turn.failed":
                message = _text(record.get("error", "Turn failed"))
                events.append({"id": f"turn-error-{line_number}", "kind": "error", "status": "failed",
                               "title": "turn.failed", "text": redact(message)[:MAX_TEXT],
                               "output": "", "input": "", "paths": [], "source_line": line_number,
                               "end_line": line_number, "at_ms": at, "duration_ms": None})
            continue
        if kind == "error":
            events.append({"id": f"error-{line_number}", "kind": "error", "status": "failed",
                           "title": "error", "text": redact(_text(record.get("message")))[:MAX_TEXT],
                           "output": "", "input": "", "paths": [], "source_line": line_number,
                           "end_line": line_number, "at_ms": at, "duration_ms": None})
            continue
        if kind not in ("item.started", "item.updated", "item.completed"):
            warnings.append({"code": "unknown_event", "line": line_number, "type": kind[:100]})
            continue
        item = record.get("item")
        if not isinstance(item, dict) or not isinstance(item.get("id"), str) or not item["id"]:
            raise TraceFormatError(f"Line {line_number}: item needs a nonempty string id")
        item_id = f"t{active_turn}:{item['id']}"
        item = {**raw_items.get(item_id, {}), **item}
        raw_items[item_id] = item
        item_type = item.get("type", "unknown")
        if not isinstance(item_type, str):
            raise TraceFormatError(f"Line {line_number}: item type must be a string")
        event = items.get(item_id)
        if event is None:
            event = {"id": item_id, "kind": "note", "status": "in_progress", "title": item_type,
                     "text": "", "output": "", "input": "", "paths": [], "source_line": line_number,
                     "end_line": line_number, "at_ms": at, "duration_ms": None, "output_bytes": 0}
            items[item_id] = event
            events.append(event)
        event["end_line"] = line_number
        if kind == "item.started" and at is not None:
            starts.setdefault(item_id, at)
        if kind == "item.completed" and at is not None and item_id in starts:
            duration = at - starts[item_id]
            if duration >= 0:
                event["duration_ms"] = round(duration, 3)
            else:
                warnings.append({"code": "non_monotonic_time", "line": line_number})
        status = record["item"].get("status", "completed" if kind == "item.completed" else item.get("status", "in_progress"))
        event["status"] = status if status in ("completed", "failed", "in_progress") else "unknown"
        if isinstance(item.get("exit_code"), int) and not isinstance(item["exit_code"], bool):
            event["exit_code"] = item["exit_code"]
            if item["exit_code"] != 0:
                event["status"] = "failed"
        if item_type in ("command_execution", "mcp_tool_call", "web_search"):
            event["kind"] = "tool"
            if item_type == "command_execution":
                raw_title = _text(item.get("command", event["title"]))
                raw_output = _text(item.get("aggregated_output", event["output"]))
                raw_input = raw_title
                tool_name = "shell"
            elif item_type == "mcp_tool_call":
                tool_name = _text(item.get("tool", "mcp"))
                raw_title = _text(item.get("server", "mcp")) + "/" + tool_name
                raw_input = _text(item.get("arguments", {}))
                raw_output = _text(item.get("result", item.get("error", "")))
                if item.get("error"):
                    event["status"] = "failed"
            else:
                tool_name = "web_search"
                raw_title = _text(item.get("query", "web_search"))
                raw_input, raw_output = raw_title, ""
            event.update(title=redact(raw_title)[:240], input=redact(_text(_clean(raw_input)))[:MAX_TEXT],
                         output=redact(_text(_clean(raw_output)))[:MAX_TEXT], tool_name=tool_name,
                         output_bytes=len(raw_output.encode("utf-8")))
            if len(redact(raw_output)) > MAX_TEXT:
                event["truncated"] = True
            identity = [_text(item.get("server", "mcp")), tool_name] if item_type == "mcp_tool_call" else tool_name
            signature = json.dumps([item_type, identity, raw_input], ensure_ascii=False)
            signatures[item_id] = hashlib.sha256(signature.encode("utf-8")).hexdigest()
        elif item_type == "file_change":
            event["kind"] = "file"
            changes = item.get("changes", [])
            if not isinstance(changes, list):
                raise TraceFormatError(f"Line {line_number}: changes must be a list")
            event["paths"] = [{"path": redact(_text(change.get("path")))[:1000],
                               "action": _text(change.get("kind", "update"))[:40]}
                              for change in changes if isinstance(change, dict)]
            event["title"] = "file_change"
        else:
            event["kind"] = "message" if item_type == "agent_message" else "note"
            event["text"] = redact(_text(item.get("text", item.get("items", ""))))[:MAX_TEXT]
    if not records:
        raise TraceFormatError("Trace is empty")
    if not events and not turns:
        raise TraceFormatError("No supported items or turn outcomes found")
    for index, event in enumerate(events):
        event["order"] = index + 1
    tools = [event for event in events if event["kind"] == "tool"]
    groups: dict[str, list[dict]] = defaultdict(list)
    for event in tools:
        if event["status"] in ("completed", "failed"):
            groups[signatures[event["id"]]].append(event)
    call_groups = [{"fingerprint": signature, "count": len(group),
                    "failed": sum(event["status"] == "failed" for event in group),
                    "event_ids": [event["id"] for event in group]}
                   for signature, group in groups.items()]
    findings = []
    for group in groups.values():
        if len(group) >= 3:
            findings.append({"code": "repeated_call", "count": len(group),
                             "failed": sum(event["status"] == "failed" for event in group),
                             "event_ids": [event["id"] for event in group]})
    for event in tools:
        if event.get("output_bytes", 0) >= 8192:
            findings.append({"code": "large_output", "bytes": event["output_bytes"],
                             "event_ids": [event["id"]]})
        if event["status"] == "failed":
            findings.append({"code": "failed_call", "event_ids": [event["id"]]})
    usage = {}
    for key in ("input_tokens", "cached_input_tokens", "output_tokens"):
        known = [turn["usage"][key] for turn in turns if turn["usage"][key] is not None]
        usage[key] = sum(known) if known else None
    summary = {"events": len(events), "tool_calls": len(tools),
               "failed_calls": sum(event["status"] == "failed" for event in tools),
               "files_changed": len({path["path"] for event in events for path in event["paths"]}),
               "turns": len(turns), "usage_turns": sum(turn["usage"]["input_tokens"] is not None for turn in turns),
               "usage": usage, "output_bytes": sum(event.get("output_bytes", 0) for event in tools)}
    return {"schema": "agent-rewind/v1", "title": redact(title)[:160], "source": "codex-exec-jsonl",
            "synthetic": synthetic, "thread_id": redact(thread_id), "events": events,
            "turns": turns, "summary": summary, "findings": findings, "warnings": warnings,
            "call_groups": {"scheme": "exact-tool-input/v1", "groups": call_groups}}


def render_html(report: dict) -> str:
    assets = files("agent_rewind").joinpath("web")
    data = json.dumps(report, ensure_ascii=False).replace("<", "\\u003c").replace(">", "\\u003e")
    data = data.replace("\u2028", "\\u2028").replace("\u2029", "\\u2029")
    return assets.joinpath("report.html").read_text(encoding="utf-8").replace(
        "__STYLE__", assets.joinpath("style.css").read_text(encoding="utf-8")).replace(
        "__APP__", assets.joinpath("app.js").read_text(encoding="utf-8")).replace("__REPORT__", data)
