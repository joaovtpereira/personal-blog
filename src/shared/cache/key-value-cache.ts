/** Cache chave → valor serializável (navegador, memória...). */
export interface KeyValueCache {
  get<T>(key: string): T | null;
  set<T>(key: string, value: T): void;
  remove(key: string): void;
  /** Chamado quando a chave muda, inclusive em outra aba. Retorna a função para cancelar. */
  subscribe(key: string, listener: () => void): () => void;
}
