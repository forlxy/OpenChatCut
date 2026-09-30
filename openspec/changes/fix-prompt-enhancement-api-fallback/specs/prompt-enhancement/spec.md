## ADDED Requirements

### Requirement: Prompt enhancement uses the resolved API generation choice

When prompt enhancement requests an API model, the system SHALL validate the same resolved generation choice that it uses for the request. An active API model SHALL be preferred; when the active model is not an API model, a configured default API choice SHALL be used if one exists.

#### Scenario: Active API model is used

- **WHEN** prompt enhancement is requested while the active model is an API choice
- **THEN** the request uses that active provider, model, API mode, and capability limits

#### Scenario: Subscription model falls back to configured API

- **WHEN** prompt enhancement is requested while the active model is a subscription-backed choice and a configured default API choice exists
- **THEN** the request is accepted and uses the resolved default API choice without changing the visible active model

#### Scenario: No API choice is available

- **WHEN** prompt enhancement is requested and neither the active model nor the configured choices resolve to an API model
- **THEN** the request is rejected before provider invocation with the existing actionable API-model error
