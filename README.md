# personal-blog

Blog pessoal Open Source de João Vitor Pereira — Next.js 16 (App Router), TypeScript, CSS Modules e next-intl (PT, ES, EN).

## Rodando

```bash
npm install
npm run dev
```

Abra http://localhost:3000 — o proxy redireciona para `/pt`, `/es` ou `/en` conforme o navegador.

## Arquitetura (DDD + SOLID)

```
src/
  app/[locale]/        Rotas do Next (só chamam as factories de tela)
  proxy.ts             Detecção de idioma (next-intl)
  domain/
    entities/          Tipos usados na Web (Post, Study, Project, Locale)
    models/            Formatos externos (markdown/API) — não usar no front
    mappers/           Interfaces model ⇄ entity
    use-cases/         Interfaces dos casos de uso (sempre retornam entities)
  shared/              Contratos compartilhados (ex.: CollectionDataSource)
  infra/               Implementações do shared (InMemoryDataSource) e mocks
  data/
    mappers/           Implementações dos mappers
    use-cases/         Implementações dos casos de uso
  main/
    factories/         Injeção de dependência: infra → mappers → use-cases → telas
    i18n/              Configuração do next-intl (routing, request, navigation)
    routes.ts          Rotas internas e links externos
  presentation/
    components/        Componentes do Design System (reutilizáveis entre telas)
    screens/           Telas compostas por seções
    styles/            Tokens do DS e utilitários de movimento
  assets/translations/ pt.json · es.json · en.json
```

## Conteúdo (markdown)

Posts, aulas, estudos e séries de resenhas vêm dos arquivos `.md` em `content/`, gravados pelo editor (`editBlogTool`) ou à mão:

| Conteúdo | Arquivo |
| --- | --- |
| Pensamento | `content/post/blog/thoughts/<slug>.md` |
| Resenha de livro | `content/post/blog/review-book/<slug>.md` |
| Resenha de jogo | `content/post/blog/review-game/<slug>.md` |
| Aula | `content/post/study/<estudo>/<NN>-<slug>.md` |
| Dados do estudo | `content/post/study/<estudo>/_study.md` (id, title, description, tags, order) |

- **Idiomas:** o arquivo sem sufixo é português; traduções ficam ao lado com o mesmo slug: `<slug>.es.md`, `<slug>.en.md` (aulas: `01-<slug>.es.md`, estudo: `_study.es.md`). Sem tradução, a página daquele idioma dá 404.
- **Formato:** frontmatter YAML (`PostFrontmatterModel`, `LessonFrontmatterModel`, `StudyFrontmatterModel` em `domain/models/markdown-document-model.ts`) + corpo CommonMark/GFM com diretivas (`:::callout{tone="dica"}`, `:::steps`, `::video{...}`). Marcações de posição (`::cover`, `::verdict`) são ignoradas pelo blog; trechos não reconhecidos aparecem como texto.
- **Opcionais:** `featured`, `book.pros/cons`, `game.pros/cons/completed`, `summary` e `materials` da aula. O que falta some da tela. Curtidas e reações começam em 0 (virão do back-end).
- **Séries:** o campo `collection` da resenha (`join`/`create`, `position`, `previous_ref_id`) monta a coleção; com menos de 2 itens não é coleção.
- **Leitura:** `MarkdownContentCatalog` (`infra/content`) lê os arquivos com o `FsContentFileSource`, interpreta com o `DirectiveMarkdownParser` (`infra/markdown`, o mesmo que o editor usa) e traduz com o `MarkdownCatalogModelMapper` (`data/mappers`). Em desenvolvimento os arquivos são relidos a cada página; em produção, lidos uma vez por processo (conteúdo novo pede novo build/deploy).
- Projetos, currículo e comentários ainda são mockados (`infra/mocks`). Para outra fonte (API), implemente um `ContentFileSource`/`CollectionDataSource` e troque em `main/factories/infra/data-sources.ts`.

O progresso dos estudos é do visitante e fica no navegador dele: os casos de uso `GetStudyProgress`, `SetLessonCompleted` e `WatchStudyProgress` usam o `KeyValueCache` (`shared/cache`), implementado com localStorage em `infra/cache`. A composição acontece no cliente em `main/providers/AppStudyProgressProvider.tsx`, e as telas leem pelo contexto `presentation/contexts/StudyProgressContext`.

As aulas (`/estudos/[estudo]/[aula]`) são montadas a partir de `ContentBlock` (`domain/entities/content-block.ts`): cada bloco do markdown (títulos, parágrafos, ideia central, citação, código, listas, checklist, passos, tabela, avisos, imagem, vídeo, principais ideias, glossário, divisor, spoiler) vira um componente do DS via `ContentRenderer`. O formato externo fica em `domain/models/content-block-model.ts` e a tradução em `data/mappers/content-block-model-mapper.ts` — é aqui que o parser de markdown vai se encaixar.

Coleções (`/colecoes/[slug]`) servem para estudos e para séries de resenhas do blog (`kind` no `CollectionModel`). Itens podem ser anunciados como "em breve" (só título). Regra: com menos de 2 itens publicados não é coleção (404 e sem navegação de coleção nas aulas).

O blog (`/blog`) guarda filtros na URL — `?categoria=livros|jogos|pensamentos&tag=filmes&q=busca&pagina=2` — e o caso de uso `SearchPosts` filtra e pagina no servidor (6 por página). Celular/tablet acumulam páginas ("Carregar mais"); o desktop mostra só a página atual com paginação numerada. O destaque vem de `featured: true` no post (sem marcação, o mais recente). Funções de formatação compartilhadas ficam em `presentation/utils`.

A leitura de um post (`/blog/[slug]`) tem dois layouts: resenha (livro ou jogo — capa/captura, ficha técnica, prós e contras, veredito e, no desktop, coluna lateral fixa) e pensamento (texto centralizado com reações "Fez sentido / Me fez pensar / Discordo"). O conteúdo vem do `PostContentModel` (`domain/models/post-content-model.ts`) e é traduzido para `PostDetail` pelo `PostDetailModelMapper`. As contagens de curtidas/reações vêm dos dados; a escolha do visitante fica no navegador (chave `post-reactions`) e soma +1 na tela. Se o post pertence a uma coleção de resenhas, aparece a navegação por "partes". Comentários passam por moderação (e-mail opcional, nunca publicado, vai como `replyTo` para a moderação).

O compartilhamento (`ShareTrigger` → `ShareSheet`) existe em posts e aulas. Ao lado de cada página há duas imagens geradas no build com `next/og` (sem biblioteca extra): `/story.png` (1080×1920, para story do Instagram/Facebook e status do WhatsApp) e `/link.png` (1200×630, a prévia do link — vai no `og:image`). O que cada tipo mostra está em `domain/entities/share-card.ts`; o desenho, em `presentation/share-images` (o gerador só entende flexbox e estilos inline); as fontes ficam em `src/assets/fonts` (OFL). No celular/tablet a imagem vai pelo menu nativo do aparelho (`navigator.share` com arquivo); sem suporte, ela é baixada. O link usa wa.me, o sharer do Facebook e e-mail. Defina o domínio público em `NEXT_PUBLIC_SITE_URL` (veja `.env.example`).

## Cache e dados vivos (Next 16 Cache Components)

`cacheComponents` e `partialPrefetching` estão ligados em `next.config.ts`. As páginas são prerenderizadas no build (HTML pronto na CDN) e o que muda depois entra com `"use cache"` + tags, tudo em `src/main/cache` (domínio e dados não conhecem o Next):

| Dado | Cache | Atualiza quando |
| --- | --- | --- |
| Conteúdo dos `.md` (`cached-content-catalog.ts`) | `max` em produção | novo deploy |
| Comentários aprovados (`feedback-cache.ts`) | `hours` · tag `post-comments:<id>` / `lesson-comments:<id>` | até 1 h depois da aprovação |
| Totais de reações | `minutes` · tag `post-reactions:<id>` | a cada minuto e na hora em que alguém reage (`updateTag` na Server Action) |
| PNGs de compartilhamento (`share-image-cache.ts`) | `max` | novo deploy |
| Ano do rodapé/currículo (`clock.ts`) | `days` | uma vez por dia |

- O 1º leitor depois da expiração faz o servidor remontar aquele trecho; os seguintes recebem pronto (ISR). O Firestore é lido algumas vezes por hora, não a cada visita.
- O Blog lê os filtros da URL dentro de `<Suspense>`: a listagem sem filtros vai no HTML estático e a filtrada chega por streaming.
- `generateStaticParams` precisa devolver ao menos um item: sem conteúdo, usa o slug reservado `_` (404) — ver `main/factories/static-params.ts`.
- Páginas com slug (post, aula, estudo, coleção) usam `instant = false`: as publicadas já vão prerenderizadas; uma tela de carregamento para as novas pode vir depois.

## Comentários e reações (Firebase)

Comentários e curtidas/reações ficam no Firestore, acessado só pelo servidor (`firebase-admin`, `src/infra/firebase`): o navegador não fala com o banco e ninguém precisa fazer login.

- **Comentários:** a Server Action valida, ignora robôs (campo isca), grava em `post_comments`/`lesson_comments` com `status: "pendente"` e avisa o moderador. Para publicar, mude `status` para `"aprovado"` no console do Firebase; aparece em até 1 hora.
- **Reações:** `post_reactions/<post_id>` guarda os totais (transação, nunca abaixo de zero). Uma reação por visitante e post (a escolha fica no navegador; tocar de novo desfaz). Limite: 20 toques por IP e post a cada 10 min (`rate_limits`, IP só com hash).
- **Sem JavaScript:** reações e comentários são formulários que chamam a Server Action direto; com JavaScript a tela atualiza na hora.
- **Configuração (Vercel):** crie o projeto no Firebase, ative o Firestore e gere uma chave de conta de serviço. Preencha `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL` e `FIREBASE_PRIVATE_KEY` (veja `.env.example`). As regras do Firestore podem negar todo acesso de cliente: o SDK de administrador ignora as regras. Opcional: política de TTL no campo `expires_at` da coleção `rate_limits`.
- Sem essas variáveis (desenvolvimento), comentários e reações ficam em memória até reiniciar o servidor.

O formulário de contato usa uma Server Action (`main/actions`) que chama o caso de uso `SendContactMessage`. Hoje o envio é simulado pelo `ConsoleEmailSender` (só registra no log do servidor); para enviar de verdade, implemente um `EmailSender` em `infra/email/` e troque a instância em `main/factories/infra/email-sender.ts`.

## Editor desktop

O editor de posts e aulas fica em `editBlogTool/` (Electron + Vite), com `package.json` próprio, e reaproveita os componentes deste projeto. Veja `editBlogTool/README.md`.

## Breakpoints

Celular < 768px · Tablet 768–1199px · Desktop ≥ 1200px (conteúdo em até 1280px).
