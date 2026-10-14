"""Generate synthetic Codex-shaped fixtures and analyze them with the real parser."""
import json
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
from agent_rewind import analyze, render_html


def fixture(revised=False):
    records = [{"type": "thread.started", "thread_id": "synthetic-notebox-session", "synthetic": True},
               {"type": "turn.started"}]
    def item(item_id, item_type, **fields):
        records.append({"type": "item.completed", "item": {"id": item_id, "type": item_type,
                        "status": "completed", **fields}})
    item("plan", "agent_message", text="Fix the notebook export test and verify the change")
    if not revised:
        for index in range(3):
            item(f"test-{index}", "command_execution", command="python -m unittest tests.test_export",
                 exit_code=1, aggregated_output="FAIL: test_export_unicode\nExpected UTF-8 text, got escaped characters\n1 test failed")
        item("scan", "command_execution", command="rg -n . notebox/", exit_code=0,
             aggregated_output="\n".join(f"notebox/export.py:{i}: # synthetic search result" for i in range(1, 220)))
    else:
        item("test", "command_execution", command="python -m unittest tests.test_export", exit_code=1,
             aggregated_output="FAIL: test_export_unicode\nExpected UTF-8 text, got escaped characters")
        item("scan", "command_execution", command="rg -n ensure_ascii notebox/export.py", exit_code=0,
             aggregated_output="notebox/export.py:18: json.dumps(note, ensure_ascii=True)")
        for index in range(3):
            item(f"diff-{index}", "command_execution", command="git diff --check", exit_code=0,
                 aggregated_output="")
    item("edit", "file_change", changes=[{"path": "notebox/export.py", "kind": "update"},
                                          {"path": "tests/test_export.py", "kind": "update"}])
    item("verify", "command_execution", command="python -m unittest discover -s tests", exit_code=0,
         aggregated_output="Ran 12 tests in 0.08s\nOK")
    item("done", "agent_message", text="Updated UTF-8 export and added regression coverage\n12 tests passed")
    records.append({"type": "turn.completed", "usage": {"input_tokens": 8200 if revised else 18400,
                    "cached_input_tokens": 4800 if revised else 11200, "output_tokens": 1100 if revised else 2400}})
    origin = datetime(2026, 1, 1, tzinfo=timezone.utc)
    for index, record in enumerate(records):
        record["timestamp"] = (origin + timedelta(seconds=index * 2)).isoformat()
    return "\n".join(json.dumps(record, ensure_ascii=False) for record in records) + "\n"


def main():
    examples = ROOT / "examples"; build = ROOT / "build"
    examples.mkdir(exist_ok=True); build.mkdir(exist_ok=True)
    for name, revised in (("repeated-run", False), ("focused-run", True)):
        (examples / f"{name}.jsonl").write_text(fixture(revised), encoding="utf-8")
    report = analyze(fixture(), "Notebook export · Run 01")
    report["title_i18n"] = {"zh": "笔记导出修复 · 第一次运行", "en": "Notebook export · Run 01"}
    report["comparison"] = analyze(fixture(True), "Notebook export · Run 02")
    report["comparison"]["title_i18n"] = {"zh": "笔记导出修复 · 第二次运行", "en": "Notebook export · Run 02"}
    (build / "index.html").write_text(render_html(report), encoding="utf-8")
    (build / "report.json").write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print("Built synthetic demo in build/index.html")


if __name__ == "__main__": main()
