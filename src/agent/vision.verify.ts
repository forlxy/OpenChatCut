import assert from 'node:assert/strict';
import { resolveVisionModel, setVisionModelConfig, type VisionModelConfig } from './visionConfig';
import { describeImagesForTextModel, maybeDescribeFramesResult } from './vision';
import type { AgentModelChoice } from './model-selection';
import type { ModelCapabilities } from '../../shared/model-capabilities';

function caps(supportsImages: boolean): ModelCapabilities {
  const exact = <T,>(value: T) => ({
    value, estimated: false, source: 'catalog' as const,
  });
  return {
    contextWindowTokens: exact(131_072),
    maxInputTokens: exact(131_072),
    maxOutputTokens: exact(8_192),
    supportsTools: exact(true),
    supportsImages: exact(supportsImages),
    supportsReasoning: exact(true),
    reasoningEfforts: exact([]),
  };
}

function choice(supportsImages: boolean): AgentModelChoice {
  return {
    id: 'api:test/deepseek',
    backend: 'api',
    provider: 'deepseek',
    providerLabel: 'DeepSeek',
    model: 'deepseek-v4-pro',
    capabilities: caps(supportsImages),
  };
}

const CUSTOM: VisionModelConfig = { mode: 'custom', provider: 'gemini', model: 'gemini-2.0-flash', openAiApiMode: null };

// ── resolveVisionModel ───────────────────────────────────────────────────────

assert.equal(resolveVisionModel(choice(true), CUSTOM), null, 'main model with vision never bypasses');
assert.equal(resolveVisionModel(choice(false), { mode: 'follow' }), null, 'follow keeps legacy strip behavior');
assert.equal(resolveVisionModel(choice(false), { mode: 'disabled' }), null, 'disabled never bypasses');
assert.deepEqual(resolveVisionModel(choice(false), CUSTOM), {
  provider: 'gemini', model: 'gemini-2.0-flash', openAiApiMode: 'chat',
}, 'custom + text-only main model resolves a vision ref');
assert.equal(resolveVisionModel(choice(false), { mode: 'custom', provider: 'gemini' }), null, 'missing model rejects');
assert.equal(resolveVisionModel(choice(false), { mode: 'custom', model: 'gemini-2.0-flash' }), null, 'missing provider rejects');
assert.equal(resolveVisionModel(undefined, CUSTOM), null, 'no active choice never bypasses');

// ── maybeDescribeFramesResult short-circuits (no LLM calls) ─────────────────

async function unchanged(result: unknown, resolveChoice: () => AgentModelChoice | undefined): Promise<boolean> {
  return (await maybeDescribeFramesResult(result, 'timeline-frames', undefined, resolveChoice)) === result;
}

// No images → untouched.
assert.equal(await unchanged({ ok: true, note: 'no frames' }, () => choice(false)), true);
// Frames but main model can see images → untouched.
assert.equal(await unchanged(
  { __images: [{ frame: 0, base64: 'abc' }], note: 'x' },
  () => choice(true),
), true);
// Frames, text-only main model, follow mode (no vision configured) → untouched.
assert.equal(await unchanged(
  { __images: [{ frame: 0, base64: 'abc' }], note: 'x' },
  () => choice(false),
), true);
// Frames but malformed payload → untouched.
assert.equal(await unchanged(
  { __images: [{ frame: 0 }], note: 'x' },
  () => choice(false),
), true);
// Non-object → untouched.
assert.equal(await unchanged('string result', () => choice(false)), true);
assert.equal(await unchanged(null, () => choice(false)), true);

// Result without images is returned even when vision IS configured.
const noImages = { ok: true };
assert.equal(await maybeDescribeFramesResult(noImages, 'qa-evidence', undefined, () => choice(false)), noImages);

// Bound actual in-flight calls, not just the size of an eagerly queued array.
const vision = { provider: 'gemini' as const, model: 'test', openAiApiMode: 'chat' as const };
let active = 0;
let peak = 0;
let calls = 0;
const described = await describeImagesForTextModel([{
  role: 'user', content: Array.from({ length: 9 }, (_, i) => ({ type: 'image' as const, image: `data:image/jpeg;base64,${i}` })),
}], vision, undefined, async (_vision, image) => {
  active += 1;
  peak = Math.max(peak, active);
  await new Promise((resolve) => setTimeout(resolve, 1));
  active -= 1;
  calls += 1;
  return image.base64;
});
assert.equal(calls, 9);
assert.equal(peak, 4);
assert.match(JSON.stringify(described), /8/);

setVisionModelConfig(CUSTOM);
try {
  const frames = { __images: [{ frame: 0, base64: 'first' }, { frame: 90, base64: 'last' }] };
  const all = await maybeDescribeFramesResult(frames, 'asset-frames', undefined, () => choice(false), async (_vision, image) => image.base64) as { visualSummary: string };
  assert.match(all.visualSummary, /first/);
  assert.match(all.visualSummary, /last/);
  assert.match(all.visualSummary, /90/);
  const failed = await maybeDescribeFramesResult(frames, 'asset-frames', undefined, () => choice(false), async (_vision, image) => {
    if (image.base64 === 'last') throw new Error('unavailable');
    return 'first';
  });
  assert.equal(failed, frames, 'a failed description must not drop remaining image evidence');
} finally {
  setVisionModelConfig({ mode: 'follow' });
}
console.log('vision.verify: resolution, bounded concurrency and complete frame evidence passed');
