import type { Project } from "@/domain/entities";
import type { ProjectMapper } from "@/domain/mappers";
import type { ProjectModel } from "@/domain/models";
import type { GetProjects, GetProjectsParams } from "@/domain/use-cases";
import type { CollectionDataSource } from "@/shared/data-source";

export class Projects implements GetProjects {
  constructor(
    private readonly dataSource: CollectionDataSource<ProjectModel>,
    private readonly mapper: ProjectMapper,
  ) {}

  async execute({ locale }: GetProjectsParams): Promise<Project[]> {
    const models = await this.dataSource.findAll();
    return models
      .filter((model) => model.locale === locale)
      .sort((a, b) => a.order - b.order)
      .map((model) => this.mapper.toEntity(model));
  }
}
