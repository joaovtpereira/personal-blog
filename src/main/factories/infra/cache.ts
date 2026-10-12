import { LocalStorageCache } from "@/infra/cache";
import type { KeyValueCache } from "@/shared/cache";

let browserCache: KeyValueCache | null = null;

/** Uma instância por aba, para que todos os assinantes vejam as mesmas mudanças. Só no cliente. */
export const makeBrowserCache = (): KeyValueCache => (browserCache ??= new LocalStorageCache("jvp:"));
