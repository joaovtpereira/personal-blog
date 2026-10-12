import type { Locale, Resume } from "../entities";

export type GetResumeParams = {
  locale: Locale;
};

export interface GetResume {
  /** null quando não há currículo publicado no idioma. */
  execute(params: GetResumeParams): Promise<Resume | null>;
}
