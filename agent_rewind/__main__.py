import argparse
import json
import sys
from pathlib import Path

from . import __version__
from .core import MAX_BYTES, TraceFormatError, analyze, render_html


def read_trace(name: str) -> str:
    if name == "-":
        data = sys.stdin.buffer.read(MAX_BYTES + 1)
    else:
        with Path(name).open("rb") as stream:
            data = stream.read(MAX_BYTES + 1)
    if len(data) > MAX_BYTES:
        raise TraceFormatError("Trace exceeds the 16 MiB limit")
    try:
        return data.decode("utf-8-sig")
    except UnicodeError as error:
        raise TraceFormatError("Trace must be UTF-8 JSONL") from error


def main(argv=None) -> int:
    for stream in (sys.stdout, sys.stderr):
        if hasattr(stream, "reconfigure"):
            stream.reconfigure(encoding="utf-8")
    parser = argparse.ArgumentParser(description="Replay an explicit Codex JSONL export offline")
    parser.add_argument("--version", action="version", version=__version__)
    parser.add_argument("trace", help="Codex exec --json file, or - for stdin")
    parser.add_argument("--compare", help="Second explicit JSONL export to compare")
    parser.add_argument("--title", help="Report title")
    parser.add_argument("--html", default="rewind.html", help="Standalone HTML report")
    parser.add_argument("--json", dest="json_path", help="Also save normalized JSON")
    parser.add_argument("--force", action="store_true", help="Replace existing output files")
    args = parser.parse_args(argv)
    try:
        output = Path(args.html).resolve()
        inputs = [Path(name).resolve() for name in (args.trace, args.compare) if name and name != "-"]
        destinations = [output] + ([Path(args.json_path).resolve()] if args.json_path else [])
        if len(set(destinations)) != len(destinations) or any(path in inputs for path in destinations):
            raise TraceFormatError("Output paths must differ from input files and each other")
        if args.trace == "-" and args.compare == "-":
            raise TraceFormatError("Only one input can read stdin")
        if not args.force and any(path.exists() for path in destinations):
            raise TraceFormatError("Output exists; choose a new path or use --force")
        report = analyze(read_trace(args.trace), args.title or Path(args.trace).stem)
        if args.compare:
            report["comparison"] = analyze(read_trace(args.compare), Path(args.compare).stem)
        if args.json_path:
            with Path(args.json_path).open("w" if args.force else "x", encoding="utf-8") as stream:
                stream.write(json.dumps(report, ensure_ascii=False, indent=2) + "\n")
        with output.open("w" if args.force else "x", encoding="utf-8") as stream:
            stream.write(render_html(report))
        print(f"Report: {output}\n{report['summary']['events']} items, {report['summary']['tool_calls']} tool calls")
        return 0
    except (OSError, TraceFormatError, RecursionError) as error:
        print(f"agent-rewind: {error}", file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
