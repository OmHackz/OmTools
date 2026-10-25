// Tool registry — single source of truth for home, sections, palette, sitemap, SEO.
export type SectionId = "image" | "converter" | "developer" | "text" | "ai";

export interface Tool {
  /** URL slug, used in /tools/<slug> */
  id: string;
  /** Human name shown on tiles and palette */
  name: string;
  section: SectionId;
  description: string;
  keywords: string[];
  /** Whether the tool is implemented. Shell tools are listed but gated. */
  ready: boolean;
  /** Short label shown on the tile, e.g. "PNG → WebP" */
  tag?: string;
}

export interface Section {
  id: SectionId;
  name: string;
  description: string;
}

export const sections: Section[] = [
  {
    id: "image",
    name: "Image",
    description: "Compress, resize, and convert images entirely in your browser.",
  },
  {
    id: "converter",
    name: "Converter",
    description: "Convert between JSON, YAML, CSV, Base64, and more.",
  },
  {
    id: "developer",
    name: "Developer",
    description: "Regex tester, JSON prettify, URL encoding, and dev utilities.",
  },
  {
    id: "text",
    name: "Text",
    description: "Word counts, case conversion, and text cleanup tools.",
  },
  {
    id: "ai",
    name: "AI",
    description: "AI-powered helpers that run on your terms — no login, no ads.",
  },
];

export const tools: Tool[] = [
  // image
  {
    id: "image-compress",
    name: "Compress Image",
    section: "image",
    description: "Reduce image file size in your browser using WebP/AVIF encoding.",
    keywords: ["image", "compress", "webp", "avif", "resize", "small", "photo"],
    ready: true,
    tag: "in-browser",
  },
  {
    id: "image-resize",
    name: "Resize Image",
    section: "image",
    description: "Resize an image to exact dimensions with quality control.",
    keywords: ["image", "resize", "dimensions", "width", "height", "scale"],
    ready: true,
    tag: "in-browser",
  },
  {
    id: "image-convert",
    name: "Convert Image",
    section: "image",
    description: "Convert between PNG, JPG, and WebP formats.",
    keywords: ["image", "convert", "png", "jpg", "jpeg", "webp", "format"],
    ready: true,
    tag: "in-browser",
  },
  // converter
  {
    id: "json-to-yaml",
    name: "JSON → YAML",
    section: "converter",
    description: "Convert JSON to YAML and back.",
    keywords: ["json", "yaml", "convert", "format"],
    ready: true,
    tag: "json ⇄ yaml",
  },
  {
    id: "json-to-csv",
    name: "JSON → CSV",
    section: "converter",
    description: "Convert JSON arrays to CSV and back.",
    keywords: ["json", "csv", "convert", "spreadsheet", "table"],
    ready: true,
    tag: "json ⇄ csv",
  },
  {
    id: "base64",
    name: "Base64",
    section: "converter",
    description: "Encode and decode Base64 text instantly.",
    keywords: ["base64", "encode", "decode", "text"],
    ready: true,
    tag: "encode ⇄ decode",
  },
  {
    id: "hash",
    name: "Hash",
    section: "converter",
    description: "Compute MD5, SHA-1, and SHA-256 hashes of text.",
    keywords: ["hash", "md5", "sha", "sha256", "checksum", "digest"],
    ready: true,
    tag: "md5 · sha-256",
  },
  // developer
  {
    id: "regex",
    name: "Regex Tester",
    section: "developer",
    description: "Test regular expressions against text with live matches.",
    keywords: ["regex", "regexp", "pattern", "test", "match", "search"],
    ready: true,
    tag: "live matches",
  },
  {
    id: "json-format",
    name: "JSON Prettify",
    section: "developer",
    description: "Format, validate, and minify JSON with clear error messages.",
    keywords: ["json", "format", "prettify", "minify", "validate", "beautify"],
    ready: true,
    tag: "format · validate",
  },
  {
    id: "url-encode",
    name: "URL Encode",
    section: "developer",
    description: "Encode and decode URL components and full URLs.",
    keywords: ["url", "encode", "decode", "uri", "component"],
    ready: true,
    tag: "encode ⇄ decode",
  },
  // text
  {
    id: "word-count",
    name: "Word Count",
    section: "text",
    description: "Count words, characters, lines, and sentences.",
    keywords: ["word", "count", "characters", "lines", "text", "read"],
    ready: true,
    tag: "stats",
  },
  {
    id: "case-convert",
    name: "Case Converter",
    section: "text",
    description: "Convert text between uppercase, lowercase, camelCase, and snake_case.",
    keywords: ["case", "upper", "lower", "camel", "snake", "kebab", "text"],
    ready: true,
    tag: "case styles",
  },
  // ai
  {
    id: "prompt-enhancer",
    name: "Prompt Enhancer",
    section: "ai",
    description: "Enhance AI prompts with frameworks, design systems, models, and agents.",
    keywords: ["prompt", "enhance", "ai", "framework", "design", "system", "model", "agent"],
    ready: true,
    tag: "ai enhancer",
  },
];

export function toolsBySection(section: SectionId): Tool[] {
  return tools.filter((t) => t.section === section);
}

export function getTool(id: string): Tool | undefined {
  return tools.find((t) => t.id === id);
}

/** Fuzzy search across name, description, keywords, and section name. */
export function searchTools(query: string): Tool[] {
  const q = query.trim().toLowerCase();
  if (!q) return tools;
  return tools.filter((t) => {
    const sectionName =
      sections.find((s) => s.id === t.section)?.name.toLowerCase() ?? "";
    const haystack = [
      t.name,
      t.description,
      sectionName,
      ...(t.keywords ?? []),
    ]
      .join(" ")
      .toLowerCase();
    return q
      .split(/\s+/)
      .every((part) => haystack.includes(part));
  });
}
