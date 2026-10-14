import { Chip } from "@/presentation/components/Chip";
import { ProgressBar } from "@/presentation/components/ProgressBar";
import {
  BOOK_GENRES,
  bookCollectionPlan,
  COLLECTION_CHECK_KEY,
  findCheck,
  GAME_DIFFICULTY,
  GAME_GENRES,
  GAME_PLATFORMS,
  GAME_WORTH,
  gameCollectionPlan,
  lessonCheckKey,
  REQUIRED_FIELDS,
  SCORES,
  STUDY_CHECK_KEY,
  type DraftReport,
  type EditorCatalog,
  type EditorWorkspace,
  type ImageRef,
  type LessonDraft,
  type PostKind,
  type RequirementCheck,
} from "@editor/domain/entities";
import { FieldHint, FieldShell, ImageField, PanelSection, RequiredBadge, ScoreSelector, SelectInput, TextArea, TextInput } from "@editor/presentation/components";
import { pad2 } from "@editor/presentation/utils/text-lines";
import type { EditorAction } from "../state/editor-state";
import { CollectionQuestion } from "./CollectionQuestion";
import styles from "./Panels.module.css";

type Input =
  | { input: "text" | "area"; placeholder: string; half?: boolean }
  | { input: "select"; options: readonly string[] }
  | { input: "chips"; options: readonly string[] }
  | { input: "score" }
  | { input: "image"; cta: string; format: string; shape: "portrait" | "landscape" };

/** Como cada campo obrigatório é preenchido (a regra de obrigatoriedade fica no domínio). */
const INPUTS: Record<PostKind, Record<string, Input>> = {
  thought: {
    title: { input: "text", placeholder: "[Título do pensamento]" },
    lead: { input: "area", placeholder: "[A pergunta ou a ideia que move o texto.]" },
  },
  book: {
    title: { input: "text", placeholder: "[Nome do livro]" },
    author: { input: "text", placeholder: "[Autor]" },
    cover: { input: "image", cta: "Enviar capa do livro", format: "JPG ou PNG, 2:3, preto e branco no site", shape: "portrait" },
    year: { input: "text", placeholder: "[ano]", half: true },
    pages: { input: "text", placeholder: "[nº]", half: true },
    genres: { input: "chips", options: BOOK_GENRES },
    score: { input: "score" },
  },
  game: {
    title: { input: "text", placeholder: "[Nome do jogo]" },
    studio: { input: "text", placeholder: "[Estúdio]" },
    platform: { input: "select", options: GAME_PLATFORMS },
    capture: { input: "image", cta: "Enviar captura do jogo", format: "JPG ou PNG, 16:9, preto e branco no site", shape: "landscape" },
    hours: { input: "text", placeholder: "Ex.: 42", half: true },
    year: { input: "text", placeholder: "[ano]", half: true },
    genre: { input: "select", options: GAME_GENRES },
    score: { input: "score" },
    worth: { input: "select", options: GAME_WORTH },
    difficulty: { input: "select", options: GAME_DIFFICULTY },
    audience: { input: "area", placeholder: "Ex.: quem gosta de exploração sem pressa" },
  },
};

const DATA_TITLE = { thought: "Dados do pensamento", book: "Dados do livro", game: "Dados do jogo", lesson: "Dados da aula" };
const NEW_STUDY = "__novo__";
const OPENED_STUDY = "__aberto__";

type DataPanelProps = {
  workspace: EditorWorkspace;
  lesson: LessonDraft;
  lessonIndex: number;
  catalog: EditorCatalog;
  report: DraftReport;
  imageError: string | null;
  onPickImage: (apply: (image: ImageRef) => void) => void;
  dispatch: (action: EditorAction) => void;
};

const badge = (check: RequirementCheck | null) => <RequiredBadge ok={!!check?.ok} problem={check?.problem} />;

/** Aba Dados: campos obrigatórios que preenchem os blocos fixos. */
export function DataPanel({ workspace, lesson, lessonIndex, catalog, report, imageError, onPickImage, dispatch }: DataPanelProps) {
  const { kind } = workspace;
  const scoped = kind === "lesson" ? report.required.filter((c) => c.key === STUDY_CHECK_KEY || c.key.startsWith(lessonCheckKey(lesson.id, ""))) : report.required;
  const done = scoped.filter((c) => c.ok).length;

  return (
    <>
      {kind === "lesson" && (
        <PanelSection title={`Formato da aula ${pad2(lessonIndex + 1)}`}>
          <div className={styles.segment} role="group" aria-label="Formato da aula">
            {(["video", "text"] as const).map((format) => (
              <Chip key={format} selected={lesson.format === format} aria-pressed={lesson.format === format} onClick={() => dispatch({ type: "setLessonFormat", format })}>
                {format === "video" ? "Vídeo" : "Texto"}
              </Chip>
            ))}
          </div>
          <FieldHint>{lesson.format === "video" ? "Formato vídeo: a URL do vídeo passa a ser obrigatória." : "Formato texto: a aula não tem vídeo nem exige URL."}</FieldHint>
        </PanelSection>
      )}

      <PanelSection title={DATA_TITLE[kind]} aside={`${done} de ${scoped.length}`}>
        <ProgressBar value={scoped.length ? done / scoped.length : 0} label="Obrigatórios preenchidos" />
        <FieldHint>Campos obrigatórios para publicar. Eles preenchem os blocos fixos do texto, marcados com o ícone de vínculo.</FieldHint>
        {kind === "lesson" ? (
          <LessonFields lesson={lesson} workspace={workspace} catalog={catalog} report={report} dispatch={dispatch} />
        ) : (
          <PostFields kind={kind} workspace={workspace} catalog={catalog} report={report} imageError={imageError} onPickImage={onPickImage} dispatch={dispatch} />
        )}
      </PanelSection>
    </>
  );
}

function PostFields({ kind, workspace, catalog, report, imageError, onPickImage, dispatch }: Omit<DataPanelProps, "lesson" | "lessonIndex"> & { kind: PostKind }) {
  const meta = workspace[kind].meta as unknown as Record<string, unknown>;
  const patch = (p: Record<string, unknown>) => dispatch({ type: "patchMeta", patch: p });

  return (
    <div className={styles.grid}>
      {REQUIRED_FIELDS[kind].map(({ key, label }) => {
        const config = INPUTS[kind][key];
        const check = findCheck(report, key);
        const id = `req-${key}`;
        const missing = !check?.ok;
        const value = meta[key];
        const half = "half" in config && config.half;

        let control;
        switch (config.input) {
          case "text":
            control = <TextInput id={id} value={value as string} placeholder={config.placeholder} onChange={(e) => patch({ [key]: e.target.value })} />;
            break;
          case "area":
            control = <TextArea id={id} rows={2} value={value as string} placeholder={config.placeholder} onChange={(e) => patch({ [key]: e.target.value })} />;
            break;
          case "select":
            control = (
              <SelectInput id={id} value={value as string} placeholder="Selecione…" options={config.options.map((o) => ({ value: o, label: o }))} onChange={(e) => patch({ [key]: e.target.value })} />
            );
            break;
          case "chips": {
            const selected = value as string[];
            control = (
              <div className={styles.chips}>
                {config.options.map((option) => {
                  const on = selected.includes(option);
                  return (
                    <Chip key={option} selected={on} aria-pressed={on} className={styles.chip} onClick={() => patch({ [key]: on ? selected.filter((g) => g !== option) : [...selected, option] })}>
                      {option}
                    </Chip>
                  );
                })}
              </div>
            );
            break;
          }
          case "score":
            control = (
              <>
                <ScoreSelector label={label} value={value as number | null} scores={SCORES} onChange={(score) => patch({ score })} />
                <TextInput aria-label="Frase final do veredito (opcional)" value={meta.verdictLine as string} placeholder="Frase final (opcional)" onChange={(e) => patch({ verdictLine: e.target.value })} />
              </>
            );
            break;
          case "image":
            control = (
              <ImageField
                image={value as ImageRef | null}
                cta={config.cta}
                format={config.format}
                shape={config.shape}
                error={imageError}
                onPick={() => onPickImage((image) => patch({ [key]: image }))}
                onRemove={() => patch({ [key]: null })}
              />
            );
            break;
        }

        const groupLabel = config.input === "chips" || config.input === "score" || config.input === "image";
        return (
          <div key={key} className={half ? styles.half : styles.full}>
            <FieldShell htmlFor={groupLabel ? undefined : id} label={label} badge={badge(check)} missing={missing && config.input !== "image"}>
              {control}
            </FieldShell>
          </div>
        );
      })}

      {kind !== "thought" && (
        <div className={styles.full}>
          {kind === "book" ? (
            <CollectionQuestion kind="book" meta={workspace.book.meta} plan={bookCollectionPlan(workspace.book.meta, catalog)} check={findCheck(report, COLLECTION_CHECK_KEY)} catalog={catalog} onPatch={patch} />
          ) : (
            <CollectionQuestion kind="game" meta={workspace.game.meta} plan={gameCollectionPlan(workspace.game.meta, catalog)} check={findCheck(report, COLLECTION_CHECK_KEY)} catalog={catalog} onPatch={patch} />
          )}
        </div>
      )}
    </div>
  );
}

function LessonFields({ lesson, workspace, catalog, report, dispatch }: Pick<DataPanelProps, "lesson" | "workspace" | "catalog" | "report" | "dispatch">) {
  const { study } = workspace.study;
  const studyCheck = findCheck(report, STUDY_CHECK_KEY);
  const titleCheck = findCheck(report, lessonCheckKey(lesson.id, "title"));
  const videoCheck = findCheck(report, lessonCheckKey(lesson.id, "videoUrl"));
  const studyValue = study.mode === "new" ? NEW_STUDY : study.mode === "opened" ? OPENED_STUDY : (study.studyId ?? "");
  // Estudo de uma pasta aberta (pode não estar no catálogo do blog).
  const openedOption = study.mode === "opened" && study.opened ? [{ value: OPENED_STUDY, label: `${study.opened.title} · pasta aberta` }] : [];

  return (
    <div className={styles.grid}>
      <div className={styles.full}>
        <FieldShell htmlFor="req-study" label="Estudo" badge={badge(studyCheck)} missing={!studyCheck?.ok} hint="Vale para todas as aulas abertas.">
          <SelectInput
            id="req-study"
            value={studyValue}
            placeholder="Selecione o estudo…"
            options={[...openedOption, ...catalog.studies.map((s) => ({ value: s.id, label: `${s.title} · ${s.lessonCount} aula(s)` })), { value: NEW_STUDY, label: "+ Novo estudo" }]}
            onChange={(e) => {
              const value = e.target.value;
              if (value === OPENED_STUDY) return dispatch({ type: "patchStudy", patch: { mode: "opened" } });
              dispatch({ type: "patchStudy", patch: value === NEW_STUDY ? { mode: "new", studyId: null } : { mode: value ? "existing" : null, studyId: value || null } });
            }}
          />
        </FieldShell>
      </div>
      {study.mode === "new" && (
        <div className={styles.full}>
          <FieldShell htmlFor="req-study-name" label="Nome do novo estudo" missing={!study.newStudyName.trim()}>
            <TextInput id="req-study-name" value={study.newStudyName} placeholder="[Nome do estudo]" onChange={(e) => dispatch({ type: "patchStudy", patch: { newStudyName: e.target.value } })} />
          </FieldShell>
        </div>
      )}
      <div className={styles.full}>
        <FieldShell htmlFor="req-title" label="Título da aula" badge={badge(titleCheck)} missing={!titleCheck?.ok}>
          <TextInput id="req-title" value={lesson.title} placeholder="[Título da aula]" onChange={(e) => dispatch({ type: "patchLesson", patch: { title: e.target.value } })} />
        </FieldShell>
      </div>
      {lesson.format === "video" && (
        <>
          <div className={styles.full}>
            <FieldShell
              htmlFor="req-video"
              label="Vídeo da aula"
              badge={badge(videoCheck)}
              missing={!videoCheck?.ok}
              hint={videoCheck?.problem === "invalid" ? "Use um link completo, começando com https://" : "Cole a URL do vídeo (YouTube, Vimeo ou arquivo)."}
            >
              <TextInput id="req-video" type="url" value={lesson.videoUrl} placeholder="https://youtube.com/… ou https://vimeo.com/…" onChange={(e) => dispatch({ type: "patchLesson", patch: { videoUrl: e.target.value } })} />
            </FieldShell>
          </div>
          <div className={styles.half}>
            <FieldShell htmlFor="req-duration" label="Duração (opcional)">
              <TextInput id="req-duration" value={lesson.duration} placeholder="12:40" onChange={(e) => dispatch({ type: "patchLesson", patch: { duration: e.target.value } })} />
            </FieldShell>
          </div>
        </>
      )}
      {workspace.study.lessons.length > 1 && (
        <div className={styles.full}>
          <button type="button" className={`mono ${styles.textButton}`} onClick={() => dispatch({ type: "removeLesson", id: lesson.id })}>
            Remover esta aula
          </button>
        </div>
      )}
    </div>
  );
}
