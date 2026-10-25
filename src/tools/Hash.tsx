import { useState } from "react";
import { useSeo } from "../lib/seo";
import { ToolShell } from "./ToolShell";

type HashAlgo = "SHA-256" | "SHA-1";

async function hashText(text: string, algo: HashAlgo): Promise<string> {
  const data = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest(algo, data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function Hash() {
  useSeo("Hash — OmTools", "Compute SHA-1 and SHA-256 hashes of text in your browser.");
  const [input, setInput] = useState("");
  const [algo, setAlgo] = useState<HashAlgo>("SHA-256");
  const [results, setResults] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  const run = async () => {
    if (!input) {
      setResults({});
      return;
    }
    setBusy(true);
    try {
      const h = await hashText(input, algo);
      setResults({ [algo]: h });
    } finally {
      setBusy(false);
    }
  };

  const copy = (v: string) => navigator.clipboard.writeText(v);

  return (
    <ToolShell>
      <div className="tool-body">
        <div className="control-row">
          <select value={algo} onChange={(e) => setAlgo(e.target.value as HashAlgo)}>
            <option value="SHA-256">SHA-256</option>
            <option value="SHA-1">SHA-1</option>
          </select>
          <button className="btn" onClick={run} disabled={busy}>
            {busy ? "Hashing…" : "Hash"}
          </button>
        </div>
        <label className="panel">
          <span className="panel-label mono">Text</span>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Enter text to hash" spellCheck={false} />
        </label>
        {Object.entries(results).map(([k, v]) => (
          <div key={k} className="result-card">
            <span className="mono result-meta">{k}</span>
            <code className="mono hash-value">{v}</code>
            <button className="btn btn-ghost" onClick={() => copy(v)}>Copy</button>
          </div>
        ))}
      </div>
    </ToolShell>
  );
}
