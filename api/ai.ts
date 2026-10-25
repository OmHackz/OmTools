/**
 * OmTools AI proxy — Vercel serverless function.
 *
 * Set AI_API_KEY (and optionally AI_BASE_URL / AI_MODEL) in the Vercel
 * project's environment variables. Without a key the endpoint falls back
 * to the deterministic local enhancer.
 */
import { enhancePrompt, type EnhanceOptions } from "../shared/enhancer";

type VercelRequest = {
  method?: string;
  body?: unknown;
};

type VercelResponse = {
  status: (code: number) => VercelResponse;
  json: (body: unknown) => void;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const body = (
      typeof req.body === "string" ? JSON.parse(req.body) : req.body
    ) as EnhanceOptions;
    if (!body || typeof body.prompt !== "string" || !body.prompt.trim()) {
      res.status(400).json({ error: "Missing prompt" });
      return;
    }
    const result = await enhancePrompt(body, process.env);
    res.status(200).json(result);
  } catch (error) {
    res
      .status(500)
      .json({ error: error instanceof Error ? error.message : "Unexpected error" });
  }
}
