import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { enhancePrompt, type EnhanceOptions } from "./api/_lib/enhancer.ts";

/**
 * Serves POST /api/ai during `vite dev` using the same enhancer logic as the
 * serverless functions. Production deploys use functions/api/ai.ts (Cloudflare)
 * or api/ai.ts (Vercel).
 */
function aiDevPlugin(env: Record<string, string>): Plugin {
  return {
    name: "omtools-ai-dev",
    configureServer(server) {
      server.middlewares.use("/api/ai", (req, res) => {
        res.setHeader("Content-Type", "application/json");

        if (req.method !== "POST") {
          res.statusCode = 405;
          res.end(JSON.stringify({ error: "Method not allowed" }));
          return;
        }

        let raw = "";
        req.on("data", (chunk) => {
          raw += chunk;
        });
        req.on("end", async () => {
          try {
            const body = JSON.parse(raw || "{}") as EnhanceOptions;
            if (!body.prompt || !body.prompt.trim()) {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: "Missing prompt" }));
              return;
            }
            const result = await enhancePrompt(body, env);
            res.statusCode = 200;
            res.end(JSON.stringify(result));
          } catch (error) {
            res.statusCode = 500;
            res.end(
              JSON.stringify({
                error: error instanceof Error ? error.message : "Unexpected error",
              })
            );
          }
        });
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "");
  return {
    plugins: [react(), aiDevPlugin(env)],
  };
});
