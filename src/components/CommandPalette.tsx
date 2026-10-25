import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { searchTools, type Tool } from "../lib/registry";

type Entry =
  | { kind: "tool"; tool: Tool }
  | { kind: "section"; sectionId: string; name: string; count: number };

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const entries = useMemo<Entry[]>(() => {
    const results = searchTools(query);
    const toolEntries: Entry[] = results.map((t) => ({ kind: "tool", tool: t }));
    return toolEntries;
  }, [query]);

  // Global keyboard shortcut
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("open-palette", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("open-palette", onOpen);
    };
  }, []);

  useEffect(() => {
    if (open) {
      setQuery("");
      setSelected(0);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  if (!open) return null;

  const go = (entry: Entry) => {
    if (entry.kind === "tool") {
      navigate(`/tools/${entry.tool.id}`);
    } else {
      navigate(`/${entry.sectionId}`);
    }
    setOpen(false);
  };

  return (
    <div
      className="palette-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
      onClick={() => setOpen(false)}
    >
      <div className="palette-panel" onClick={(e) => e.stopPropagation()}>
        <input
          ref={inputRef}
          className="palette-input"
          placeholder="Search tools…"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelected(0);
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setSelected((s) => Math.min(s + 1, entries.length - 1));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setSelected((s) => Math.max(s - 1, 0));
            } else if (e.key === "Enter" && entries[selected]) {
              go(entries[selected]);
            } else if (e.key === "Escape") {
              setOpen(false);
            }
          }}
        />
        <ul className="palette-list">
          {entries.length === 0 ? (
            <li className="palette-empty mono">No tools match “{query}”</li>
          ) : (
            entries.map((entry, i) => (
              <li key={entry.kind === "tool" ? `t-${entry.tool.id}` : `s-${entry.sectionId}`}>
                <button
                  className={i === selected ? "palette-item active" : "palette-item"}
                  onClick={() => go(entry)}
                  onMouseEnter={() => setSelected(i)}
                >
                  <span className="palette-item-kind mono">
                    {entry.kind === "tool" ? entry.tool.section : "section"}
                  </span>
                  <span className="palette-item-name">
                    {entry.kind === "tool" ? entry.tool.name : entry.name}
                  </span>
                  <span className="palette-item-desc">
                    {entry.kind === "tool" ? entry.tool.tag ?? "" : entry.count}
                  </span>
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
