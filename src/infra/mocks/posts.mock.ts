import type { PostModel } from "@/domain/models";

type Seed = Omit<PostModel, "locale" | "title" | "excerpt"> & {
  text: Record<"pt" | "es" | "en", { title: string; excerpt: string }>;
};

const THOUGHT = {
  pt: { title: "[Título do pensamento]", excerpt: "[Primeira frase do texto — o gancho que puxa a leitura.]" },
  es: { title: "[Título del pensamiento]", excerpt: "[Primera frase del texto — el gancho que invita a leer.]" },
  en: { title: "[Thought title]", excerpt: "[First sentence of the post — the hook that pulls you in.]" },
};
const BOOK = {
  pt: { title: "[Nome do livro]", excerpt: "[Autor] — [uma linha sobre o que o livro deixou em você.]" },
  es: { title: "[Nombre del libro]", excerpt: "[Autor] — [una línea sobre lo que el libro dejó en ti.]" },
  en: { title: "[Book title]", excerpt: "[Author] — [one line about what the book left you with.]" },
};
const GAME = {
  pt: { title: "[Nome do jogo]", excerpt: "[Plataforma] — [uma linha sobre a experiência de jogar.]" },
  es: { title: "[Nombre del juego]", excerpt: "[Plataforma] — [una línea sobre la experiencia de jugar.]" },
  en: { title: "[Game title]", excerpt: "[Platform] — [one line about what it is like to play.]" },
};

const AUTHOR = "[Autor]";
const PLATFORM = "[Plataforma]";

const SEEDS: Seed[] = [
  { id: "p1", slug: "pensamento-1", type: "pensamento", tags: ["religião"], reading_time_minutes: 6, published_at: "2026-10-08T10:00:00Z", rating: null, text: THOUGHT },
  { id: "p2", slug: "resenha-livro-1", type: "resenha-livro", tags: ["filosofia", "religião"], reading_time_minutes: 9, published_at: "2026-10-01T10:00:00Z", rating: 4, author: AUTHOR, featured: true, text: BOOK },
  { id: "p3", slug: "resenha-jogo-1", type: "resenha-jogo", tags: ["tecnologia"], reading_time_minutes: 8, published_at: "2026-09-24T10:00:00Z", rating: 5, platform: PLATFORM, text: GAME },
  { id: "p4", slug: "pensamento-2", type: "pensamento", tags: ["filmes"], reading_time_minutes: 4, published_at: "2026-09-17T10:00:00Z", rating: null, text: THOUGHT },
  { id: "p5", slug: "resenha-livro-2", type: "resenha-livro", tags: ["história"], reading_time_minutes: 11, published_at: "2026-09-10T10:00:00Z", rating: 3, author: AUTHOR, text: BOOK },
  { id: "p6", slug: "resenha-jogo-2", type: "resenha-jogo", tags: ["tecnologia"], reading_time_minutes: 7, published_at: "2026-09-03T10:00:00Z", rating: 4, platform: PLATFORM, text: GAME },
  { id: "p7", slug: "resenha-livro-3", type: "resenha-livro", tags: ["filosofia"], reading_time_minutes: 10, published_at: "2026-08-27T10:00:00Z", rating: 5, author: AUTHOR, text: BOOK },
  { id: "p8", slug: "resenha-jogo-3", type: "resenha-jogo", tags: ["filmes"], reading_time_minutes: 6, published_at: "2026-08-20T10:00:00Z", rating: 3, platform: PLATFORM, text: GAME },
  { id: "p9", slug: "pensamento-3", type: "pensamento", tags: ["filosofia"], reading_time_minutes: 5, published_at: "2026-08-13T10:00:00Z", rating: null, text: THOUGHT },
  { id: "p10", slug: "resenha-livro-4", type: "resenha-livro", tags: ["religião"], reading_time_minutes: 8, published_at: "2026-08-06T10:00:00Z", rating: 4, author: AUTHOR, text: BOOK },
  { id: "p11", slug: "pensamento-4", type: "pensamento", tags: ["tecnologia"], reading_time_minutes: 3, published_at: "2026-07-30T10:00:00Z", rating: null, text: THOUGHT },
  { id: "p12", slug: "resenha-jogo-4", type: "resenha-jogo", tags: ["tecnologia", "filmes"], reading_time_minutes: 7, published_at: "2026-07-23T10:00:00Z", rating: 5, platform: PLATFORM, text: GAME },
  { id: "p13", slug: "pensamento-5", type: "pensamento", tags: ["história"], reading_time_minutes: 6, published_at: "2026-07-16T10:00:00Z", rating: null, text: THOUGHT },
];

export const POSTS_MOCK: PostModel[] = SEEDS.flatMap(({ text, ...seed }) =>
  (["pt", "es", "en"] as const).map((locale) => ({ ...seed, locale, ...text[locale] })),
);
