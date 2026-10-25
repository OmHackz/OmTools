import { Link } from "react-router-dom";

export function Header() {
  return (
    <header className="site-header">
      <div className="container">
        <div className="header-row">
          <Link to="/" className="brand" aria-label="OmTools home">
            <span className="brand-mark">Om</span>
            <span className="brand-name">Tools</span>
          </Link>
          <button
            className="palette-btn"
            onClick={() => window.dispatchEvent(new CustomEvent("open-palette"))}
            aria-label="Open command palette"
            title="Search tools (Ctrl/Cmd+K)"
          >
            <span className="palette-btn-label">Search tools</span>
            <kbd className="kbd">⌘K</kbd>
          </button>
        </div>
      </div>
    </header>
  );
}
