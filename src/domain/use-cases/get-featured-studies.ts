import type { Locale, Study } from "../entities";

export type GetFeaturedStudiesParams = {
  locale: Locale;
  limit: number;
};

export interface GetFeaturedStudies {
  execute(params: GetFeaturedStudiesParams): Promise<Study[]>;
}
