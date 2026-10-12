"use client";

/**
 * Script inline que roda no parse do HTML (antes da primeira pintura).
 * No cliente vira text/plain para o React não avisar sobre <script> renderizado.
 */
export function InlineScript({ html }: { html: string }) {
  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
