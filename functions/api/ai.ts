/**
 * OmTools AI proxy — Cloudflare Pages Function.
 *
 * POST /api/ai
 * Body: { prompt, agent?, framework?, designSystem?, targetModel?, enhanceType?, systemPrompt? }
 *
 * Environment variables (set as Pages secrets/vars):
 *   AI_API_KEY   — required for model-powered enhancement (falls back locally without it)
 *   AI_BASE_URL  — optional, default https://api.openai.com/v1 (any OpenAI-compatible endpoint)
 *   AI_MODEL     — optional, default gpt-4o-mini
 */
import {
  enhancePrompt,
  type EnhanceOptions,
} from "../../api/_lib/enhancer";

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export const onRequest = async (context: {
  request: Request;
  env?: Record<string, unknown>;
}): Promise<Response> => {
  if (context.request.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  try {
    const body = (await context.request.json()) as EnhanceOptions;
    if (!body || typeof body.prompt !== "string" || !body.prompt.trim()) {
      return json({ error: "Missing prompt" }, 400);
    }
    const env = (context.env ?? {}) as Record<string, string | undefined>;
    const result = await enhancePrompt(body, env);
    return json(result);
  } catch (error) {
    return json(
      { error: error instanceof Error ? error.message : "Unexpected error" },
      500
    );
  }
};
