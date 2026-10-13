# Architecture

Explicit UTF-8 JSONL → bounded parser → turn-scoped item lifecycle merge → diagnostics and recorded usage → normalized JSON → inline HTML/CSS/JS

Item updates merge raw fields in memory so a partial completion cannot erase its original command or output byte count. Items in different turns use distinct normalized IDs. Timing is calculated only when both a start and completion timestamp exist. Tool signatures hash tool name plus raw input; three final calls trigger a repetition hint.

The renderer escapes JSON script delimiters. The client escapes displayed data and validates imported report shapes. All data stays in the page; there are no network calls or command execution paths. HTML downloads retain the report and assets, while JSON exports preserve diagnostics and optional comparison data.

Tests cover lifecycle merging, repeated IDs, unavailable usage/timing, redaction, output bounds, malformed input, script escaping and output overwrite protection.
