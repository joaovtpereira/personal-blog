import { useTranslations } from "next-intl";
import { ROUTES } from "@/main/routes";
import { ReadingScope } from "@/presentation/components/ReadingBar";
import { ShareTrigger } from "@/presentation/components/ShareSheet";
import { PageHeader } from "@/presentation/contexts/PageHeaderContext";
import type { PostViewProps } from "./post-view-props";
import { ReviewView } from "./sections/ReviewView";
import { ThoughtView } from "./sections/ThoughtView";

export type PostScreenProps = PostViewProps;

/** Leitura de um post: resenha (livro/jogo) ou pensamento, com barra de progresso no topo. */
export function PostScreen(props: PostScreenProps) {
  const t = useTranslations("PostPage");
  const { post } = props.page.detail;

  return (
    <main id="conteudo">
      <PageHeader
        crumb={t("readTime", { minutes: post.readingMinutes })}
        backHref={ROUTES.blog}
        backLabel={t("back")}
        section="blog"
        action={<ShareTrigger target={props.share} variant="round" />}
      />
      <ReadingScope label={t("readingProgress")}>
        {post.kind === "thought" ? <ThoughtView {...props} /> : <ReviewView {...props} />}
      </ReadingScope>
    </main>
  );
}
