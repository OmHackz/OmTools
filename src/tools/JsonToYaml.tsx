import { useState } from "react";
import { useSeo } from "../lib/seo";
import { ToolShell } from "./ToolShell";

function jsonToYaml(obj: unknown, indent = 0): string {
  const pad = "  ".repeat(indent);
  if (obj === null || obj === undefined) return "null";
  if (typeof obj !== "object") return String(obj);
  if (Array.isArray(obj)) {
    if (obj.length === 0) return "[]";
    return obj
      .map((item) => {
        const line = jsonToYaml(item, indent + 1);
        return `${pad}- ${line.startsWith("  ") ? line.trim() : line}`.replace(/^  - /, `${pad}- `);
      })
      .join("\n");
  }
  const entries = Object.entries(obj as Record<string, unknown>);
  if (entries.length === 0) return "{}";
  return entries
    .map(([k, v]) => {
      if (v !== null && typeof v === "object") {
        return `${pad}${k}:\n${jsonToYaml(v, indent + 1)}`;
      }
      return `${pad}${k}: ${String(v)}`;
    })
    .join("\n");
}

function yamlToJson(text: string): string {
  try {
    const JSON5 = (window as unknown as { JSON5?: { parse: (s: string) => unknown } }).JSON5;
    void JSON5;
  } catch {
    /* noop */
  }
  // Minimal YAML-to-JSON parser for flat / nested key-value maps
  const lines = text.split(/\r?\n/).filter((l) => l.trim() && !l.trim().startsWith("#"));
  const result: Record<string, unknown> = {};
  const stack: { indent: number; ref: Record<string, unknown> }[] = [{ indent: -1, ref: result }];

  for (const line of lines) {
    const match = line.match(/^(\s*)([\w-]+):\s*(.*)$/);
    if (!match) continue;
    const indent = match[1].length;
    const key = match[2];
    let value = match[3].trim();

    while (stack.length > 1 && stack[stack.length - 1].indent >= indent) stack.pop();
    const parent = stack[stack.length - 1].ref;

    if (value === "") {
      const next: Record<string, unknown> = {};
      parent[key] = next;
      stack.push({ indent, ref: next });
    } else if (value === "true") {
      parent[key] = true;
    } else if (value === "false") {
      parent[key] = false;
    } else if (value === "null") {
      parent[key] = null;
    } else if (/^-?\d+(\.\d+)?$/.test(value)) {
      parent[key] = Number(value);
    } else {
      parent[key] = value.replace(/^["']|["']$/g, "");
    }
  }
  return JSON.stringify(result, null, 2);
}

export function JsonToYaml() {
  useSeo("JSON ⇄ YAML — OmTools", "Convert between JSON and YAML instantly in your browser.");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [dir, setDir] = useState<"json2yaml" | "yaml2json">("json2yaml");

  const convert = () => {
    setError("");
    if (!input.trim()) {
      setOutput("");
      return;
    }
    try {
      if (dir === "json2yaml") {
        const parsed = JSON.parse(input);
        setOutput(jsonToYaml(parsed));
      } else {
        setOutput(yamlToJson(input));
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setOutput("");
    }
  };

  return (
    <ToolShell>
      <div className="tool-body">
        <div className="control-row">
          <button className={`btn ${dir === "json2yaml" ? "" : "btn-ghost"}`} onClick={() => setDir("json2yaml")}>
            JSON → YAML
          </button>
          <button className={`btn ${dir === "yaml2json" ? "" : "btn-ghost"}`} onClick={() => setDir("yaml2json")}>
            YAML → JSON
          </button>
          <button className="btn" onClick={convert}>Convert</button>
        </div>
        <div className="two-col">
          <label className="panel">
            <span className="panel-label mono">Input</span>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={dir === "json2yaml" ? '{ "key": "value" }' : "key: value"}
              spellCheck={false}
            />
          </label>
          <label className="panel">
            <span className="panel-label mono">Output</span>
            <textarea
              value={output}
              readOnly
              placeholder="result appears here"
              spellCheck={false}
            />
          </label>
        </div>
        {error ? <p className="error mono">{error}</p> : null}
      </div>
    </ToolShell>
  );
}
