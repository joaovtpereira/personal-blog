import type { KeyValueCache } from "@/shared/cache";

/**
 * Cache no localStorage com prefixo. Se o armazenamento estiver bloqueado (modo privado,
 * cookies desligados), guarda só em memória durante a visita.
 */
export class LocalStorageCache implements KeyValueCache {
  private readonly memory = new Map<string, string>();
  private readonly listeners = new Map<string, Set<() => void>>();

  constructor(private readonly prefix = "jvp:") {}

  get<T>(key: string): T | null {
    const raw = this.read(this.prefix + key);
    if (raw === null) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }

  set<T>(key: string, value: T): void {
    this.write(this.prefix + key, JSON.stringify(value));
    this.emit(key);
  }

  remove(key: string): void {
    this.memory.delete(this.prefix + key);
    try {
      window.localStorage.removeItem(this.prefix + key);
    } catch {
      /* armazenamento indisponível */
    }
    this.emit(key);
  }

  subscribe(key: string, listener: () => void): () => void {
    const set = this.listeners.get(key) ?? new Set();
    set.add(listener);
    this.listeners.set(key, set);

    const onStorage = (event: StorageEvent) => {
      if (event.key === this.prefix + key) listener();
    };
    window.addEventListener("storage", onStorage);

    return () => {
      set.delete(listener);
      window.removeEventListener("storage", onStorage);
    };
  }

  private read(fullKey: string): string | null {
    try {
      const value = window.localStorage.getItem(fullKey);
      if (value !== null) return value;
    } catch {
      /* armazenamento indisponível */
    }
    return this.memory.get(fullKey) ?? null;
  }

  private write(fullKey: string, value: string) {
    this.memory.set(fullKey, value);
    try {
      window.localStorage.setItem(fullKey, value);
    } catch {
      /* fica só em memória */
    }
  }

  private emit(key: string) {
    this.listeners.get(key)?.forEach((listener) => listener());
  }
}
