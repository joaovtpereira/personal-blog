import type { BlockSlot, DraftKind, FreeBlockType } from "@editor/domain/entities";

type BlockMeta = { label: string; glyph: string; help: string };

/** Nome, glifo e ajuda de cada bloco livre (biblioteca e inspector). */
export const BLOCK_META: Record<FreeBlockType, BlockMeta> = {
  heading: { label: "Título", glyph: "H", help: "Use H2 e H3 para as seções; o título principal vem dos dados obrigatórios." },
  paragraph: { label: "Parágrafo", glyph: "¶", help: "Texto corrido. Ative a capitular só na abertura." },
  quote: { label: "Citação", glyph: "“", help: "Trecho em destaque: a frase que define o texto." },
  list: { label: "Lista", glyph: "•", help: "Itens curtos, um por linha." },
  checklist: { label: "Checklist", glyph: "✓", help: "Tarefas que o leitor marca — ideal no fim da aula." },
  figure: { label: "Imagem", glyph: "▭", help: "Imagem com legenda, em preto e branco no site." },
  video: { label: "Vídeo", glyph: "▶", help: "Player de vídeo extra dentro da aula." },
  divider: { label: "Divisor", glyph: "—", help: "Pausa entre partes do texto." },
  steps: { label: "Passo a passo", glyph: "1.", help: "Processo em ordem. Uma linha por passo: título — explicação." },
  table: { label: "Tabela", glyph: "⊞", help: "Comparativos com várias colunas." },
  code: { label: "Código", glyph: "{}", help: "Trechos de código das aulas técnicas." },
  callout: { label: "Aviso", glyph: "!", help: "Nota, dica, atenção ou exercício." },
  spoiler: { label: "Spoiler", glyph: "◐", help: "Fica desfocado até o leitor tocar." },
  keyPoints: { label: "Principais ideias", glyph: "✦", help: "Resumo em 3 a 5 itens, um por linha." },
  glossary: { label: "Glossário", glyph: "Aa", help: "Termos e definições: “termo: definição”, um por linha." },
  raw: {
    label: "Markdown não reconhecido",
    glyph: "?",
    help: "Trecho do arquivo aberto que o editor não reconhece. É gravado de volta exatamente como está; revise ou remova.",
  },
};

/** Blocos fixos: nome no documento e etiqueta de vínculo com os dados. */
export const SLOT_META: Record<BlockSlot, { label: string; bound: string; help: string }> = {
  title: { label: "Título", bound: "Nome", help: "Título principal do texto, vindo dos dados obrigatórios." },
  lead: { label: "Linha fina", bound: "Linha fina", help: "Frase de abertura em itálico, vinda dos dados obrigatórios." },
  author: { label: "Linha fina", bound: "Autor", help: "Autor do livro, vindo dos dados obrigatórios." },
  studioPlatform: { label: "Linha fina", bound: "Estúdio · Plataforma", help: "Estúdio e plataforma, vindos dos dados obrigatórios." },
  cover: { label: "Capa", bound: "Capa", help: "Capa do livro enviada na aba Dados." },
  capture: { label: "Captura", bound: "Captura", help: "Captura do jogo enviada na aba Dados." },
  factSheet: { label: "Ficha técnica", bound: "Ficha", help: "Dados da obra, vindos da aba Dados." },
  inPractice: { label: "Na prática", bound: "Na prática", help: "Preço, dificuldade e público, vindos da aba Dados." },
  verdict: { label: "Veredito", bound: "Veredito", help: "Nota e frase final, vindas da aba Dados." },
  video: { label: "Vídeo da aula", bound: "Vídeo", help: "Player da vídeo-aula. Vem da aba Dados e só existe no formato vídeo." },
};

export const LIBRARY_GROUPS: { group: string; items: FreeBlockType[] }[] = [
  { group: "Texto", items: ["heading", "paragraph", "quote", "list", "checklist"] },
  { group: "Mídia", items: ["figure", "video"] },
  { group: "Estrutura", items: ["divider", "steps", "table", "code"] },
  { group: "Destaques", items: ["callout", "spoiler", "keyPoints", "glossary"] },
];

/** Só aulas têm vídeo. */
export const isAvailable = (type: FreeBlockType, kind: DraftKind) => type !== "video" || kind === "lesson";

export const KIND_TABS: { id: DraftKind; label: string }[] = [
  { id: "thought", label: "Pensamento" },
  { id: "book", label: "Resenha · Livro" },
  { id: "game", label: "Resenha · Jogo" },
  { id: "lesson", label: "Aula" },
];

export const KIND_EYEBROW: Record<Exclude<DraftKind, "lesson">, string> = {
  thought: "Pensamento",
  book: "Resenha · Livro",
  game: "Resenha · Jogo",
};
