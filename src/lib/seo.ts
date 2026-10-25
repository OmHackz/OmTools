import { useEffect } from "react";
import { sections, tools, type Tool } from "./registry";

/** Set document title + meta description for the current page. */
export function useSeo(title: string, description: string) {
  useEffect(() => {
    document.title = title;
    let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content = description;
  }, [title, description]);
}

export interface SeoMeta {
  title: string;
  description: string;
}

export function toolMeta(tool: Tool): SeoMeta {
  return {
    title: `${tool.name} — OmTools`,
    description: tool.description,
  };
}

export function sectionMeta(sectionId: string): SeoMeta | null {
  const section = sections.find((s) => s.id === sectionId);
  if (!section) return null;
  return {
    title: `${section.name} tools — OmTools`,
    description: section.description,
  };
}

export const homeMeta: SeoMeta = {
  title: "OmTools — free web tools",
  description:
    "Free, private, no-login web tools for images, conversion, developers, and text.",
};

/** Generate a sitemap.xml string covering every tool and section route. */
export function buildSitemap(base = "https://tools.omhackz.top"): string {
  const urls: string[] = ["/", ...sections.map((s) => `/${s.id}`), ...tools.map((t) => `/tools/${t.id}`)];
  const entries = urls
    .map(
      (u) => `  <url>
    <loc>${base}${u}</loc>
    <changefreq>weekly</changefreq>
  </url>`
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`;
}
