import { useState } from "react";
import { useSeo } from "../lib/seo";
import { ToolShell } from "./ToolShell";

type CaseStyle =
  | "UPPER"
  | "lower"
  | "camelCase"
  | "PascalCase"
  | "snake_case"
  | "kebab-case"
  | "Title Case"
  | "SENTENCE case";

function words(s: string): string[] {
  return s
    .replace(/[_-]+/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .split(/\s+/)
    .filter(Boolean);
}

function transform(s: string, style: CaseStyle): string {
  const w = words(s);
  switch (style) {
    case "UPPER":
      return s.toUpperCase();
    case "lower":
      return s.toLowerCase();
    case "camelCase":
      return w
        .map((x, i) =>
          i === 0 ? x.toLowerCase() : x[0].toUpperCase() + x.slice(1).toLowerCase()
        )
        .join("");
    case "PascalCase":
      return w.map((x) => x[0].toUpperCase() + x.slice(1).toLowerCase()).join("");
    case "snake_case":
      return w.map((x) => x.toLowerCase()).join("_");
    case "kebab-case":
      return w.map((x) => x.toLowerCase()).join("-");
    case "Title Case":
      return w.map((x) => x[0].toUpperCase() + x.slice(1).toLowerCase()).join(" ");
    case "SENTENCE case": {
      const out = w.map((x) => x.toLowerCase()).join(" ");
      return out ? out[0].toUpperCase() + out.slice(1) : out;
    }
  }
}

export function CaseConvert() {
  useSeo("Case Converter — OmTools", "Convert text between case styles in one click.");
  const [input, setInput] = useState("");
  const [style, setStyle] = useState<CaseStyle>("UPPER");
  const output = input ? transform(input, style) : "";
  const copy = () => navigator.clipboard.writeText(output);

  return (
    <ToolShell>
      <div className="tool-body">
        <label className="panel">
          <span className="panel-label mono">Text</span>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="some mixed case text here"
            spellCheck={false}
          />
        </label>
        <div className="case-row">
          <div className="case-buttons">
            {(
              [
                "UPPER",
                "lower",
                "camelCase",
                "PascalCase",
                "snake_case",
                "kebab-case",
                "Title Case",
                "SENTENCE case",
              ] as CaseStyle[]
            ).map((s) => (
              <button
                key={s}
                className={`btn btn-sm ${style === s ? "" : "btn-ghost"}`}
                onClick={() => setStyle(s)}
              >
                {s}
              </button>
            ))}
          </div>
          {output ? <button className="btn btn-ghost" onClick={copy}>Copy</button> : null}
        </div>
        {output ? (
          <div className="result-card">
            <span className="case-output mono">{output}</span>
          </div>
        ) : null}
      </div>
    </ToolShell>
  );
}
