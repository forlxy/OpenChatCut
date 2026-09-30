## Context

The composer owns slash completion, model-aware action availability, and inline status feedback. Its slash popover is opened from the text value alone, so the keyboard handler must distinguish a real completion from an unmatched ordinary draft. The model snapshot already contains both the visible active choice and configured API choices; prompt enhancement resolves the same API fallback in `src/agent/client.ts`. Attachment imports and prompt enhancement currently share one error state and one status element.

## Goals / Non-Goals

**Goals:**

- Preserve ordinary slash-prefixed drafts and let the existing submit gate handle them.
- Keep the prompt enhancement action aligned with the configured API choices available to the runtime.
- Make enhancement failures visually and semantically distinct from attachment import failures, with an accessible relationship to the textarea.

**Non-Goals:**

- Changing the slash matching catalog or how a selected skill changes creative mode.
- Changing model selection persistence, provider resolution, or normal chat submission.
- Adding a new notification system or external dependency.

## Decisions

1. **Only consume completion keys when there is a match.** Enter and Tab continue to activate a matched skill. With zero matches, Enter falls through to the existing submit decision and Tab keeps its browser focus behavior; Escape closes the popover without changing the draft. This reuses the existing matching and submit logic instead of adding a second parser.
2. **Use the model snapshot for enhancement availability.** The composer enables enhancement when any loaded model choice has the API backend. That is the same configured-choice boundary used by the generation resolver's API fallback, and it avoids importing provider-generation code into the view.
3. **Keep independent error state.** Add `enhanceError` to the composer controller and pass it separately from `pasteError`. Render a dedicated alert element with its own ID, while retaining the existing import status for attachment and editor-document errors. Build `aria-describedby` from whichever status elements are present.
4. **Label raw failures at the display boundary.** Keep the underlying error string for debugging, but add a translated prompt-enhancement or attachment-import label where it is shown so users can identify which action failed.

## Risks / Trade-offs

- [Risk] A configured API choice may still fail due to credentials or provider availability. → The action remains enabled only because the runtime can resolve a choice; the dedicated error gives the user a clear failure category.
- [Risk] Changing Escape leaves an unmatched slash draft in place. → This matches normal popover dismissal and lets the user edit or submit the text; matched skills still clear the composer only after activation.

## Migration Plan

No data migration is required. The new error state starts empty and follows the existing project and seed reset paths.

## Open Questions

None.
