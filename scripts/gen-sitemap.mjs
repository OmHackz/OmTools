#!/usr/bin/env node
// Generates public/sitemap.xml from the tool registry.
import { buildSitemap } from "../src/lib/seo.ts";
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
writeFileSync(join(__dirname, "../public/sitemap.xml"), buildSitemap());
console.log("Wrote public/sitemap.xml");
