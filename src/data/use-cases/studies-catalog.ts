import type { Study } from "@/domain/entities";
import type { StudyMapper } from "@/domain/mappers";
import type { StudyModel } from "@/domain/models";
import type { GetStudies, GetStudiesParams } from "@/domain/use-cases";
import type { CollectionDataSource } from "@/shared/data-source";

export class StudiesCatalog implements GetStudies {
  constructor(
    private readonly dataSource: CollectionDataSource<StudyModel>,
    private readonly mapper: StudyMapper,
  ) {}

  async execute({ locale }: GetStudiesParams): Promise<Study[]> {
    const models = await this.dataSource.findAll();
    return models
      .filter((model) => model.locale === locale)
      .sort((a, b) => a.order - b.order)
      .map((model) => this.mapper.toEntity(model));
  }
}
