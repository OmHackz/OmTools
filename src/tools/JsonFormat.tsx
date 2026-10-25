import { useState } from "react";
import { useSeo } from "../lib/seo";
import { ToolShell } from "./ToolShell";

export function JsonFormat() {
  useSeo("JSON Prettify — OmTools", "Format, validate, and minify JSON with clear errors.");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [indent, setIndent] = useState(2);

  const run = (mode: "prettify" | "minify" | "validate") => {
    setError("");
    setOutput("");
    if (!input.trim()) return;
    try {
      const parsed = JSON.parse(input);
      if (mode === "minify") {
        setOutput(JSON.stringify(parsed));
      } else {
        setOutput(JSON.stringify(parsed, null, indent));
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
          <button className="btn" onClick={() => run("prettify")}>Prettify</button>
          <button className="btn" onClick={() => run("minify")}>Minify</button>
          <button className="btn" onClick={() => run("validate")}>Validate</button>
          <select value={indent} onChange={(e) => setIndent(Number(e.target.value))} aria-label="Indent size">
            <option value={2}>2 spaces</option>
            <option value={4}>4 spaces</option>
            <option value={1}>1 space</option>
          </select>
        </div>
        <div className="two-col">
          <label className="panel">
            <span className="panel-label mono">Input</span>
            <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder='{"om":"tools"}' spellCheck={false} />
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
