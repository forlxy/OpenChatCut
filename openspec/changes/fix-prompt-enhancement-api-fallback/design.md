## Context

`generateAgentText` already resolves a generation model through `generationChoice()`. That resolver prefers the active API model and otherwise falls back to the configured default API provider/model. The prompt enhancement entry point passes `requireActiveApiModel`, but the guard currently checks only `getActiveAgentModelChoice()`, so it rejects the same fallback that the generation path is prepared to use.

## Goals / Non-Goals

**Goals:**

- Make the prompt enhancement guard validate the resolved generation choice, not only the UI's active choice.
- Keep the existing fallback order and provider configuration behavior unchanged.
- Make the fallback and no-API cases directly verifiable without making a real model request.

**Non-Goals:**

- Changing the model picker or how active models are persisted.
- Changing provider credentials, API routes, output limits, or ordinary chat generation.
- Automatically switching the user's visible active model.

## Decisions

1. **Resolve once, then validate and generate.** Compute the existing `generationChoice()` result before the guard, require that result to be an API choice when the option is set, and reuse it for provider/model/capability selection. This removes the contradictory active-only check and avoids resolving the model twice.
   - **Alternative rejected:** Remove the guard entirely. That would allow a subscription-only session to fall through to global defaults and produce a less precise failure.
   - **Alternative rejected:** Remove the fallback from `generationChoice()`. That would fix the error message by disabling a useful behavior already used by generation.
2. **Keep the option name for this change.** `requireActiveApiModel` is an internal call-site option and changing its name would add API churn without changing the required behavior. Its effective contract becomes “the resolved choice must be an API model.”
3. **Keep the selection boundary explicit.** Use one resolved choice for the guard and request construction so the active API, inactive API with fallback, and no API cases remain directly inspectable in the existing verification flow without adding a provider call.

## Risks / Trade-offs

- [Risk] A fallback API model may be less obvious to a user who selected a subscription model. → Keep the existing prompt enhancement UI and error wording, and do not change the visible active selection; the fallback is only for this independent text request.
- [Risk] Model-selection state is process-global in verification scripts. → Restore or isolate the fixture state within the verification entry point and avoid network calls.
