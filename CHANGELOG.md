# Changelog

## 0.1.2 — 2026-10-14

- Compare repeated tool inputs across two runs, with new, absent, increased, decreased and unchanged groups
- Show each group's call and failure counts, search its input and jump to the exact recorded source call
- Match full inputs before redaction or display truncation, including the MCP server/tool identity
- Retain old report import support; reports without matching metadata explain how to regenerate the comparison
- Keep narrow-screen comparison rows readable and horizontal metric scrolling contained
- Clear stale comparison content when importing a single run, so saved HTML does not retain the previous recording's comparison

## 0.1.1 — 2026-10-13

- Rebuilt the report around playback, adjacent call input/results and a horizontal session track
- Start at the first recorded failure; keep step controls, filters and bilingual navigation accessible
- Refreshed product documentation, screenshots and mobile layout

## 0.1.0

Initial working CLI, standalone offline report, bilingual interactive demo and automated validation
