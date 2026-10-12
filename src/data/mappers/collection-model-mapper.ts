import type { Collection, CollectionEntry } from "@/domain/entities";
import type { CollectionItemResolver, CollectionMapper } from "@/domain/mappers";
import type { CollectionModel } from "@/domain/models";
import { toLocale } from "./locale";

export class CollectionModelMapper implements CollectionMapper {
  toEntity(model: CollectionModel, resolve: CollectionItemResolver): Collection {
    const entries: CollectionEntry[] = [];

    for (const item of model.items) {
      if (item.status === "em-breve") {
        if (!item.title) continue;
        entries.push({ position: 0, title: item.title, status: "upcoming", ref: null, lessonCount: null, minutes: null, rating: null });
        continue;
      }
      const resolved = item.ref_id ? resolve(item.ref_id) : null;
      // Item despublicado/inexistente some da coleção (e não conta para a regra de 1 item).
      if (!resolved) continue;
      entries.push({ position: 0, status: "published", ...resolved, title: item.title ?? resolved.title });
    }

    return {
      id: model.id,
      slug: model.slug,
      locale: toLocale(model.locale),
      kind: model.kind === "estudos" ? "studies" : "reviews",
      name: model.name,
      description: model.description,
      entries: entries.map((entry, i) => ({ ...entry, position: i + 1 })),
    };
  }
}
