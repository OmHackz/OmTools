import { useState } from "react";
import { useSeo } from "../lib/seo";
import { ToolShell } from "./ToolShell";

export function UrlEncode() {
  useSeo("URL Encode — OmTools", "Encode and decode URL components and full URLs.");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [dir, setDir] = useState<"encode" | "decode">("encode");

  const convert = (mode: "component" | "full") => {
    try {
      if (dir === "encode") {
        setOutput(mode === "component" ? encodeURIComponent(input) : encodeURI(input));
      } else {
        setOutput(mode === "component" ? decodeURIComponent(input) : decodeURI(input));
      }
    } catch {
      setOutput("");
    }
  };

  return (
    <ToolShell>
      <div className="tool-body">
        <div className="control-row">
          <button className={`btn ${dir === "encode" ? "" : "btn-ghost"}`} onClick={() => setDir("encode")}>
            Encode
          </button>
          <button className={`btn ${dir === "decode" ? "" : "btn-ghost"}`} onClick={() => setDir("decode")}>
            Decode
          </button>
          <button className="btn" onClick={() => convert("component")}>
            {dir === "encode" ? "Encode component" : "Decode component"}
          </button>
          <button className="btn btn-ghost" onClick={() => convert("full")}>
            {dir === "encode" ? "Encode URL" : "Decode URL"}
          </button>
        </div>
        <div className="two-col">
          <label className="panel">
            <span className="panel-label mono">Input</span>
            <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="hello world" spellCheck={false} />
          </label>
          <label className="panel">
            <span className="panel-label mono">Output</span>
            <textarea value={output} readOnly placeholder="result appears here" spellCheck={false} />
          </label>
        </div>
      </div>
    </ToolShell>
  );
}
