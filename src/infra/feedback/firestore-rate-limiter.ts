import { createHash } from "node:crypto";
import { Timestamp, type Firestore } from "firebase-admin/firestore";
import type { RateLimiter } from "@/shared/feedback";

/**
 * Janela fixa por chave em rate_limits/<sha256 da chave> (o IP nunca é gravado em claro).
 * O campo expires_at permite ligar a política de TTL do Firestore para limpar documentos antigos.
 */
export class FirestoreRateLimiter implements RateLimiter {
  constructor(
    private readonly db: Firestore,
    private readonly limit: number,
    private readonly windowSeconds: number,
    private readonly collection = "rate_limits",
  ) {}

  consume(key: string): Promise<boolean> {
    const ref = this.db.collection(this.collection).doc(createHash("sha256").update(key).digest("hex"));
    return this.db.runTransaction(async (tx) => {
      const now = Date.now();
      const data = (await tx.get(ref)).data() as { count: number; window_start: number } | undefined;
      const fresh = !data || now - data.window_start >= this.windowSeconds * 1000;
      const count = fresh ? 1 : data.count + 1;
      if (count > this.limit) return false;
      const windowStart = fresh ? now : data.window_start;
      tx.set(ref, { count, window_start: windowStart, expires_at: Timestamp.fromMillis(windowStart + this.windowSeconds * 1000) });
      return true;
    });
  }
}
