## Why

提示词增强和普通生成使用了两套模型选择判断。普通生成会在当前没有可用 API 模型时回退到已配置的默认 API choice，但提示词增强只检查当前选中的模型，因此用户选中订阅模型时，即使项目已经配置了可用 API，增强功能仍会误报需要先选择 API 模型。统一这两条路径，避免可用配置被错误拒绝。

## What Changes

- 让提示词增强复用现有的 API 模型回退选择逻辑。
- 保留没有任何可用 API 模型时的明确错误提示。
- 保持选择边界清晰，使当前模型为订阅模型但存在默认 API 模型、以及确实没有 API 模型的场景都能被现有验证流程覆盖。

## Capabilities

### New Capabilities

- `prompt-enhancement`: 在有可用 API 模型时稳定执行提示词增强，并在无可用模型时返回可理解的失败结果。

### Modified Capabilities

无。

## Impact

- 影响 `src/agent/client.ts` 的模型选择与提示词增强调用。
- 影响 `src/agent/agent-session.ts` 的提示词增强入口及其验证代码。
- 不改变模型配置格式、外部 API 协议或普通聊天模型选择行为。
