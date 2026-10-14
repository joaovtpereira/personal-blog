import type { Clipboard } from "@/shared/share";

/** Área de transferência do navegador, com o comando antigo como reserva (http, WebViews). */
export class NavigatorClipboard implements Clipboard {
  async copy(text: string): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      return this.legacyCopy(text);
    }
  }

  private legacyCopy(text: string): boolean {
    const field = document.createElement("textarea");
    field.value = text;
    field.setAttribute("readonly", "");
    field.style.position = "fixed";
    field.style.opacity = "0";
    document.body.appendChild(field);
    field.select();
    try {
      return document.execCommand("copy");
    } catch {
      return false;
    } finally {
      field.remove();
    }
  }
}
