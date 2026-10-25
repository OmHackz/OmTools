import { Link } from "react-router-dom";
import { sections, toolsBySection } from "../lib/registry";
import { ToolTile } from "./ToolTile";

export function SectionGrid() {
  return (
    <div className="section-grid">
      {sections.map((section) => {
        const tools = toolsBySection(section.id);
        if (tools.length === 0) return null;
        return (
          <section key={section.id} className="section-block" aria-labelledby={`sec-${section.id}`}>
            <Link to={`/${section.id}`} className="section-head">
              <h2 id={`sec-${section.id}`} className="section-title">
                {section.name}
              </h2>
              <span className="section-count mono">{tools.length}</span>
            </Link>
            <p className="section-desc">{section.description}</p>
            <div className="tile-grid">
              {tools.map((tool) => (
                <ToolTile key={tool.id} tool={tool} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
