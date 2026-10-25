import { Navigate, useParams } from "react-router-dom";
import { getTool } from "../lib/registry";
import { ImageCompress } from "../tools/ImageCompress";
import { ImageResize } from "../tools/ImageResize";
import { ImageConvert } from "../tools/ImageConvert";
import { JsonToYaml } from "../tools/JsonToYaml";
import { JsonToCsv } from "../tools/JsonToCsv";
import { Base64 } from "../tools/Base64";
import { Hash } from "../tools/Hash";
import { RegexTester } from "../tools/Regex";
import { JsonFormat } from "../tools/JsonFormat";
import { UrlEncode } from "../tools/UrlEncode";
import { WordCount } from "../tools/WordCount";
import { CaseConvert } from "../tools/CaseConvert";

const components: Record<string, React.ComponentType> = {
  "image-compress": ImageCompress,
  "image-resize": ImageResize,
  "image-convert": ImageConvert,
  "json-to-yaml": JsonToYaml,
  "json-to-csv": JsonToCsv,
  base64: Base64,
  hash: Hash,
  regex: RegexTester,
  "json-format": JsonFormat,
  "url-encode": UrlEncode,
  "word-count": WordCount,
  "case-convert": CaseConvert,
};

export function ToolRoute() {
  const { toolId } = useParams<{ toolId: string }>();
  const tool = getTool(toolId ?? "");

  if (!tool) return <Navigate to="/" replace />;
  const Component = components[tool.id];
  if (!Component) {
    return (
      <div className="tool-shell">
        <div className="tool-body">
          <h2>{tool.name}</h2>
          <p className="mono tool-fallback-note">This tool is coming soon.</p>
        </div>
      </div>
    );
  }
  return <Component />;
}
