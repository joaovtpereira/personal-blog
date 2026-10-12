import type { CollectionDataSource } from "@/shared/data-source";

export class InMemoryDataSource<TModel> implements CollectionDataSource<TModel> {
  constructor(private readonly items: readonly TModel[]) {}

  async findAll(): Promise<TModel[]> {
    return structuredClone([...this.items]);
  }
}
