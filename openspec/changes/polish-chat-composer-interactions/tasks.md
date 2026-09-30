## 1. Composer interaction and availability

- [x] 1.1 Update slash completion keyboard handling so unmatched Enter follows normal submission, Tab is not consumed without matches, and Escape preserves the draft.
- [x] 1.2 Enable prompt enhancement from the loaded model snapshot when any configured API choice is available, including subscription-backed active models.
- [x] 1.3 Add dedicated enhancement error props, status rendering, and textarea `aria-describedby` wiring while keeping attachment status independent.

## 2. Controller state and messaging

- [x] 2.1 Add independent enhancement error state and reset, set, and dismiss it through the chat panel controller and view.
- [x] 2.2 Add localized labels for enhancement and attachment failures and update the no-API error wording to describe configured fallback behavior.

## 3. Review

- [x] 3.1 Inspect the changed paths for stale shared-error references, conflict markers, and whitespace errors, then record the OpenSpec task completion.
