import type { DesktopBridge } from "@editor/shared/desktop";

/** Ponte com o processo principal. Fora do Electron (ex.: Vite no navegador) as gravações falham com aviso claro. */
export function getDesktopBridge(): DesktopBridge {
  const bridge = window.jvpDesktop;
  if (!bridge) throw new Error("Abra o editor pelo app desktop (npm run dev) para acessar arquivos.");
  return bridge;
}
