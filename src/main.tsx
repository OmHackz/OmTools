import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import "./styles/global.css";

// Umami analytics — injected at runtime so the static build stays clean.
const umamiUrl = (import.meta.env.VITE_UMAMI_SCRIPT_URL as string | undefined) ?? "";
if (umamiUrl) {
  const s = document.createElement("script");
  s.src = umamiUrl;
  s.async = true;
  document.head.appendChild(s);
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
