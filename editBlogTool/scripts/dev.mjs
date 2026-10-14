/* Sobe o Vite (renderer) e abre o Electron apontando para ele. */
import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import { createServer } from "vite";

const require = createRequire(import.meta.url);
const electronBinary = require("electron");

const server = await createServer({ configFile: new URL("../vite.config.mts", import.meta.url).pathname });
await server.listen();
const url = server.resolvedUrls?.local[0] ?? "http://localhost:5173/";
server.printUrls();

const app = spawn(electronBinary, ["."], {
  stdio: "inherit",
  env: { ...process.env, JVP_EDITOR_DEV_URL: url },
});

app.on("close", async (code) => {
  await server.close();
  process.exit(code ?? 0);
});
