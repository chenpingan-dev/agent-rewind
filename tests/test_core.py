import json
import tempfile
import unittest
from pathlib import Path

from agent_rewind import TraceFormatError, analyze, render_html
from agent_rewind.__main__ import main, read_trace
from agent_rewind.core import MAX_TEXT, redact


def trace(*records):
    return "\n".join(json.dumps(record) for record in records)


def command(item_id="one", **fields):
    return {"type": "item.completed", "item": {"id": item_id, "type": "command_execution",
            "command": "go test ./...", "status": "completed", **fields}}


class ReplayTests(unittest.TestCase):
    def test_lifecycle_is_one_call_and_preserves_partial_updates(self):
        start = command(command="go test ./...", status="in_progress", aggregated_output="敏感输出" * 4000)
        start["type"] = "item.started"
        start["timestamp"] = "2026-01-01T00:00:01Z"
        end = {"type": "item.completed", "timestamp": "2026-01-01T00:00:03Z",
               "item": {"id": "one", "status": "completed", "exit_code": -1}}
        report = analyze(trace(start, end))
        self.assertEqual(report["summary"]["tool_calls"], 1)
        self.assertEqual(report["summary"]["failed_calls"], 1)
        event = report["events"][0]
        self.assertEqual(event["duration_ms"], 2000)
        self.assertEqual(event["input"], "go test ./...")
        self.assertEqual(event["output_bytes"], len(("敏感输出" * 4000).encode()))
        self.assertEqual(event["end_line"], 2)

    def test_completion_without_status_finishes_started_item(self):
        start = command(status="in_progress"); start["type"] = "item.started"
        end = {"type": "item.completed", "item": {"id": "one"}}
        self.assertEqual(analyze(trace(start, end))["events"][0]["status"], "completed")

    def test_no_invented_timing_usage_or_cost(self):
        report = analyze(trace(command(), {"type": "turn.completed"}))
        self.assertIsNone(report["events"][0]["duration_ms"])
        self.assertIsNone(report["events"][0]["at_ms"])
        self.assertIsNone(report["summary"]["usage"]["input_tokens"])
        timed = command(); timed["timestamp"] = "2026-01-01T00:00:01Z"
        self.assertIsNone(analyze(trace(timed))["events"][0]["duration_ms"])

    def test_repeated_calls_and_reused_ids_across_turns(self):
        records = []
        for _ in range(3):
            records += [{"type": "turn.started"}, command(), {"type": "turn.completed",
                         "usage": {"input_tokens": 100, "cached_input_tokens": 25, "output_tokens": 5}}]
        report = analyze(trace(*records))
        self.assertEqual(len({e["id"] for e in report["events"]}), 3)
        self.assertEqual(report["findings"][0]["count"], 3)
        self.assertEqual(report["summary"]["usage"]["input_tokens"], 300)

    def test_usage_validation_does_not_turn_missing_into_zero(self):
        report = analyze(trace(command(), {"type": "turn.completed", "usage": {
            "input_tokens": 10, "cached_input_tokens": 11, "output_tokens": True}}))
        self.assertIsNone(report["summary"]["usage"]["cached_input_tokens"])
        self.assertIsNone(report["summary"]["usage"]["output_tokens"])
        self.assertEqual(report["warnings"][0]["code"], "invalid_cached_usage")

    def test_call_groups_include_small_groups_and_only_finished_calls(self):
        report = analyze(trace(command("a"), command("b", exit_code=1),
                               command("pending", status="in_progress"),
                               command("unknown", status="unknown")))
        grouped = report["call_groups"]
        self.assertEqual(grouped["scheme"], "exact-tool-input/v1")
        self.assertEqual(len(grouped["groups"]), 1)
        group = grouped["groups"][0]
        self.assertEqual((group["count"], group["failed"]), (2, 1))
        self.assertEqual(group["event_ids"], ["t0:a", "t0:b"])
        self.assertNotIn("repeated_call", [f["code"] for f in report["findings"]])

    def test_matching_uses_full_input_before_redaction_and_truncation(self):
        first = analyze(trace(command(command='fetch --token="secret-one"')))
        second = analyze(trace(command(command='fetch --token="secret-two"')))
        self.assertEqual(first["events"][0]["input"], second["events"][0]["input"])
        self.assertNotEqual(first["call_groups"]["groups"][0]["fingerprint"],
                            second["call_groups"]["groups"][0]["fingerprint"])
        self.assertNotIn("secret-one", json.dumps(first))
        a = analyze(trace(command(command="x" * (MAX_TEXT + 1) + "a")))
        b = analyze(trace(command(command="x" * (MAX_TEXT + 1) + "b")))
        self.assertEqual(a["events"][0]["input"], b["events"][0]["input"])
        self.assertNotEqual(a["call_groups"]["groups"][0]["fingerprint"],
                            b["call_groups"]["groups"][0]["fingerprint"])

    def test_mcp_identity_includes_server_and_canonical_arguments(self):
        records = []
        for item_id, server, args in [("a", "alpha", {"a": 1, "b": 2}),
                                      ("b", "alpha", {"b": 2, "a": 1}),
                                      ("c", "beta", {"a": 1, "b": 2})]:
            records.append({"type": "item.completed", "item": {"id": item_id,
                            "type": "mcp_tool_call", "server": server, "tool": "lookup",
                            "arguments": args, "status": "completed"}})
        groups = analyze(trace(*records))["call_groups"]["groups"]
        self.assertEqual([g["count"] for g in groups], [2, 1])
        self.assertNotEqual(groups[0]["fingerprint"], groups[1]["fingerprint"])

    def test_shell_and_search_are_distinct_even_with_same_input(self):
        report = analyze(trace(command(command="web_search"),
            {"type": "item.completed", "item": {"id": "search", "type": "web_search",
             "query": "web_search", "status": "completed"}}))
        self.assertEqual(len(report["call_groups"]["groups"]), 2)

    def test_mcp_server_tool_pairs_are_not_ambiguous(self):
        records = [{"type": "item.completed", "item": {"id": str(i), "type": "mcp_tool_call",
                    "server": server, "tool": tool, "arguments": {}, "status": "completed"}}
                   for i, (server, tool) in enumerate([("alpha/beta", "lookup"), ("alpha", "beta/lookup")])]
        report = analyze(trace(*records))
        self.assertEqual(report["events"][0]["title"], report["events"][1]["title"])
        self.assertEqual(len(report["call_groups"]["groups"]), 2)

    def test_group_fingerprint_is_stable_across_turns_and_output_changes(self):
        first = analyze(trace(command(aggregated_output="before", exit_code=1)))
        second = analyze(trace({"type": "turn.started"},
                               command("new-id", aggregated_output="after", exit_code=0)))
        self.assertEqual(first["call_groups"]["groups"][0]["fingerprint"],
                         second["call_groups"]["groups"][0]["fingerprint"])

    def test_cli_comparison_preserves_both_group_counts(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            first, second = root/"first.jsonl", root/"second.jsonl"
            first.write_text(trace(*[command(str(i), exit_code=1) for i in range(3)]), encoding="utf-8")
            second.write_text(trace(command(exit_code=0)), encoding="utf-8")
            output, data = root/"report.html", root/"report.json"
            self.assertEqual(main([str(first), "--compare", str(second), "--html", str(output),
                                   "--json", str(data)]), 0)
            report = json.loads(data.read_text(encoding="utf-8"))
            a, b = report["call_groups"]["groups"][0], report["comparison"]["call_groups"]["groups"][0]
            self.assertEqual((a["count"], b["count"], a["failed"], b["failed"]), (3, 1, 3, 0))
            self.assertEqual(a["fingerprint"], b["fingerprint"])
            self.assertIn('id="repeat-list"', output.read_text(encoding="utf-8"))

    def test_secret_patterns_and_html_payload_are_not_executable(self):
        for text, secret in [('Authorization: Bearer abcdefg123', 'abcdefg123'),
                             ('password="my secret"', 'my secret'),
                             ('https://user:secret@example.com', 'secret')]:
            self.assertNotIn(secret, redact(text))
        report = analyze(trace(command(aggregated_output="</script><script>alert(1)</script>")))
        html = render_html(report)
        self.assertNotIn("</script><script>alert(1)</script>", html)
        self.assertIn("\\u003c/script\\u003e", html)
        self.assertNotIn('<script src=', html)

    def test_mcp_structured_secret_and_failure(self):
        report = analyze(trace({"type": "item.completed", "item": {"id": "m", "type": "mcp_tool_call",
            "server": "demo", "tool": "lookup", "arguments": {"password": "secret-value"},
            "error": {"message": "offline"}}}))
        self.assertNotIn("secret-value", json.dumps(report))
        self.assertEqual(report["summary"]["failed_calls"], 1)

    def test_large_output_is_bounded_but_original_bytes_are_kept(self):
        report = analyze(trace(command(aggregated_output="a" * 25000)))
        self.assertEqual(len(report["events"][0]["output"]), MAX_TEXT)
        self.assertEqual(report["events"][0]["output_bytes"], 25000)
        self.assertTrue(report["events"][0]["truncated"])

    def test_bad_inputs_and_unknown_records(self):
        for text in ("", "[]", '{"type":"item.completed","item":{}}', "{bad}"):
            with self.assertRaises(TraceFormatError): analyze(text)
        report = analyze(trace({"type": "future.event"}, command()))
        self.assertEqual(report["warnings"][0]["line"], 1)

    def test_cli_never_overwrites_input_or_existing_output(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory); source = root / "trace.jsonl"; output = root / "report.html"
            source.write_text(trace(command()), encoding="utf-8")
            self.assertEqual(main([str(source), "--html", str(output)]), 0)
            self.assertEqual(main([str(source), "--html", str(output)]), 2)
            self.assertEqual(main([str(source), "--html", str(source), "--force"]), 2)
            source.write_bytes(b"\xff")
            with self.assertRaises(TraceFormatError): read_trace(str(source))


if __name__ == "__main__": unittest.main()
