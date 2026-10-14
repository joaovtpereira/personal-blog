# Editor de conteúdo JVP (desktop)

Editor de posts e aulas do blog, em Electron + Vite + React. Só desktop (janela mínima de 1200px) e só em português.

```bash
cd editBlogTool
npm install
npm run dev      # Vite + Electron com recarga
npm start        # build de produção e abre o app
npm run typecheck
```

O editor reaproveita o Design System do blog: importa `../src` pelo alias `@/` (ContentRenderer, VerdictCard, FactSheet,
CoverStage, CollectionNav, SegmentedTabs, Button, Chip, Badge, ProgressBar, SuccessCard, ThemeToggle, Icon, `globals.css`)
e o `ContentBlockModelMapper` do blog para a pré-visualização. As dependências do Next que esses componentes usam
(`next-intl`, `next/image`, `Link`) são trocadas por adaptadores em `src/infra/blog-shims` (ver `vite.config.mts`).

## Arquitetura (DDD + SOLID)

```
electron/              Processo principal: janela, IPC de arquivos, seletor de imagem, protocolo jvp-image://
src/
  domain/
    entities/          Rascunho (EditorWorkspace), blocos, regras de obrigatórios, coleção, caminhos de saída
    models/            Formatos gravados (frontmatter + blocos), cache e respostas do desktop
    mappers/           Interfaces: bloco ⇄ markdown, rascunho → documento, cache, pré-visualização
    use-cases/         LoadWorkspace, SaveWorkspace, GetEditorCatalog, ValidateDraft, ExportDraft, PickImage
  shared/              Contratos: cache, ContentFileWriter, ImagePicker, MarkdownSerializer, DesktopBridge
  infra/               Implementações: localStorage, ponte Electron, serializer markdown, adaptadores do Next
  data/                Implementações dos mappers e casos de uso
  main/                Factories (infra → mappers → casos de uso → tela) e entrada do React
  presentation/        Componentes próprios do editor, tela (seções + estado) e utils
  assets/
```

## O que é gravado

A exportação só libera com todos os obrigatórios preenchidos e grava no repositório do blog:

| Tipo | Markdown | Imagens |
| --- | --- | --- |
| Pensamento | `content/post/blog/thoughts/<slug>.md` | `public/images/<slug>/` |
| Resenha de livro | `content/post/blog/review-book/<slug>.md` | `public/images/<slug>/` |
| Resenha de jogo | `content/post/blog/review-game/<slug>.md` | `public/images/<slug>/` |
| Aula | `content/post/study/<estudo>/<NN>-<slug>.md` | `public/images/<estudo>/<aula>/` |

O frontmatter segue `PostModel`/`PostContentModel`/`LessonModel` do blog (+ `collection` quando a resenha entra ou cria
uma série). O corpo é CommonMark + tabelas GFM com diretivas no padrão remark-directive para os blocos do DS
(`:::callout{tone="dica"}`, `:::steps`, `::video{...}`) e marcações de posição dos blocos fixos (`::cover`, `::verdict`).
O processo principal só aceita gravar `.md` dentro de `content/` e imagens dentro de `public/images/`.

## Editar um conteúdo existente

"Abrir Markdown" lista os `.md` de `content/post` (filtro por tipo e busca) ou abre o seletor do sistema, restrito a
`content/`. Antes de abrir, o diálogo mostra o que será carregado e avisa se há alterações não salvas no rascunho do mesmo tipo.

- O frontmatter preenche a aba Dados e o corpo vira blocos (`DirectiveMarkdownParser`, o inverso do serializer).
- Blocos que o editor não reconhece entram como "Markdown não reconhecido" e são gravados de volta sem mudanças.
- "Salvar alterações" substitui o próprio arquivo: o nome, o `id` e o `published_at` não mudam, mesmo que o título mude.
  Imagens que já estão em `public/images` não são copiadas de novo.
- Abrir uma aula carrega todas as aulas da mesma pasta de estudo. Aulas novas entram depois da última (`NN-` seguinte);
  remover uma aula no editor não apaga o arquivo dela.
- Coleção gravada no arquivo aparece como "Manter coleção atual".
- Depois de exportar um rascunho novo, ele passa a editar o arquivo gravado.

O rascunho é salvo automaticamente no armazenamento local do app. Resenhas anteriores, coleções, estudos e tags vêm das
mesmas fontes de dados do blog (`src/main/factories/infra/data-sources.ts`).
