import { cacheLife } from "next/cache";

/** Ano atual para o rodapé: entra no HTML estático e é refeito uma vez por dia. */
export async function currentYear(): Promise<number> {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}
