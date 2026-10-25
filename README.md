# OmTools

![OmTools](https://shieldcn.dev/badge/OmTools-free%20web%20tools-4f7cff.svg?logo=lightning&variant=branded)
![No Login](https://shieldcn.dev/badge/login-none-2ec27e.svg?logo=lock&variant=secondary)
![No Ads](https://shieldcn.dev/badge/ads-none-2ec27e.svg?logo=ban&variant=secondary)
![Free](https://shieldcn.dev/badge/price-free-2ec27e.svg?logo=gift&variant=secondary)

**Free, private, no-login web tools** for images, conversion, developers, text, and AI. Everything runs in your browser. No tracking, no ads, no accounts.

🌐 **Live:** [tools.omhackz.top](https://tools.omhackz.top)

---

## ✨ Features

- ⚡ **Instant** — all tools run client-side, no uploads, no round trips
- 🔒 **Private** — your data never leaves your browser
- 🚫 **No login, no ads, no tracking** — just tools
- 🔍 **Command palette** — `Ctrl/Cmd + K` to find any tool instantly
- 📱 **Responsive** — works on desktop and mobile
- 🌙 **Dark, square UI** — inspired by [vite.dev](https://vite.dev)
- 🔎 **SEO-friendly** — static routes with per-tool metadata and sitemap
- 📊 **Umami analytics** — privacy-friendly, optional

## 🧰 Tool sections

| Section | Tools |
|---|---|
| **Image** | Compress, Resize, Convert (PNG/JPG/WebP) |
| **Converter** | JSON ⇄ YAML, JSON ⇄ CSV, Base64, Hash (SHA-256/SHA-1) |
| **Developer** | Regex Tester, JSON Prettify/Validate, URL Encode/Decode |
| **Text** | Word Count, Case Converter |
| **AI** | Prompt Enhancer (frameworks, design systems, target coders, custom providers) |

## 🛠 Tech stack

![React](https://shieldcn.dev/badge/React-18-61dafb.svg?logo=react)
![Vite](https://shieldcn.dev/badge/Vite-8-646cff.svg?logo=vite)
![TypeScript](https://shieldcn.dev/badge/TypeScript-5-3178c6.svg?logo=typescript)
![React Router](https://shieldcn.dev/badge/React_Router-7-ca4245.svg?logo=reactrouter)
![Vercel](https://shieldcn.dev/badge/Deploy-Vercel-000000.svg?logo=vercel)
![Cloudflare](https://shieldcn.dev/badge/Deploy-Cloudflare_Pages-f38020.svg?logo=cloudflare)

## 🚀 Getting started

```bash
git clone https://github.com/OmHackz/OmTools.git
cd OmTools
npm install
cp .env.example .env   # optional: add AI_API_KEY
npm run dev            # http://localhost:5173
```

## 🔑 Environment variables

| Variable | Where | Purpose |
|---|---|---|
| `AI_API_KEY` | server only | OpenAI-compatible API key. Without it, the Prompt Enhancer uses a deterministic local enhancer. |
| `AI_BASE_URL` | server only | API base URL. Default `https://api.openai.com/v1`. Works with Groq, Together, OpenRouter, Ollama, etc. |
| `AI_MODEL` | server only | Model used by the enhancer. Default `gpt-4o-mini`. |
| `VITE_UMAMI_SCRIPT_URL` | client | Umami analytics script URL. Leave empty to disable. |

## 📦 Build

```bash
npm run build     # generates public/sitemap.xml, then bundles to dist/
npm run preview   # preview the production build
```

## ☁️ Deploy

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

## 📁 Project layout

```
api/_lib/enhancer.ts  Prompt-enhancer logic shared by UI, dev server, and functions
src/lib/registry.ts       Single source of truth: sections, tools, search
src/routes/               Home, section pages, tool router
src/tools/                One component per tool
functions/api/ai.ts       Cloudflare Pages AI proxy
api/ai.ts                 Vercel AI proxy
scripts/gen-sitemap.mjs   Sitemap generator
```

## ➕ Adding a tool

1. Add an entry to `tools` in `src/lib/registry.ts`.
2. Create the component in `src/tools/` (use `ToolShell` for layout + `useSeo` for metadata).
3. Register it in the `components` map in `src/routes/ToolRoute.tsx`.

Everything else — home page, section listing, command palette search, sitemap — updates automatically.

## 🤝 Contributing

Pull requests welcome. Keep changes consistent with the existing square, dark UI style.

## 📄 License

MIT © [OmHackz](https://github.com/OmHackz)

---

![Stars](https://shieldcn.dev/github/stars/OmHackz/OmTools.svg?variant=secondary)
![Forks](https://shieldcn.dev/github/forks/OmHackz/OmTools.svg?variant=secondary)
![Issues](https://shieldcn.dev/github/issues/OmHackz/OmTools.svg?variant=secondary)
![Last Commit](https://shieldcn.dev/github/last-commit/OmHackz/OmTools.svg?variant=secondary)
![License](https://shieldcn.dev/github/license/OmHackz/OmTools.svg?variant=secondary)
