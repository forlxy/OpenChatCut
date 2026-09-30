## ADDED Requirements

### Requirement: Slash drafts preserve normal text editing and submission

The chat composer SHALL reserve Enter and Tab for skill activation only when the open slash completion list contains a matching skill. An unmatched slash draft SHALL remain editable and SHALL be submitted by Enter through the normal composer submit path. Escape SHALL close the completion popover without changing the draft text.

#### Scenario: Matching slash command activates a skill

- **WHEN** the slash completion popover is open and the list contains a match
- **THEN** Enter or Tab activates the selected match and clears the command draft as it does today

#### Scenario: Unmatched slash draft submits as text

- **WHEN** the user enters a slash-prefixed draft with no matching skill and presses Enter without Shift
- **THEN** the composer submits the unchanged draft through its normal submit callback

#### Scenario: Escape dismisses an unmatched draft popover

- **WHEN** the slash completion popover is open and the user presses Escape
- **THEN** the popover closes, the slash index resets, and the draft text remains unchanged

### Requirement: Prompt enhancement reflects configured API availability

The composer SHALL enable prompt enhancement when a configured API model choice is available, even if the visibly active chat model uses a subscription backend. The visible active model SHALL remain unchanged, and enhancement SHALL remain disabled when no API choice is available.

#### Scenario: Active API model enables enhancement

- **WHEN** the active model is an API choice and the draft is otherwise eligible
- **THEN** the prompt enhancement action is enabled

#### Scenario: Subscription model uses configured API fallback

- **WHEN** the active model is subscription-backed, a configured API choice exists, and the draft is otherwise eligible
- **THEN** the prompt enhancement action is enabled without changing the visible active model

#### Scenario: No API choice disables enhancement

- **WHEN** no configured API choice exists
- **THEN** the prompt enhancement action is disabled

### Requirement: Prompt enhancement failures have distinct accessible feedback

The composer SHALL display prompt enhancement failures in a dedicated status element with prompt-enhancement wording and an independent dismiss action. The textarea SHALL reference that element while the error is present, and attachment import failures SHALL remain associated with the attachment import status.

#### Scenario: Enhancement failure is identified separately

- **WHEN** a prompt enhancement request fails
- **THEN** the composer shows a dedicated labeled error status instead of presenting the failure as an attachment import error

#### Scenario: Enhancement error is connected to the input

- **WHEN** an enhancement error is visible
- **THEN** the textarea's `aria-describedby` includes the enhancement error element's ID

#### Scenario: Dismissing one error keeps unrelated status independent

- **WHEN** the user dismisses an enhancement error while an attachment import error is present
- **THEN** only the enhancement error is removed and the attachment status remains visible
