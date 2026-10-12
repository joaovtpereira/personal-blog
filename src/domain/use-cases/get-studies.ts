import type { Locale, Study } from "../entities";

export type GetStudiesParams = {
  locale: Locale;
};

export interface GetStudies {
  execute(params: GetStudiesParams): Promise<Study[]>;
}
