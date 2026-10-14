# Architecture

Explicit UTF-8 JSONL → bounded parser → turn-scoped item lifecycle merge → diagnostics and recorded usage → normalized JSON → inline HTML/CSS/JS

Item updates merge raw fields in memory so a partial completion cannot erase its original command or output byte count. Items in different turns use distinct normalized IDs. Timing is calculated only when both a start and completion timestamp exist. Three completed or failed calls with identical tool identity and input trigger a repetition hint.

`call_groups` is additive metadata in the existing `agent-rewind/v1` report schema. Its `exact-tool-input/v1` scheme hashes a JSON array of item type, tool identity and full original input, before redaction or display truncation. MCP identity is a server/tool pair rather than an ambiguous concatenated label; structured argument keys are ordered consistently. Every completed or failed tool event belongs to exactly one group, including groups with only one call, so a 3-to-1 change can be compared accurately. Pending and unknown-status events are excluded. These deterministic input fingerprints are trace data, not an anonymization transform.

The client joins groups by fingerprint and displays groups with three or more calls in either run. Each group's source IDs resolve within its own recording, even when IDs are reused across runs. Imported group metadata is validated against finished-event coverage, uniqueness, counts and failure counts. Older reports without group metadata remain importable; group comparison explains that regeneration is required instead of guessing from redacted labels. Display is bounded to 100 searchable groups and 30 lazily rendered source links per group/run.

The renderer escapes JSON script delimiters. The client escapes displayed data and validates imported report shapes. All data stays in the page; there are no network calls or command execution paths. HTML downloads retain the report and assets, while JSON exports preserve diagnostics and optional comparison data.

Tests cover lifecycle merging, repeated IDs, unavailable usage/timing, redaction, output bounds, malformed input, script escaping, group identity, finished-call coverage, comparison JSON and output overwrite protection.
