import { useParams, Navigate } from "react-router-dom";
import { sections, toolsBySection, type SectionId } from "../lib/registry";
import { useSeo } from "../lib/seo";
import { ToolTile } from "../components/ToolTile";

const VALID = new Set(sections.map((s) => s.id));

export function SectionPage() {
  const { sectionId } = useParams<{ sectionId: string }>();
  const section = sections.find((s) => s.id === sectionId);

  if (!section || !VALID.has(section.id as SectionId)) {
    return <Navigate to="/" replace />;
  }

  useSeo(
    `${section.name} tools — OmTools`,
    section.description
  );

  const tools = toolsBySection(section.id);

  return (
    <div className="section-page">
      <h1 className="page-title">
        {section.name}
        <span className="page-count mono">{tools.length}</span>
      </h1>
      <p className="page-desc">{section.description}</p>
      <div className="tile-grid">
        {tools.map((tool) => (
          <ToolTile key={tool.id} tool={tool} />
        ))}
      </div>
    </div>
  );
}
