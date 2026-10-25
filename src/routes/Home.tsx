import { useSeo } from "../lib/seo";
import { SectionGrid } from "../components/SectionGrid";

export function Home() {
  useSeo(
    "OmTools — free web tools",
    "Free, private, no-login web tools for images, conversion, developers, and text."
  );
  return (
    <div className="home">
      <div className="hero">
        <h1 className="hero-title">
          Free web tools.
          <br />
          <span className="hero-sub">No login. No ads. No tracking.</span>
        </h1>
        <p className="hero-desc">
          OmTools is a fast, private toolkit that runs in your browser. Search with{" "}
          <kbd className="kbd">⌘K</kbd> or browse the sections below.
        </p>
      </div>
      <SectionGrid />
    </div>
  );
}
