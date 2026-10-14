import { LocalStorageCache } from "@editor/infra/cache";
import type { KeyValueCache } from "@editor/shared/cache";

let cache: KeyValueCache | null = null;

/** Prefixo próprio para não misturar com as chaves do blog. */
export const makeCache = (): KeyValueCache => (cache ??= new LocalStorageCache("jvp-editor:"));
