import type { Project } from "@/domain/entities";
import type { ProjectMapper } from "@/domain/mappers";
import type { ProjectModel } from "@/domain/models";
import { toLocale } from "./locale";

export class ProjectModelMapper implements ProjectMapper {
  toEntity(model: ProjectModel): Project {
    return {
      id: model.id,
      locale: toLocale(model.locale),
      kind: model.type === "empresa" ? "company" : "app",
      name: model.name,
      nameAccent: model.name_accent ?? null,
      description: model.description,
      url: model.url,
      displayUrl: model.url.replace(/^https?:\/\//, "").replace(/\/$/, ""),
      platforms: [...(model.platforms ?? [])],
      coverImage: model.cover_image ?? null,
      iconImage: model.icon_image ?? null,
    };
  }

  toModel(entity: Project): ProjectModel {
    return {
      id: entity.id,
      locale: entity.locale,
      type: entity.kind === "company" ? "empresa" : "app",
      name: entity.name,
      name_accent: entity.nameAccent,
      description: entity.description,
      url: entity.url,
      platforms: [...entity.platforms],
      cover_image: entity.coverImage,
      icon_image: entity.iconImage,
      order: 0,
    };
  }
}
