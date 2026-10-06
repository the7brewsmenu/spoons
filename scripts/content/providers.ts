/**
 * Provider layer. Plain fetch, no SDK dependencies.
 * Default: OpenAI Responses API with gpt-6.1-sol and JSON schema output.
 * Anthropic is supported as a fallback via forced tool use.
 */

export interface GenRequest {
  system: string;
  user: string;
  schemaName: string;
  jsonSchema: Record<string, unknown>;
}

export interface Usage {
  inputTokens: number;
  outputTokens: number;
}

export interface GenResult {
  data: unknown;
  usage: Usage;
}

export interface Provider {
  name: string;
  model: string;
  /** USD per 1M tokens. */
  pricing: { input: number; output: number };
  generate(req: GenRequest): Promise<GenResult>;
}

const DEFAULT_OPENAI_MODEL = 'gpt-6.1-sol';
const DEFAULT_ANTHROPIC_MODEL = 'claude-sonnet-4-5';

/** Known prices in USD per 1M tokens. Override with CONTENT_PRICE_INPUT / CONTENT_PRICE_OUTPUT. */
const PRICES: Record<string, { input: number; output: number }> = {
  'gpt-6.1-sol': { input: 2, output: 10 },
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function postJson(url: string, headers: Record<string, string>, body: unknown) {
  let lastError = '';
  for (let attempt = 0; attempt < 5; attempt++) {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json', ...headers },
      body: JSON.stringify(body),
    });
    if (res.ok) return res.json();
    lastError = `${res.status} ${await res.text()}`;
    if (res.status === 429 || res.status >= 500) {
      const wait = Number(res.headers.get('retry-after')) * 1000 || 2000 * 2 ** attempt;
      await sleep(wait);
      continue;
    }
    break;
  }
  throw new Error(`API request failed: ${lastError.slice(0, 600)}`);
}

function priceFor(model: string) {
  const envIn = Number(process.env.CONTENT_PRICE_INPUT);
  const envOut = Number(process.env.CONTENT_PRICE_OUTPUT);
  if (envIn && envOut) return { input: envIn, output: envOut };
  return PRICES[model] ?? { input: 0, output: 0 };
}

function openai(model: string, key: string): Provider {
  return {
    name: 'openai',
    model,
    pricing: priceFor(model),
    async generate(req) {
      const json = await postJson(
        'https://api.openai.com/v1/responses',
        { authorization: `Bearer ${key}` },
        {
          model,
          instructions: req.system,
          input: req.user,
          max_output_tokens: 32000,
          text: { format: { type: 'json_schema', name: req.schemaName, schema: req.jsonSchema, strict: false } },
        }
      );
      const text: string =
        json.output_text ??
        (json.output ?? [])
          .filter((o: { type: string }) => o.type === 'message')
          .flatMap((o: { content: { type: string; text?: string }[] }) => o.content)
          .filter((c: { type: string }) => c.type === 'output_text')
          .map((c: { text?: string }) => c.text ?? '')
          .join('');
      if (!text) throw new Error(`Empty response (status: ${json.status ?? 'unknown'})`);
      return {
        data: JSON.parse(text),
        usage: { inputTokens: json.usage?.input_tokens ?? 0, outputTokens: json.usage?.output_tokens ?? 0 },
      };
    },
  };
}

function anthropic(model: string, key: string): Provider {
  return {
    name: 'anthropic',
    model,
    pricing: priceFor(model),
    async generate(req) {
      const json = await postJson(
        'https://api.anthropic.com/v1/messages',
        { 'x-api-key': key, 'anthropic-version': '2023-06-01' },
        {
          model,
          max_tokens: 16000,
          system: req.system,
          messages: [{ role: 'user', content: req.user }],
          tools: [{ name: req.schemaName, description: 'Return the page content.', input_schema: req.jsonSchema }],
          tool_choice: { type: 'tool', name: req.schemaName },
        }
      );
      const block = (json.content ?? []).find((c: { type: string }) => c.type === 'tool_use');
      if (!block) throw new Error('No tool_use block in response');
      return {
        data: block.input,
        usage: { inputTokens: json.usage?.input_tokens ?? 0, outputTokens: json.usage?.output_tokens ?? 0 },
      };
    },
  };
}

export function getProvider(): Provider {
  const openaiKey = process.env.OPENAI_API_KEY;
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  const choice = process.env.CONTENT_PROVIDER ?? (openaiKey ? 'openai' : anthropicKey ? 'anthropic' : 'openai');

  if (choice === 'anthropic') {
    if (!anthropicKey) throw new Error('ANTHROPIC_API_KEY is not set in .env.local');
    return anthropic(process.env.CONTENT_MODEL ?? DEFAULT_ANTHROPIC_MODEL, anthropicKey);
  }
  if (!openaiKey) throw new Error('OPENAI_API_KEY is not set in .env.local');
  return openai(process.env.CONTENT_MODEL ?? DEFAULT_OPENAI_MODEL, openaiKey);
}

export function costUsd(usage: Usage, pricing: { input: number; output: number }) {
  return (usage.inputTokens / 1e6) * pricing.input + (usage.outputTokens / 1e6) * pricing.output;
}
