import type { ContentBlockModel, VideoRefModel } from "./content-block-model";

/** Aula como vem do markdown (frontmatter + corpo). Não usar na apresentação. */
export type LessonModel = {
  id: string;
  study_id: string;
  locale: string;
  slug: string;
  order: number;
  title: string;
  format: "video" | "texto";
  reading_minutes: number;
  video?: VideoRefModel | null;
  summary?: { key_idea: string; text: string } | null;
  blocks: ContentBlockModel[];
  materials?: { id: string; title: string; type: "pdf" | "link" | "arquivo"; url: string }[];
};
