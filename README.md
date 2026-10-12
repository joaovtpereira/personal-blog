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

## Breakpoints

Celular < 768px · Tablet 768–1199px · Desktop ≥ 1200px (conteúdo em até 1280px).
