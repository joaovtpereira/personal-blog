/** Limita tentativas por chave (ex.: IP anônimo + post) dentro de uma janela de tempo. */
export interface RateLimiter {
  /** true = pode seguir; false = passou do limite nesta janela. */
  consume(key: string): Promise<boolean>;
}
