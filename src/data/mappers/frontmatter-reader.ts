/** Leitura tolerante do frontmatter (escrito pelo editor ou à mão): tipos errados viram vazio. */
export class FrontmatterReader {
  constructor(private readonly data: Record<string, unknown>) {}

  text(key: string): string {
    const value = this.data[key];
    return typeof value === "string" ? value : typeof value === "number" ? String(value) : "";
  }

  number(key: string): number | null {
    const value = Number(this.data[key]);
    return this.data[key] === null || this.data[key] === undefined || this.data[key] === "" || !Number.isFinite(value) ? null : value;
  }

  list(key: string): string[] {
    const value = this.data[key];
    return Array.isArray(value) ? value.filter((v): v is string | number => typeof v === "string" || typeof v === "number").map(String) : [];
  }

  /** true/false gravados como booleano (ou "true"/"false" escritos à mão). */
  bool(key: string, fallback = false): boolean {
    const value = this.data[key];
    if (typeof value === "boolean") return value;
    if (value === "true" || value === "false") return value === "true";
    return fallback;
  }

  /** Lista de mapas ("- titulo: ..."). Itens que não são mapas são ignorados. */
  objects(key: string): FrontmatterReader[] {
    const value = this.data[key];
    return Array.isArray(value)
      ? value.filter((v) => v && typeof v === "object" && !Array.isArray(v)).map((v) => new FrontmatterReader(v as Record<string, unknown>))
      : [];
  }

  object(key: string): FrontmatterReader | null {
    const value = this.data[key];
    return value && typeof value === "object" && !Array.isArray(value) ? new FrontmatterReader(value as Record<string, unknown>) : null;
  }
}
