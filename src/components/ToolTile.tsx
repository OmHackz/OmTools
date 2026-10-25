import { Link } from "react-router-dom";
import type { Tool } from "../lib/registry";

export function ToolTile({ tool }: { tool: Tool }) {
  const disabled = !tool.ready;
  const inner = (
    <>
      <div className="tile-top">
        <span className="tile-name">{tool.name}</span>
        {tool.tag ? (
          <span className="tile-tag mono">{tool.tag}</span>
        ) : null}
      </div>
      <p className="tile-desc">{tool.description}</p>
      <div className="tile-bottom">
        <span className="tile-section mono">{tool.section}</span>
        <span className="tile-arrow">→</span>
      </div>
    </>
  );

  if (disabled) {
    return (
      <div className="tile tile-disabled" aria-disabled="true">
        {inner}
      </div>
    );
  }
  return (
    <Link to={`/tools/${tool.id}`} className="tile">
      {inner}
    </Link>
  );
}
