import { useTranslations } from "next-intl";
import { studyLayout, type PublicComment, type StudyLessonPage } from "@/domain/entities";
import { ROUTES } from "@/main/routes";
import type { CommentFormAction } from "@/presentation/components/Comments";
import { PageHeader } from "@/presentation/contexts/PageHeaderContext";
import { ReadingLessonView } from "./sections/ReadingLessonView";
import { VideoLessonView } from "./sections/VideoLessonView";

export type StudyLessonScreenProps = {
  page: StudyLessonPage;
  comments: PublicComment[];
  commentAction: CommentFormAction;
  /** Campos ocultos do formulário de comentário (montados pela factory). */
  commentContext: Record<string, string>;
};

/** Aula de um estudo. Estudo com qualquer aula em vídeo usa o layout de vídeo; só texto, o modo leitura. */
export function StudyLessonScreen(props: StudyLessonScreenProps) {
  const t = useTranslations("Lesson");
  const { page } = props;
  const layout = studyLayout(page.lessons);
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <main id="conteudo">
      <PageHeader
        crumb={t("counter", { current: pad(page.lesson.number), total: pad(page.lessons.length) })}
        backHref={ROUTES.studies}
        backLabel={t("backToStudies")}
      />
      {layout === "reading" ? <ReadingLessonView {...props} /> : <VideoLessonView {...props} />}
    </main>
  );
}
