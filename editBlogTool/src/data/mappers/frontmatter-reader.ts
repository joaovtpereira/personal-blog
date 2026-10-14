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

  object(key: string): FrontmatterReader | null {
    const value = this.data[key];
    return value && typeof value === "object" && !Array.isArray(value) ? new FrontmatterReader(value as Record<string, unknown>) : null;
  }
}
