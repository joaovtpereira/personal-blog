import { promises as fs } from "node:fs";
import path from "node:path";
import { dialog, ipcMain, type BrowserWindow } from "electron";
import { BLOG_ROOT, IMAGE_EXTENSIONS, isImageFile, resolveInside, WRITABLE_ROOTS } from "./paths";
import { CHANNELS, type ContentEntryPayload, type PickedImagePayload, type WriteResultPayload } from "./channels";

const exists = (file: string) =>
  fs.access(file).then(
    () => true,
    () => false,
  );

/** Todos os .md dentro de content/ (recursivo). Pasta inexistente = lista vazia. */
async function listMarkdown(dir: string): Promise<ContentEntryPayload[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true }).catch(() => []);
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) return listMarkdown(full);
      if (!entry.isFile() || path.extname(entry.name) !== ".md") return [];
      const stat = await fs.stat(full);
      return [{ path: path.relative(BLOG_ROOT, full).split(path.sep).join("/"), modifiedAt: stat.mtime.toISOString() }];
    }),
  );
  return nested.flat();
}

const markdownInsideContent = (relativePath: string) => {
  if (path.extname(relativePath) !== ".md") throw new Error("Só arquivos .md podem ser abertos.");
  return resolveInside(WRITABLE_ROOTS.content, relativePath);
};

/** Canais IPC de arquivos: só grava markdown em content/ e imagens em public/images/. */
export function registerContentFileHandlers(getWindow: () => BrowserWindow | null) {
  ipcMain.handle(CHANNELS.blogRoot, () => BLOG_ROOT);

  ipcMain.handle(CHANNELS.fileExists, async (_event, relativePath: string) => {
    return exists(resolveInside(BLOG_ROOT, relativePath));
  });

  ipcMain.handle(
    CHANNELS.writeContent,
    async (_event, relativePath: string, content: string): Promise<WriteResultPayload> => {
      if (path.extname(relativePath) !== ".md") throw new Error("Só arquivos .md podem ser gravados.");
      const target = resolveInside(WRITABLE_ROOTS.content, relativePath);
      const overwritten = await exists(target);
      await fs.mkdir(path.dirname(target), { recursive: true });
      await fs.writeFile(target, content, "utf8");
      return { path: path.relative(BLOG_ROOT, target), overwritten };
    },
  );

  ipcMain.handle(
    CHANNELS.copyImage,
    async (_event, sourcePath: string, relativeDestination: string): Promise<WriteResultPayload> => {
      if (!isImageFile(sourcePath) || !isImageFile(relativeDestination)) throw new Error("Arquivo de imagem inválido.");
      const target = resolveInside(WRITABLE_ROOTS.images, relativeDestination);
      const overwritten = await exists(target);
      await fs.mkdir(path.dirname(target), { recursive: true });
      if (path.resolve(sourcePath) !== target) await fs.copyFile(sourcePath, target);
      return { path: path.relative(BLOG_ROOT, target), overwritten };
    },
  );

  ipcMain.handle(CHANNELS.listContent, () => listMarkdown(WRITABLE_ROOTS.content));

  ipcMain.handle(CHANNELS.readContent, (_event, relativePath: string) => fs.readFile(markdownInsideContent(relativePath), "utf8"));

  /** Seletor do sistema aberto em content/. Arquivos fora de content/ são recusados. */
  ipcMain.handle(CHANNELS.pickMarkdown, async (): Promise<string | null> => {
    const window = getWindow();
    const options = {
      title: "Abrir Markdown",
      buttonLabel: "Abrir para editar",
      defaultPath: WRITABLE_ROOTS.content,
      properties: ["openFile" as const],
      filters: [{ name: "Markdown", extensions: ["md"] }],
    };
    const result = window ? await dialog.showOpenDialog(window, options) : await dialog.showOpenDialog(options);
    const file = result.filePaths[0];
    if (result.canceled || !file) return null;
    const relativePath = path.relative(BLOG_ROOT, file).split(path.sep).join("/");
    markdownInsideContent(relativePath);
    return relativePath;
  });

  ipcMain.handle(CHANNELS.pickImage, async (): Promise<PickedImagePayload | null> => {
    const window = getWindow();
    const options = {
      title: "Escolher imagem",
      buttonLabel: "Usar imagem",
      properties: ["openFile" as const],
      filters: [{ name: "Imagens", extensions: IMAGE_EXTENSIONS }],
    };
    const result = window ? await dialog.showOpenDialog(window, options) : await dialog.showOpenDialog(options);
    const file = result.filePaths[0];
    if (result.canceled || !file) return null;
    return { path: file, name: path.basename(file) };
  });
}
