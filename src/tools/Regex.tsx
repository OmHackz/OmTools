import { useMemo, useState } from "react";
import { useSeo } from "../lib/seo";
import { ToolShell } from "./ToolShell";

export function RegexTester() {
  useSeo("Regex Tester — OmTools", "Test regular expressions against text with live match highlighting.");
  const [pattern, setPattern] = useState("([a-z]+@\\w+\\.\\w+)");
  const [flags, setFlags] = useState("g");
  const [test, setTest] = useState("Contact: om@omtools.top or hello@omhackz.top for details.");

  const { matches, error } = useMemo(() => {
    if (!pattern) return { matches: [] as string[], error: "" };
    try {
      const re = new RegExp(pattern, flags);
      const found: string[] = [];
      let m: RegExpExecArray | null;
      while ((m = re.exec(test)) !== null) {
        found.push(m[0]);
        if (m.index === re.lastIndex) re.lastIndex++;
      }
      return { matches: found, error: "" };
    } catch (e) {
      return { matches: [] as string[], error: e instanceof Error ? e.message : String(e) };
    }
  }, [pattern, flags, test]);

  const highlighted = useMemo(() => {
    if (!pattern || error) return test;
    const re = new RegExp(pattern, flags.includes("g") ? flags : flags + "g");
    const parts: { text: string; hit: boolean }[] = [];
    let last = 0;
    let m: RegExpExecArray | null;
    while ((m = re.exec(test)) !== null) {
      if (m.index > last) parts.push({ text: test.slice(last, m.index), hit: false });
      parts.push({ text: m[0], hit: true });
      last = m.index + m[0].length;
      if (m.index === re.lastIndex) re.lastIndex++;
    }
    if (last < test.length) parts.push({ text: test.slice(last), hit: false });
    return parts;
  }, [test, pattern, flags, error]);

  return (
    <ToolShell>
      <div className="tool-body">
        <div className="control-row">
          <input
            className="mono regex-input"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            placeholder="pattern"
          />
          <select value={flags} onChange={(e) => setFlags(e.target.value)}>
            <option value="g">g</option>
            <option value="gi">gi</option>
            <option value="ig">ig</option>
            <option value="gm">gm</option>
            <option value="gmi">gmi</option>
          </select>
        </div>
        {error ? <p className="error mono">{error}</p> : null}
        <label className="panel">
          <span className="panel-label mono">Test string</span>
          <textarea value={test} onChange={(e) => setTest(e.target.value)} spellCheck={false} />
        </label>
        <div className="result-card">
          <span className="mono result-meta">{matches.length} match{matches.length !== 1 ? "es" : ""}</span>
        </div>
        <pre className="highlight-box mono">
          {typeof highlighted === "string" ? (
            <span>{highlighted}</span>
          ) : (
            highlighted.map((p) =>
              p.hit ? (
                <mark key={p.text} className="hl">{p.text}</mark>
              ) : (
                <span key={p.text}>{p.text}</span>
              )
            )
          )}
        </pre>
      </div>
    </ToolShell>
  );
}