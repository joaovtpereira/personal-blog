import type { Resume } from "@/domain/entities";
import type { ResumeMapper } from "@/domain/mappers";
import type { ResumeModel } from "@/domain/models";
import type { GetResume, GetResumeParams } from "@/domain/use-cases";
import type { CollectionDataSource } from "@/shared/data-source";

export class ResumeLoader implements GetResume {
  constructor(
    private readonly dataSource: CollectionDataSource<ResumeModel>,
    private readonly mapper: ResumeMapper,
  ) {}

  async execute({ locale }: GetResumeParams): Promise<Resume | null> {
    const models = await this.dataSource.findAll();
    const model = models.find((item) => item.locale === locale);
    return model ? this.mapper.toEntity(model) : null;
  }
}
