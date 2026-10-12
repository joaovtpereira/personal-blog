import type { ReactNode } from "react";

/** Tags usadas nas traduções: <accent> = serif itálico, <strong> = destaque em fg. */
export const richTags = {
  accent: (chunks: ReactNode) => <span className="serif">{chunks}</span>,
  strong: (chunks: ReactNode) => <span style={{ color: "var(--fg)" }}>{chunks}</span>,
};
