/** Fonte de leitura de uma coleção de models (markdown, API, memória...). */
export interface CollectionDataSource<TModel> {
  findAll(): Promise<TModel[]>;
}
