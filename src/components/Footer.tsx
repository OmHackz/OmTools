import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-row">
          <span>© {new Date().getFullYear()} OmTools — free, no login, no ads.</span>
          <nav className="footer-nav" aria-label="Footer">
            <Link to="/image">Image</Link>
            <Link to="/converter">Converter</Link>
            <Link to="/developer">Developer</Link>
            <Link to="/text">Text</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
