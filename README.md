# OmTools

![OmTools](https://img.shields.io/badge/OmTools-free%20web%20tools-4f7cff?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTMgM2gxOHYxOEgzVjN6Ii8+PC9zdmc+)
![No Login](https://img.shields.io/badge/login-none-2ec27e?style=for-the-badge)
![No Ads](https://img.shields.io/badge/ads-none-2ec27e?style=for-the-badge)
![Free](https://img.shields.io/badge/price-free-2ec27e?style=for-the-badge)

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

![React](https://img.shields.io/badge/React-18-61dafb?style=flat-square&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646cff?style=flat-square&logo=vite&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=flat-square&logo=typescript&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-7-ca4245?style=flat-square&logo=react-router&logoColor=white)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-000?style=flat-square&logo=vercel&logoColor=white)
![Cloudflare](https://img.shields.io/badge/Deploy-Cloudflare_Pages-f38020?style=flat-square&logo=cloudflare&logoColor=white)

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
shared/enhancer.ts        Prompt-enhancer logic shared by UI, dev server, and functions
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

![Stars](https://img.shields.io/github/stars/OmHackz/OmTools?style=social)
![Forks](https://img.shields.io/github/forks/OmHackz/OmTools?style=social)
![Issues](https://img.shields.io/github/issues/OmHackz/OmTools)
![Last Commit](https://img.shields.io/github/last-commit/OmHackz/OmTools)
![License](https://img.shields.io/github/license/OmHackz/OmTools)
