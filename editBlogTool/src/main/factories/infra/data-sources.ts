import { MarkdownCatalogModelMapper } from "@/data/mappers/markdown-catalog-model-mapper";
import type { CollectionModel, PostModel, StudyModel } from "@/domain/models";
import { MarkdownContentCatalog } from "@/infra/content/markdown-content-catalog";
import { CatalogDataSource } from "@/infra/data-source/catalog-data-source";
import { DirectiveMarkdownParser } from "@/infra/markdown/directive-markdown-parser";
import type { ContentCatalog } from "@/shared/content";
import type { CollectionDataSource } from "@editor/shared/data-source";
import { ElectronContentFileReader, ElectronContentFileSource } from "@editor/infra/desktop";

/*
 * Mesmo conteúdo que o blog publica: os .md de content/, lidos pelo processo do Electron e
 * traduzidos pelo mesmo leitor do blog. Sem cache: cada abertura do catálogo vê os arquivos atuais.
 */
const makeContentCatalog = (): ContentCatalog =>
  new MarkdownContentCatalog(
    new ElectronContentFileSource(new ElectronContentFileReader()),
    new DirectiveMarkdownParser(),
    new MarkdownCatalogModelMapper(),
    false,
  );

export const makePostsDataSource = (): CollectionDataSource<PostModel> => new CatalogDataSource(makeContentCatalog(), "posts");

export const makeCollectionsDataSource = (): CollectionDataSource<CollectionModel> =>
  new CatalogDataSource(makeContentCatalog(), "collections");

export const makeStudiesDataSource = (): CollectionDataSource<StudyModel> => new CatalogDataSource(makeContentCatalog(), "studies");
