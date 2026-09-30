## 1. Resolve the prompt-enhancement model consistently

- [x] 1.1 Refactor `src/agent/client.ts` so the API requirement validates the resolved `generationChoice()` result instead of only the active UI choice.
- [x] 1.2 Reuse that single resolved choice for provider, model, API mode, capability limits, and image support so the guard and request cannot disagree.

## 2. Review the affected behavior

- [x] 2.1 Confirm the active API, inactive API with fallback, and no-API paths match the prompt-enhancement specification without invoking a provider during the review.
- [x] 2.2 Run the repository whitespace/conflict checks and inspect the final diff for unrelated changes.
