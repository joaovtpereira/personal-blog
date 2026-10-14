export interface Clipboard {
  /** true quando o texto foi copiado. */
  copy(text: string): Promise<boolean>;
}
