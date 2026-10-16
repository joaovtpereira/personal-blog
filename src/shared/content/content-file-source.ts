/** Onde estão os .md do blog (disco no servidor, IPC no editor desktop). Caminhos relativos à raiz do blog. */
export interface ContentFileSource {
  /** Todos os .md dentro de content/ (ex.: "content/post/blog/thoughts/a.md"). */
  list(): Promise<string[]>;
  read(path: string): Promise<string>;
}
