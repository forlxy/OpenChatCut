## Why

The chat composer currently treats every slash-prefixed draft as an active completion command. When there is no match, Enter is swallowed and Escape clears the draft, which makes ordinary paths and commands risky to type. Prompt enhancement already supports a configured API fallback in the runtime, but the composer hides the action for subscription-backed active models and presents enhancement failures as attachment import errors.

## What Changes

- Let unmatched slash-prefixed drafts submit normally and keep their text when the completion popover is dismissed with Escape.
- Show prompt enhancement whenever a configured API choice can service the request, including while a subscription-backed model remains visibly active.
- Give prompt enhancement failures their own status, message, dismiss action, and input accessibility relationship instead of reusing attachment import feedback.

## Capabilities

### New Capabilities

- `chat-composer`: Reliable slash completion, prompt enhancement availability, and distinct composer error feedback.

### Modified Capabilities

None.

## Impact

- Updates the React chat composer, its controller state, status overlays, and model availability check.
- Adds localized composer feedback strings; no new dependencies or network/API changes.
