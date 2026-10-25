import type { ReactNode } from "react";

export function ToolShell({ children }: { children: ReactNode }) {
  return <div className="tool-shell">{children}</div>;
}
