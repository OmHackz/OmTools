# OmTools

Free, private, no-login web tools — images, converters, developer utilities, text, and AI.

Hosted at [tools.omhackz.top](https://tools.omhackz.top) · React + Vite + TypeScript.

## Development

```bash
npm install
cp .env.example .env   # optional: add AI_API_KEY
npm run dev            # http://localhost:5173
```

The dev server also serves `POST /api/ai` through a Vite middleware, so the
Prompt Enhancer works locally without a separate backend.

## Build

```bash
npm run build     # generates public/sitemap.xml, then bundles to dist/
npm run preview   # preview the production build
```

## Deploy

### Vercel

- Framework preset: **Vite**
- Build command: `npm run build`
- Output directory: `dist`
- Functions: `api/ai.ts` is picked up automatically
- Env vars: `AI_API_KEY`, optionally `AI_BASE_URL`, `AI_MODEL`

### Cloudflare Pages

- Build command: `npm run build`
- Output directory: `dist`
- Functions: `functions/api/ai.ts` (Pages Functions)
- Secrets: `wrangler pages secret put AI_API_KEY`
- Vars: `AI_BASE_URL`, `AI_MODEL` (see `wrangler.toml`)

## Environment variables

| Variable | Where | Purpose |
|---|---|---|
| `AI_API_KEY` | server only | OpenAI-compatible API key. Without it, Prompt Enhancer uses the deterministic local enhancer. |
| `AI_BASE_URL` | server only | API base URL. Default `https://api.openai.com/v1`. Works with Groq, Together, OpenRouter, Ollama, etc. |
| `AI_MODEL` | server only | Model used by the enhancer. Default `gpt-4o-mini`. |
| `VITE_UMAMI_SCRIPT_URL` | client | Umami analytics script URL. Leave empty to disable. |

## Project layout

```
shared/enhancer.ts        Prompt-enhancer logic shared by UI, dev server, and functions
src/lib/registry.ts       Single source of truth: sections, tools, search
src/routes/               Home, section pages, tool router
src/tools/                One component per tool
functions/api/ai.ts       Cloudflare Pages AI proxy
api/ai.ts                 Vercel AI proxy
scripts/gen-sitemap.mjs   Sitemap generator
```

## Adding a tool

1. Add an entry to `tools` in `src/lib/registry.ts`.
2. Create the component in `src/tools/` (use `ToolShell` for layout + `useSeo` for metadata).
3. Register it in the `components` map in `src/routes/ToolRoute.tsx`.

Everything else — home page, section listing, command palette search, sitemap — updates automatically.
