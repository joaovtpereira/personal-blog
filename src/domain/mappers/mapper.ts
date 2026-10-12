/** Traduz o formato externo (model) para o formato usado na Web (entity) e o contrário. */
export interface Mapper<TModel, TEntity> {
  toEntity(model: TModel): TEntity;
  toModel(entity: TEntity): TModel;
}
