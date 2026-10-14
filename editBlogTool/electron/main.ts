import path from "node:path";
import { app, BrowserWindow, shell } from "electron";
import { registerContentFileHandlers } from "./content-files";
import { handleImageProtocol, registerImageScheme } from "./image-protocol";

/** Editor só para desktop: abaixo de 1200px o layout de 3 colunas não cabe. */
const MIN_WIDTH = 1200;
const MIN_HEIGHT = 760;

let mainWindow: BrowserWindow | null = null;

registerImageScheme();

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 960,
    minWidth: MIN_WIDTH,
    minHeight: MIN_HEIGHT,
    title: "Editor de conteúdo — JVP",
    backgroundColor: "#0a0a0a",
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      sandbox: true,
      nodeIntegration: false,
    },
  });

  mainWindow.once("ready-to-show", () => mainWindow?.show());

  // Links externos (ex.: vídeo no YouTube) abrem no navegador, nunca dentro do editor.
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https?:\/\//.test(url)) void shell.openExternal(url);
    return { action: "deny" };
  });
  mainWindow.webContents.on("will-navigate", (event, url) => {
    if (url !== mainWindow?.webContents.getURL()) event.preventDefault();
  });

  const devUrl = process.env.JVP_EDITOR_DEV_URL;
  if (devUrl) void mainWindow.loadURL(devUrl);
  else void mainWindow.loadFile(path.join(__dirname, "..", "dist", "index.html"));

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  handleImageProtocol();
  registerContentFileHandlers(() => mainWindow);
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
