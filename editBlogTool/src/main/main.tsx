import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { THEME_STORAGE_KEY } from "@/presentation/components/ThemeToggle/theme-script";
import "@/presentation/styles/globals.css";
import "@editor/presentation/styles/editor.css";
import { makeEditorScreen } from "./factories/screens/make-editor-screen";

/* Mesmo tema escolhido no toggle do DS (dark por padrão). */
try {
  const theme = localStorage.getItem(THEME_STORAGE_KEY);
  if (theme === "light" || theme === "dark") document.documentElement.dataset.theme = theme;
} catch {
  /* armazenamento indisponível: fica o tema padrão */
}

createRoot(document.getElementById("root")!).render(<StrictMode>{makeEditorScreen()}</StrictMode>);
