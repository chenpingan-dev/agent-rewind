# Report design

Agent Rewind is a recording player. Its primary interaction is moving between recorded steps and comparing runs.

- Use a light silver canvas, dark playback controls and a restrained coral accent for the track and findings
- Keep call input and result adjacent on desktop, with the horizontal session track below the player
- Show diagnostics beside the selected step; keep navigation, replay and comparison distinct
- Microsoft YaHei comes first in the font stack, followed by Chinese and sans-serif fallbacks
- Use short action labels in both languages; avoid internal project-priority labels and sentence-final punctuation on short Chinese UI labels
- Preserve readable contrast, keyboard focus, localized control labels and reduced-motion preferences
- At narrow widths, stack input/result and keep horizontal scrolling inside the session track

The interface must remain different from Patch Orbit's map workspace. Do not copy its package sidebar or turn the player into a generic admin dashboard.

Before publishing UI changes, inspect both languages at desktop and phone sizes. Exercise playback, step selection, search, filters, findings, comparison, imports and portable HTML export. Keep reports self-contained and synthetic fixtures clearly labeled. Never invent timing, usage or performance claims.
