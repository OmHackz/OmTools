import { Link } from "react-router-dom";
import { useSeo } from "../lib/seo";

export function NotFound() {
  useSeo("Not found — OmTools", "The page you are looking for does not exist.");
  return (
    <div className="tool-shell">
      <div className="tool-body">
        <h1>404</h1>
        <p>That page does not exist.</p>
        <Link to="/" className="btn">Go home</Link>
      </div>
    </div>
  );
}
