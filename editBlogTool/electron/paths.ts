import path from "node:path";

/** Raiz do repositório do blog (editBlogTool/dist-electron → ../..). Pode ser trocada por JVP_BLOG_ROOT. */
export const BLOG_ROOT = path.resolve(process.env.JVP_BLOG_ROOT ?? path.join(__dirname, "..", ".."));

/** Pastas do blog onde o editor pode gravar. */
export const WRITABLE_ROOTS = {
  content: path.join(BLOG_ROOT, "content"),
  images: path.join(BLOG_ROOT, "public", "images"),
} as const;

export const IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "webp", "gif", "avif"];

/**
 * Resolve um caminho relativo à raiz do blog e garante que ele fica dentro de `allowedRoot`
 * (bloqueia "../" e caminhos absolutos vindos do renderer).
 */
export function resolveInside(allowedRoot: string, relativePath: string): string {
  if (path.isAbsolute(relativePath)) throw new Error("Caminho absoluto não permitido.");
  const target = path.resolve(BLOG_ROOT, relativePath);
  const rel = path.relative(allowedRoot, target);
  if (rel === "" || rel.startsWith("..") || path.isAbsolute(rel)) {
    throw new Error(`Caminho fora da pasta permitida: ${relativePath}`);
  }
  return target;
}

export const isImageFile = (filePath: string) =>
  IMAGE_EXTENSIONS.includes(path.extname(filePath).slice(1).toLowerCase());
