import { useMemo, useState } from "react";
import { useSeo } from "../lib/seo";
import { ToolShell } from "./ToolShell";

export function WordCount() {
  useSeo("Word Count — OmTools", "Count words, characters, lines, and sentences instantly.");
  const [text, setText] = useState("");

  const stats = useMemo(() => {
    const trimmed = text.trim();
    const words = trimmed ? trimmed.split(/\s+/).length : 0;
    const sentences = trimmed ? trimmed.split(/[.!?]+/).filter((s) => s.trim()).length : 0;
    const lines = trimmed ? text.split(/\r?\n/).filter((l) => l.trim()).length : 0;
    return {
      words,
      characters: text.length,
      charactersNoSpace: text.replace(/\s/g, "").length,
      sentences,
      lines,
      paragraphs: trimmed ? text.split(/\r?\n\s*\r?\n/).filter((p) => p.trim()).length : 0,
    };
  }, [text]);

  const items: [string, number][] = [
    ["Words", stats.words],
    ["Characters", stats.characters],
    ["No spaces", stats.charactersNoSpace],
    ["Sentences", stats.sentences],
    ["Lines", stats.lines],
    ["Paragraphs", stats.paragraphs],
  ];

  return (
    <ToolShell>
      <div className="tool-body">
        <label className="panel">
          <span className="panel-label mono">Text</span>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste or type text here…"
            spellCheck={false}
          />
        </label>
        <div className="stats-grid">
          {items.map(([label, value]) => (
            <div key={label} className="stat-box">
              <span className="stat-value mono">{value}</span>
              <span className="stat-label">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </ToolShell>
  );
}
