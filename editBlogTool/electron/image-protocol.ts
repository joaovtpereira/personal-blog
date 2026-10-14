import { pathToFileURL } from "node:url";
import { net, protocol } from "electron";
import { IMAGE_PROTOCOL } from "./channels";
import { isImageFile } from "./paths";

/** Precisa rodar antes do app ficar pronto. */
export function registerImageScheme() {
  protocol.registerSchemesAsPrivileged([
    { scheme: IMAGE_PROTOCOL, privileges: { standard: true, secure: true, supportFetchAPI: true } },
  ]);
}

/** jvp-image://local/<caminho absoluto codificado> → arquivo de imagem no disco (só imagens). */
export function handleImageProtocol() {
  protocol.handle(IMAGE_PROTOCOL, (request) => {
    const filePath = decodeURIComponent(new URL(request.url).pathname.slice(1));
    if (!isImageFile(filePath)) return new Response("Não é uma imagem.", { status: 403 });
    return net.fetch(pathToFileURL(filePath).toString());
  });
}
