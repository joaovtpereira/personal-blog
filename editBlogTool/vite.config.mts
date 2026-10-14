import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";

const editorSrc = fileURLToPath(new URL("./src", import.meta.url));
const blogSrc = fileURLToPath(new URL("../src", import.meta.url));
const shims = `${editorSrc}/infra/blog-shims`;

/**
 * CSP só no build: em dev o Vite injeta script inline (HMR).
 * Imagens locais vêm do protocolo jvp-image (electron/image-protocol.ts); vídeos dos embeds do VideoPlayer do blog.
 */
const CSP = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src https://fonts.gstatic.com",
  "img-src 'self' data: jvp-image: https:",
  "media-src 'self' jvp-image: https:",
  "frame-src https://www.youtube-nocookie.com https://player.vimeo.com",
].join("; ");

const contentSecurityPolicy = (): Plugin => ({
  name: "jvp-csp",
  apply: "build",
  transformIndexHtml: (html) => html.replace("<head>", `<head>\n    <meta http-equiv="Content-Security-Policy" content="${CSP}" />`),
});

/**
 * O renderer importa os componentes do blog (../src) pelo alias "@/".
 * As dependências do Next que eles usam são trocadas por adaptadores em infra/blog-shims.
 * A ordem importa: os aliases específicos vêm antes do "@/" genérico.
 */
export default defineConfig({
  base: "./",
  plugins: [react(), contentSecurityPolicy()],
  resolve: {
    alias: [
      { find: /^next-intl$/, replacement: `${shims}/next-intl.ts` },
      { find: /^next\/image$/, replacement: `${shims}/next-image.tsx` },
      { find: /^@\/main\/i18n\/navigation$/, replacement: `${shims}/navigation.tsx` },
      { find: /^@editor\//, replacement: `${editorSrc}/` },
      { find: /^@\//, replacement: `${blogSrc}/` },
    ],
    dedupe: ["react", "react-dom"],
  },
  server: { port: 5173, strictPort: true, fs: { allow: [blogSrc, editorSrc, fileURLToPath(new URL(".", import.meta.url))] } },
  build: { outDir: "dist", emptyOutDir: true },
});
