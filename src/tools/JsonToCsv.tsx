import { useState } from "react";
import { useSeo } from "../lib/seo";
import { ToolShell } from "./ToolShell";

function jsonToCsv(rows: unknown[]): string {
  if (rows.length === 0) return "";
  const keys = Object.keys(rows[0] as object);
  const escape = (val: unknown): string => {
    const s = val === null || val === undefined ? "" : typeof val === "object" ? JSON.stringify(val) : String(val);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const lines = [keys.join(",")];
  for (const row of rows) {
    const obj = row as Record<string, unknown>;
    lines.push(keys.map((k) => escape(obj[k])).join(","));
  }
  return lines.join("\n");
}

function csvToJson(text: string): string {
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) return "[]";
  const parseLine = (line: string, headers: string[]): Record<string, unknown> => {
    const cells: string[] = [];
    let current = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (inQuotes) {
        if (ch === '"') {
          if (line[i + 1] === '"') {
            current += '"';
            i++;
          } else {
            inQuotes = false;
          }
        } else {
          current += ch;
        }
      } else {
        if (ch === '"') inQuotes = true;
        else if (ch === ",") {
          cells.push(current);
          current = "";
        } else {
          current += ch;
        }
      }
    }
    cells.push(current);
    const row: Record<string, unknown> = {};
    headers.forEach((h, i) => {
      let v = cells[i] ?? "";
      if (/^-?\d+$/.test(v)) v = Number(v) as unknown as string;
      row[h] = v;
    });
    return row;
  };
  const headers = lines[0].split(",").map((h) => h.trim());
  const data = lines.slice(1).map((l) => parseLine(l, headers));
  return JSON.stringify(data, null, 2);
}

export function JsonToCsv() {
  useSeo("JSON ⇄ CSV — OmTools", "Convert JSON arrays to CSV and back, in your browser.");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [dir, setDir] = useState<"json2csv" | "csv2json">("json2csv");

  const convert = () => {
    setError("");
    if (!input.trim()) {
      setOutput("");
      return;
    }
    try {
      if (dir === "json2csv") {
        const parsed = JSON.parse(input);
        const rows = Array.isArray(parsed) ? parsed : [parsed];
        setOutput(jsonToCsv(rows));
      } else {
        setOutput(csvToJson(input));
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
          <button className={`btn ${dir === "json2csv" ? "" : "btn-ghost"}`} onClick={() => setDir("json2csv")}>
            JSON → CSV
          </button>
          <button className={`btn ${dir === "csv2json" ? "" : "btn-ghost"}`} onClick={() => setDir("csv2json")}>
            CSV → JSON
          </button>
          <button className="btn" onClick={convert}>Convert</button>
        </div>
        <div className="two-col">
          <label className="panel">
            <span className="panel-label mono">Input</span>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={dir === "json2csv" ? '[{"name":"om","tools":true}]' : "name,tools\nom,true"}
              spellCheck={false}
            />
          </label>
          <label className="panel">
            <span className="panel-label mono">Output</span>
            <textarea value={output} readOnly placeholder="result appears here" spellCheck={false} />
          </label>
        </div>
        {error ? <p className="error mono">{error}</p> : null}
      </div>
    </ToolShell>
  );
}
