import type { Study } from "@/domain/entities";
import type { StudyMapper } from "@/domain/mappers";
import type { StudyModel } from "@/domain/models";
import type { GetFeaturedStudies, GetFeaturedStudiesParams } from "@/domain/use-cases";
import type { CollectionDataSource } from "@/shared/data-source";

export class FeaturedStudies implements GetFeaturedStudies {
  constructor(
    private readonly dataSource: CollectionDataSource<StudyModel>,
    private readonly mapper: StudyMapper,
  ) {}

  async execute({ locale, limit }: GetFeaturedStudiesParams): Promise<Study[]> {
    const models = await this.dataSource.findAll();
    return models
      .filter((model) => model.locale === locale)
      .sort((a, b) => b.updated_at.localeCompare(a.updated_at))
      .slice(0, limit)
      .map((model) => this.mapper.toEntity(model));
  }
}
