import type * as AgentRuntime from './runtime';
import type { LLMMessage } from './runtime';
import type { AgentReference } from './context';
import { getLocale, localeLanguageName } from '../i18n/locale';

export interface AgentRetryOptions {
  readonly askOnly?: boolean;
  readonly references?: AgentReference[];
}

export interface AgentRetry extends AgentRetryOptions {
  readonly text: string;
}

export interface DisplayMessage {
  /** `note`: a muted system line (e.g. which tool calls failed in a completed run); never sent to the model. */
  role: 'user' | 'assistant' | 'tool' | 'error' | 'continue' | 'note';
  text: string;
  thinking?: string;
  retry?: AgentRetry;
  tool?: { name: string; args: unknown; result: unknown };
}

export function createAgentRetry(
  text: string,
  options: AgentRetryOptions = {},
): AgentRetry | undefined {
  const trimmed = text.trim();
  if (!trimmed) return undefined;
  return {
    text: trimmed,
    ...(options.askOnly ? { askOnly: true } : {}),
    ...(options.references?.length ? { references: [...options.references] } : {}),
  };
}

/** Backfill retry metadata for chats persisted before retry support existed. */
export function ensureAgentRetryMetadata(messages: readonly DisplayMessage[]): DisplayMessage[] {
  return messages.map((message) => message.role !== 'user' || message.retry
    ? message
    : { ...message, retry: createAgentRetry(message.text) });
}


export interface LiveTool {
  name: string;
  partial: string;
}
// Deliberate lazy boundary: loading the chat shell must not eagerly load the AI SDK/runtime.

const importAgentRuntime = async (): Promise<typeof AgentRuntime> => import('./runtime');
let agentRuntimePromise: Promise<typeof AgentRuntime> | null = null;

export function preloadAgentRuntime(): Promise<typeof AgentRuntime> {
  if (!agentRuntimePromise) {
    agentRuntimePromise = importAgentRuntime().catch((error: unknown) => {
      agentRuntimePromise = null;
      throw error;
    });
  }
  return agentRuntimePromise;
}

export function initialAgentMessages(): LLMMessage[] {
  return [];
}

export async function enhanceAgentPrompt(draft: string): Promise<string> {
  const trimmed = draft.trim();
  if (!trimmed) return draft;
  // Deliberate lazy boundary: the prompt enhancer must not load provider SDKs before first use.
  const { generateAgentText } = await import('./client');
  const language = localeLanguageName(getLocale());
  const output = (await generateAgentText({
    maxOutputTokens: 1200,
    requireActiveApiModel: true,
    system: `Rewrite the user's video-editing request clearly in ${language}. Preserve their intent, explicit constraints, exact quoted text, asset references and uncertainty. Do not execute the request. Do not invent footage content, identities, labels, durations, music, styles, or permissions to generate/download assets. Organize only supplied details into goal, source material, editing requirements and delivery requirements, omitting empty sections. For vlog requests preserve chronology, original speech and ambient sound unless the user requests otherwise. Require inspecting actual source frames/transcripts before choosing cuts; filenames and similarity scores are not visual evidence. Output only the editable rewritten request, with short paragraphs when helpful.`,
    prompt: trimmed,
  })).trim();
  if (!output) throw new Error('提示词优化未返回内容，请重试。');
  return output;
}

export function appendRejectedProposal(messages: readonly LLMMessage[]): LLMMessage[] {
  return [...messages, {
    role: 'user',
    content: [
      'User clicked Deny and rejected this generation task. They may want adjustments; do not retry automatically.',
      '（用户拒绝了上述提案，未应用任何改动。不要自动重试生成。）',
    ].join('\n'),
  }];
}
