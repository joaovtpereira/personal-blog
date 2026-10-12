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

Para trocar os dados mockados por markdown ou API, implemente um novo `CollectionDataSource` em `infra/` e troque a instância em `main/factories/infra/data-sources.ts`.

O progresso dos estudos é do visitante e fica no navegador dele: os casos de uso `GetStudyProgress`, `SetLessonCompleted` e `WatchStudyProgress` usam o `KeyValueCache` (`shared/cache`), implementado com localStorage em `infra/cache`. A composição acontece no cliente em `main/providers/AppStudyProgressProvider.tsx`, e as telas leem pelo contexto `presentation/contexts/StudyProgressContext`.

As aulas (`/estudos/[estudo]/[aula]`) são montadas a partir de `ContentBlock` (`domain/entities/content-block.ts`): cada bloco do markdown (títulos, parágrafos, ideia central, citação, código, listas, checklist, passos, tabela, avisos, imagem, vídeo, principais ideias, glossário, divisor, spoiler) vira um componente do DS via `ContentRenderer`. O formato externo fica em `domain/models/content-block-model.ts` e a tradução em `data/mappers/content-block-model-mapper.ts` — é aqui que o parser de markdown vai se encaixar.

Coleções (`/colecoes/[slug]`) servem para estudos e para séries de resenhas do blog (`kind` no `CollectionModel`). Itens podem ser anunciados como "em breve" (só título). Regra: com menos de 2 itens publicados não é coleção (404 e sem navegação de coleção nas aulas).

O formulário de contato usa uma Server Action (`main/actions`) que chama o caso de uso `SendContactMessage`. Hoje o envio é simulado pelo `ConsoleEmailSender` (só registra no log do servidor); para enviar de verdade, implemente um `EmailSender` em `infra/email/` e troque a instância em `main/factories/infra/email-sender.ts`.

## Breakpoints

Celular < 768px · Tablet 768–1199px · Desktop ≥ 1200px (conteúdo em até 1280px).
