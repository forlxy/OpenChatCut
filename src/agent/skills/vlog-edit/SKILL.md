---
name: vlog-edit
description: Edit everyday, travel, food, family or retrospective vlog footage from existing project assets, with configurable duration, framing, pacing, original sound, captions and music. Use for a vlog rather than an advertisement or generated film.
---

# Vlog editing

Read the current project and inventory existing sources before editing. Inspect actual source frames with `view_asset_frames` and use saved transcripts for speech. A filename, similarity score, generated description or a few sampled frames cannot establish a person's identity or the story of a whole recording. With old, blurry or ambiguous footage, describe what is visible and retain uncertainty; inspect additional timestamps when necessary. Do not invent tags or replace real people with imagined characters.

## Editing preferences

Use preferences supplied in the user's message. For missing preferences, state these defaults briefly before editing; they remain adjustable through the chat:

- Duration: aim for 60–90 seconds only if the available material supports it; do not pad or repeat footage to reach a target.
- Framing: preserve the current project's aspect ratio; change to vertical only when requested, checking subjects and text after cropping.
- Pacing: natural everyday diary. For travel, group verified places/events in source chronology; for retrospective footage, allow longer holds and preserve original proportions.
- Sound: retain speech and useful ambient sound, remove only verified dead time. Do not synthesize narration or add music unless requested. When supplied music is requested, lower it under speech.
- Captions: use verified speech/transcripts; no guessed dialogue, dates, places or names. Titles are optional, not invented facts.
- Effects: straight cuts by default; use modest transitions only where they serve continuity. Do not add unrelated animation, stock footage or generation.

## Execute and verify

1. Give a compact proposed sequence with asset IDs, verified source ranges and any missing evidence. Respect an existing edit and the user's stated constraints.
2. Use the project's existing timeline tools to create a reversible rough cut. Keep continuity and intelligible speech ahead of beat matching.
3. Inspect the composed timeline at edit boundaries and compare source ranges with the intended story. Check duration, crop, captions and audio; explicitly report checks that could not run.
4. For external MCP, `target_project` must return a browser binding for visual inspection and `load_skill`. An offline binding can edit saved structure but cannot watch source footage: open `editorUrl`, reconnect and target the project before content-based editing.
5. External edits require `begin_edit_session`, the returned `editSessionId` on subsequent calls, then `review_edit_session`. Report an applied edit only after session status is `applied`; a pending proposal is not a finished timeline. Export only when requested and when the tool is available.
