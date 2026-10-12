import type { ContentBlockModel, LessonModel } from "@/domain/models";
import { STUDY_FORMATS, lessonId, lessonSlug } from "./studies.mock";

type Locale = "pt" | "es" | "en";

/** Vídeo de exemplo (domínio público, CC0) para testar o player com arquivo. */
const SAMPLE_VIDEO = "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";

/* Textos de exemplo no estilo do canvas: conteúdo ainda não escrito fica entre colchetes. */
const T = {
  pt: {
    title: (n: number) => `[Título da aula ${n}]`,
    notes: "[Suas anotações desta aula: conceitos, exemplos e dúvidas que ficaram.]",
    reference: "[Trecho de código, versículo ou citação de referência]",
    opening: "[Abertura da aula: o contexto e a pergunta que ela tenta responder.]",
    body: "[Desenvolvimento: o conteúdo principal, explicado com suas palavras.]",
    keyIdea: "[A ideia central da aula em uma frase.]",
    keyIdeaLabel: "IDEIA CENTRAL",
    section: "[Subtítulo da seção]",
    more: "[Continuação: exemplos, referências e conexões com outras aulas.]",
    closing: "[Fechamento: o que levar desta aula e o que vem a seguir.]",
    summary: "[Resumo da aula — as anotações completas ficam logo abaixo.]",
    material: "[Nome do material]",
    link: "[Link de referência]",
    item: (n: number) => `[Item ${n}]`,
    step: (n: number) => `[Passo ${n}]`,
    stepText: "[O que fazer neste passo.]",
    term: "[Termo]",
    definition: "[Definição em uma linha.]",
    calloutTitle: "[Dica]",
    callout: "[Pause e tente antes de seguir para a solução.]",
    tableCaption: "[Comparação]",
    columns: ["[Critério]", "[Opção A]", "[Opção B]"],
    row: ["[Critério]", "[valor]", "[valor]"],
    checklistTitle: "[Antes da próxima aula]",
    task: (n: number) => `[Tarefa ${n}]`,
    quote: "[Uma frase marcante de outra pessoa sobre o tema.]",
    cite: "[Autor]",
    spoiler: "[Resposta do exercício.]",
    keyPointsTitle: "[Principais ideias]",
    figureAlt: "[Descrição da imagem]",
    figureCaption: "[Legenda da imagem.]",
    rich: "Use **negrito** para o essencial, *itálico* para termos e `código` para comandos — veja a [referência](https://developer.mozilla.org).",
  },
  es: {
    title: (n: number) => `[Título de la clase ${n}]`,
    notes: "[Tus notas de esta clase: conceptos, ejemplos y dudas que quedaron.]",
    reference: "[Fragmento de código, versículo o cita de referencia]",
    opening: "[Apertura de la clase: el contexto y la pregunta que intenta responder.]",
    body: "[Desarrollo: el contenido principal, explicado con tus palabras.]",
    keyIdea: "[La idea central de la clase en una frase.]",
    keyIdeaLabel: "IDEA CENTRAL",
    section: "[Subtítulo de la sección]",
    more: "[Continuación: ejemplos, referencias y conexiones con otras clases.]",
    closing: "[Cierre: qué llevarte de esta clase y qué viene después.]",
    summary: "[Resumen de la clase — las notas completas están justo abajo.]",
    material: "[Nombre del material]",
    link: "[Enlace de referencia]",
    item: (n: number) => `[Ítem ${n}]`,
    step: (n: number) => `[Paso ${n}]`,
    stepText: "[Qué hacer en este paso.]",
    term: "[Término]",
    definition: "[Definición en una línea.]",
    calloutTitle: "[Consejo]",
    callout: "[Haz una pausa e inténtalo antes de ver la solución.]",
    tableCaption: "[Comparación]",
    columns: ["[Criterio]", "[Opción A]", "[Opción B]"],
    row: ["[Criterio]", "[valor]", "[valor]"],
    checklistTitle: "[Antes de la próxima clase]",
    task: (n: number) => `[Tarea ${n}]`,
    quote: "[Una frase memorable de otra persona sobre el tema.]",
    cite: "[Autor]",
    spoiler: "[Respuesta del ejercicio.]",
    keyPointsTitle: "[Ideas principales]",
    figureAlt: "[Descripción de la imagen]",
    figureCaption: "[Leyenda de la imagen.]",
    rich: "Usa **negrita** para lo esencial, *cursiva* para términos y `código` para comandos — mira la [referencia](https://developer.mozilla.org).",
  },
  en: {
    title: (n: number) => `[Lesson ${n} title]`,
    notes: "[Your notes for this lesson: concepts, examples and open questions.]",
    reference: "[Code snippet, verse or reference quote]",
    opening: "[Opening: the context and the question this lesson tries to answer.]",
    body: "[Body: the main content, explained in your own words.]",
    keyIdea: "[The core idea of the lesson in one sentence.]",
    keyIdeaLabel: "CORE IDEA",
    section: "[Section subtitle]",
    more: "[Continued: examples, references and links to other lessons.]",
    closing: "[Wrap-up: what to take from this lesson and what comes next.]",
    summary: "[Lesson summary — the full notes are right below.]",
    material: "[Material name]",
    link: "[Reference link]",
    item: (n: number) => `[Item ${n}]`,
    step: (n: number) => `[Step ${n}]`,
    stepText: "[What to do in this step.]",
    term: "[Term]",
    definition: "[One-line definition.]",
    calloutTitle: "[Tip]",
    callout: "[Pause and try it before moving on to the solution.]",
    tableCaption: "[Comparison]",
    columns: ["[Criterion]", "[Option A]", "[Option B]"],
    row: ["[Criterion]", "[value]", "[value]"],
    checklistTitle: "[Before the next lesson]",
    task: (n: number) => `[Task ${n}]`,
    quote: "[A striking sentence from someone else on the topic.]",
    cite: "[Author]",
    spoiler: "[Exercise answer.]",
    keyPointsTitle: "[Key ideas]",
    figureAlt: "[Image description]",
    figureCaption: "[Image caption.]",
    rich: "Use **bold** for what matters, *italics* for terms and `code` for commands — see the [reference](https://developer.mozilla.org).",
  },
} satisfies Record<Locale, unknown>;

/** Blocos extras que mudam de aula para aula, para exercitar todos os componentes de conteúdo. */
function extras(t: (typeof T)[Locale], i: number): ContentBlockModel[] {
  switch (i % 7) {
    case 0:
      return [
        { type: "list", ordered: false, items: [t.item(1), t.item(2), t.item(3)] },
        { type: "callout", tone: "dica", title: t.calloutTitle, text: t.callout },
      ];
    case 1:
      return [
        { type: "code", lang: "ts", filename: "exemplo.ts", value: "const aula = await carregar(id);\nconsole.log(aula.titulo);" },
        { type: "paragraph", text: t.rich },
      ];
    case 2:
      return [{ type: "table", caption: t.tableCaption, header: t.columns, rows: [t.row, t.row] }];
    case 3:
      return [
        { type: "steps", items: [1, 2, 3].map((n) => ({ title: t.step(n), text: t.stepText })) },
        { type: "checklist", title: t.checklistTitle, items: [1, 2].map((n) => ({ text: t.task(n), checked: false })) },
      ];
    case 4:
      return [
        { type: "glossary", items: [{ term: t.term, definition: t.definition }, { term: t.term, definition: t.definition }] },
        { type: "key_points", title: t.keyPointsTitle, items: [t.item(1), t.item(2), t.item(3)] },
      ];
    case 5:
      return [
        { type: "blockquote", text: t.quote, cite: t.cite },
        { type: "thematic_break", variant: "ornamento" },
        { type: "callout", tone: "exercicio", title: null, text: t.callout },
        { type: "spoiler", text: t.spoiler },
      ];
    default:
      return [
        { type: "image", src: "/images/fotsquad-screen.jpg", alt: t.figureAlt, caption: t.figureCaption, ratio: "16 / 9" },
        { type: "list", ordered: true, items: [t.item(1), t.item(2)] },
      ];
  }
}

/** Corpo de uma aula do modo leitura (estudo só texto). */
const article = (t: (typeof T)[Locale], i: number): ContentBlockModel[] => [
  { type: "paragraph", text: t.opening, drop_cap: true },
  { type: "paragraph", text: t.body, muted: true },
  { type: "key_idea", label: t.keyIdeaLabel, text: t.keyIdea },
  { type: "heading", depth: 3, text: t.section },
  { type: "paragraph", text: t.more, muted: true },
  { type: "reference", text: t.reference },
  ...extras(t, i),
  { type: "paragraph", text: t.closing, muted: true },
];

/** Anotações de uma aula de estudo com vídeo. */
const notes = (t: (typeof T)[Locale], i: number): ContentBlockModel[] => [
  { type: "paragraph", text: t.notes },
  { type: "reference", text: t.reference },
  ...extras(t, i),
];

function buildLessons(locale: Locale): LessonModel[] {
  const t = T[locale];
  return Object.entries(STUDY_FORMATS).flatMap(([studyId, formats]) => {
    const readingOnly = formats.every((video) => !video);
    return formats.map((video, i): LessonModel => {
      // Cenário: vídeo ainda sem arquivo publicado (estudo 4, aula 1).
      const missingVideo = studyId === "s4" && i === 0;
      return {
        id: lessonId(studyId, i),
        study_id: studyId,
        locale,
        slug: lessonSlug(i),
        order: i + 1,
        title: t.title(i + 1),
        format: video ? "video" : "texto",
        reading_minutes: 4 + ((i * 3) % 7),
        video: video
          ? { provider: "arquivo", ref: missingVideo ? "" : SAMPLE_VIDEO, duration_seconds: 420 + i * 95 }
          : null,
        summary: !video && !readingOnly ? { key_idea: t.keyIdea, text: t.summary } : null,
        blocks: readingOnly ? article(t, i) : notes(t, i),
        // Cenário: aulas pares sem material de apoio.
        materials:
          i % 2 === 0
            ? [
                { id: `${studyId}-${i}-pdf`, title: t.material, type: "pdf", url: "https://example.com/material.pdf" },
                { id: `${studyId}-${i}-link`, title: t.link, type: "link", url: "https://developer.mozilla.org" },
              ]
            : [],
      };
    });
  });
}

export const LESSONS_MOCK: LessonModel[] = (["pt", "es", "en"] as const).flatMap(buildLessons);
