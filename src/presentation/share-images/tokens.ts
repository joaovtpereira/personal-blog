/* Tokens do DS (tema escuro) para as imagens geradas — o gerador não lê variáveis CSS. */
export const IMG = {
  bg: "#0A0A0A",
  fg: "#F2F2F0",
  mute: "#A3A3A0",
  line: "#262626",
  card: "#131313",
  video: "#050505",
  sans: "Geist",
  mono: "Geist Mono",
  serif: "Instrument Serif",
} as const;

/** Textos traduzidos que entram na imagem (montados no main/ com o idioma do conteúdo). */
export type ShareImageLabels = {
  /** RESENHA · LIVRO, PENSAMENTO, ESTUDO... */
  kind: string;
  /** Linha mono ao lado do tipo (data, tempo de leitura, nome do estudo). */
  meta: string;
  author: string;
  /** Domínio em caixa alta. */
  host: string;
  /** Chamada do rodapé do story (LEIA NO BLOG, RESENHA COMPLETA, ESTUDE JUNTO). */
  cta: string;
  keyIdea: string;
  by: string;
  verdict: string;
  hours: string;
  hoursPlayed: string;
  worth: string;
  score: string;
  completed: string;
  cover: string;
  capture: string;
  rec: string;
  lessonPosition: string;
  lessonFormat: string;
  lessonWord: string;
};
