import { useState } from "react";
import { useSeo } from "../lib/seo";
import { ToolShell } from "./ToolShell";

function encode(s: string): string {
  try {
    return btoa(unescape(encodeURIComponent(s)));
  } catch {
    return s;
  }
}

function decode(s: string): string {
  try {
    return decodeURIComponent(escape(atob(s.trim())));
  } catch {
    return "";
  }
}

export function Base64() {
  useSeo("Base64 — OmTools", "Encode and decode Base64 text instantly in your browser.");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [dir, setDir] = useState<"encode" | "decode">("encode");

  const convert = () => {
    setError("");
    if (!input) {
      setOutput("");
      return;
    }
    if (dir === "encode") {
      setOutput(encode(input));
    } else {
      const decoded = decode(input);
      if (decoded === "" && input.trim() !== "") {
        setError("Invalid Base64 input");
        setOutput("");
      } else {
        setOutput(decoded);
      }
    }
  };

  const copy = () => {
    navigator.clipboard.writeText(output);
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
          <button className="btn" onClick={convert}>
            {dir === "encode" ? "Encode" : "Decode"}
          </button>
          {output ? <button className="btn btn-ghost" onClick={copy}>Copy</button> : null}
        </div>
        <div className="two-col">
          <label className="panel">
            <span className="panel-label mono">Input</span>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={dir === "encode" ? "Hello" : "SGVsbG8="}
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
