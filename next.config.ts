import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/main/i18n/request.ts");

const nextConfig: NextConfig = {
  /*
   * Cache Components: as páginas são prerenderizadas (HTML estático) e os dados vivos
   * (comentários e reações do Firestore) entram com "use cache" + tags — ver src/main/cache.
   */
  cacheComponents: true,
  partialPrefetching: true,
  /* Os .md de content/ são lidos em tempo de execução nas páginas geradas sob demanda (Vercel). */
  outputFileTracingIncludes: {
    "/**": ["./content/**/*.md", "./src/assets/fonts/*.ttf"],
  },
};

export default withNextIntl(nextConfig);
