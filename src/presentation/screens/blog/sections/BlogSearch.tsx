"use client";

import { useTranslations } from "next-intl";
import { useTransition } from "react";
import { useRouter } from "@/main/i18n/navigation";
import { ROUTES } from "@/main/routes";
import { SearchField } from "@/presentation/components/SearchField";
import { blogQueryString, type BlogQuery } from "@/presentation/utils/blog-query";

/** Busca do blog: atualiza ?q= na URL (o servidor filtra). */
export function BlogSearch({ query, className }: { query: BlogQuery; className?: string }) {
  const t = useTranslations("Blog.search");
  const router = useRouter();
  const [, startTransition] = useTransition();

  return (
    <SearchField
      id="blog-search"
      className={className}
      label={t("label")}
      placeholder={t("placeholder")}
      clearLabel={t("clear")}
      submitLabel={t("submit")}
      value={query.query}
      onSearch={(value) =>
        startTransition(() =>
          router.replace({ pathname: ROUTES.blog, query: blogQueryString(query, { query: value }) }, { scroll: false }),
        )
      }
    />
  );
}
