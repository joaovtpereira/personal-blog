import type { ContentBlockModel, PostCommentModel, PostContentModel } from "@/domain/models";
import { POSTS_MOCK } from "./posts.mock";

type Locale = "pt" | "es" | "en";

/* Textos de exemplo no estilo do canvas: conteúdo ainda não escrito fica entre colchetes. */
const T = {
  pt: {
    bookOpening: "[Parágrafo de abertura: em que momento você leu o livro e por que ele chegou até você.]",
    bookBody: "[Desenvolvimento: o que funciona, o que incomoda, sem spoilers — ou com aviso antes deles.]",
    bookQuote: "[Trecho do livro que ficou com você.]",
    bookCite: "[Autor], p. [nº]",
    bookClosing: "[Fechamento: para quem você indicaria e o que levou da leitura.]",
    gameOpening: "[Abertura: como o jogo chegou até você e o que esperava dele.]",
    gameplay: "Jogabilidade",
    gameplayText: "[Como é jogar: controles, ritmo, desafio, o loop principal.]",
    story: "História e mundo",
    storyText: "[Narrativa, personagens e ambientação — sem spoilers ou com aviso.]",
    gameQuote: "[O momento do jogo que ficou com você.]",
    visuals: "Visual e trilha",
    visualsText: "[Direção de arte, desempenho e trilha sonora.]",
    lead: "[Linha fina: a pergunta ou a ideia que move o texto.]",
    thoughtOpening: "[Parágrafo de abertura: a situação, a leitura ou a conversa que puxou essa reflexão.]",
    thoughtBody: "[Desenvolvimento: o raciocínio em passos, com exemplos do dia a dia.]",
    thoughtIdea: "[A frase que resume o pensamento.]",
    subtitle: "[Subtítulo]",
    counter: "[Contraponto: o que poderia estar errado nessa ideia e como você lida com isso.]",
    thoughtClosing: "[Fechamento: a pergunta que fica para quem lê.]",
    spoiler: "[O que acontece no final.]",
    verdict: "[Uma linha final]",
    pro: "[ponto alto]",
    con: "[ponto baixo]",
    genre: "[gênero]",
    studio: "[Estúdio]",
    worth: "[Sim / Só em promoção / Não]",
    difficulty: "[nível]",
    audience: "[Para quem gosta de…]",
  },
  es: {
    bookOpening: "[Párrafo de apertura: en qué momento leíste el libro y por qué llegó a ti.]",
    bookBody: "[Desarrollo: qué funciona, qué incomoda, sin spoilers — o con aviso antes.]",
    bookQuote: "[Fragmento del libro que se quedó contigo.]",
    bookCite: "[Autor], p. [nº]",
    bookClosing: "[Cierre: a quién se lo recomendarías y qué te llevaste de la lectura.]",
    gameOpening: "[Apertura: cómo llegó el juego a ti y qué esperabas de él.]",
    gameplay: "Jugabilidad",
    gameplayText: "[Cómo es jugar: controles, ritmo, desafío, el bucle principal.]",
    story: "Historia y mundo",
    storyText: "[Narrativa, personajes y ambientación — sin spoilers o con aviso.]",
    gameQuote: "[El momento del juego que se quedó contigo.]",
    visuals: "Visual y banda sonora",
    visualsText: "[Dirección de arte, rendimiento y banda sonora.]",
    lead: "[Bajada: la pregunta o la idea que mueve el texto.]",
    thoughtOpening: "[Párrafo de apertura: la situación, la lectura o la charla que trajo esta reflexión.]",
    thoughtBody: "[Desarrollo: el razonamiento paso a paso, con ejemplos del día a día.]",
    thoughtIdea: "[La frase que resume el pensamiento.]",
    subtitle: "[Subtítulo]",
    counter: "[Contrapunto: qué podría estar mal en esta idea y cómo lo manejas.]",
    thoughtClosing: "[Cierre: la pregunta que queda para quien lee.]",
    spoiler: "[Lo que pasa al final.]",
    verdict: "[Una línea final]",
    pro: "[punto alto]",
    con: "[punto bajo]",
    genre: "[género]",
    studio: "[Estudio]",
    worth: "[Sí / Solo en oferta / No]",
    difficulty: "[nivel]",
    audience: "[Para quien disfruta…]",
  },
  en: {
    bookOpening: "[Opening paragraph: when you read the book and how it reached you.]",
    bookBody: "[Body: what works, what bothers you, no spoilers — or with a warning first.]",
    bookQuote: "[A passage from the book that stayed with you.]",
    bookCite: "[Author], p. [no.]",
    bookClosing: "[Wrap-up: who you’d recommend it to and what you took from it.]",
    gameOpening: "[Opening: how the game reached you and what you expected from it.]",
    gameplay: "Gameplay",
    gameplayText: "[What it’s like to play: controls, pace, challenge, the core loop.]",
    story: "Story and world",
    storyText: "[Narrative, characters and setting — no spoilers, or with a warning.]",
    gameQuote: "[The moment in the game that stayed with you.]",
    visuals: "Visuals and soundtrack",
    visualsText: "[Art direction, performance and soundtrack.]",
    lead: "[Standfirst: the question or idea that drives the piece.]",
    thoughtOpening: "[Opening paragraph: the situation, reading or conversation that sparked this reflection.]",
    thoughtBody: "[Body: the reasoning step by step, with everyday examples.]",
    thoughtIdea: "[The sentence that sums up the thought.]",
    subtitle: "[Subtitle]",
    counter: "[Counterpoint: what could be wrong with this idea and how you deal with it.]",
    thoughtClosing: "[Wrap-up: the question left for the reader.]",
    spoiler: "[What happens at the end.]",
    verdict: "[A final line]",
    pro: "[high point]",
    con: "[low point]",
    genre: "[genre]",
    studio: "[Studio]",
    worth: "[Yes / Only on sale / No]",
    difficulty: "[level]",
    audience: "[For people who enjoy…]",
  },
} satisfies Record<Locale, Record<string, string>>;

const bookBlocks = (t: (typeof T)[Locale], withSpoiler: boolean): ContentBlockModel[] => [
  { type: "paragraph", text: t.bookOpening, drop_cap: true },
  { type: "paragraph", text: t.bookBody, muted: true },
  { type: "blockquote", text: t.bookQuote, cite: t.bookCite },
  ...(withSpoiler ? [{ type: "spoiler", text: t.spoiler } as ContentBlockModel] : []),
  { type: "paragraph", text: t.bookClosing, muted: true },
];

const gameBlocks = (t: (typeof T)[Locale]): ContentBlockModel[] => [
  { type: "paragraph", text: t.gameOpening, drop_cap: true },
  { type: "heading", depth: 2, text: t.gameplay },
  { type: "paragraph", text: t.gameplayText, muted: true },
  { type: "heading", depth: 2, text: t.story },
  { type: "paragraph", text: t.storyText, muted: true },
  { type: "blockquote", text: t.gameQuote },
  { type: "heading", depth: 2, text: t.visuals },
  { type: "paragraph", text: t.visualsText, muted: true },
];

const thoughtBlocks = (t: (typeof T)[Locale]): ContentBlockModel[] => [
  { type: "paragraph", text: t.thoughtOpening, drop_cap: true },
  { type: "paragraph", text: t.thoughtBody, muted: true },
  { type: "key_idea", text: t.thoughtIdea },
  { type: "heading", depth: 2, text: t.subtitle },
  { type: "paragraph", text: t.counter, muted: true },
  { type: "paragraph", text: t.thoughtClosing, muted: true },
];

export const POST_CONTENTS_MOCK: PostContentModel[] = POSTS_MOCK.map((post, i) => {
  const locale = post.locale as Locale;
  const t = T[locale];
  const base = { post_id: post.id, locale };

  if (post.type === "resenha-livro") {
    return {
      ...base,
      blocks: bookBlocks(t, i % 2 === 0),
      book: { year: "[ano]", pages: "[nº]", genres: [t.genre], verdict_line: t.verdict, pros: [t.pro, t.pro], cons: [t.con, t.con] },
      likes: 18 + (i % 9),
    };
  }
  if (post.type === "resenha-jogo") {
    return {
      ...base,
      blocks: gameBlocks(t),
      game: {
        studio: t.studio,
        hours: "[XX]",
        release: "[ano]",
        genre: t.genre,
        // Cenário: nem todo jogo resenhado foi zerado.
        completed: i % 3 !== 0,
        worth: t.worth,
        difficulty: t.difficulty,
        audience: t.audience,
        verdict_line: t.verdict,
        pros: [t.pro, t.pro],
        cons: [t.con, t.con],
      },
      likes: 9 + (i % 7),
    };
  }
  return {
    ...base,
    lead: t.lead,
    blocks: thoughtBlocks(t),
    reactions: { fez_sentido: 12, me_fez_pensar: 8, discordo: 2 },
  };
});

export const POST_COMMENTS_MOCK: PostCommentModel[] = [
  { id: "pc1", post_id: "p2", author_name: "[Nome do leitor]", body: "[Comentário sobre a resenha.]", created_at: "2026-10-03T12:00:00Z", status: "aprovado" },
  { id: "pc2", post_id: "p2", author_name: null, body: "[Outro comentário aprovado, sem nome.]", created_at: "2026-10-02T12:00:00Z", status: "aprovado" },
  { id: "pc3", post_id: "p2", author_name: "[Pendente]", body: "[Aguardando moderação.]", created_at: "2026-10-04T12:00:00Z", status: "pendente" },
  { id: "pc4", post_id: "p1", author_name: "[Nome do leitor]", body: "[Comentário concordando e acrescentando uma experiência.]", created_at: "2026-10-09T12:00:00Z", status: "aprovado" },
  { id: "pc5", post_id: "p1", author_name: "[Nome do leitor]", body: "[Comentário com outro ponto de vista.]", created_at: "2026-10-09T15:00:00Z", status: "aprovado" },
];
