import { useEffect, useState } from "react";
import { Button } from "@/presentation/components/Button";
import { Chip } from "@/presentation/components/Chip";
import { FactSheet, type Fact } from "@/presentation/components/FactSheet";
import { Icon } from "@/presentation/components/Icon";
import type { ContentFileSummary, DraftKind, OpenedContent } from "@editor/domain/entities";
import type { ListContentFiles, OpenContentFile, PickContentFile } from "@editor/domain/use-cases";
import { CheckRow, FieldHint, Modal, PanelSection, TextInput } from "@editor/presentation/components";
import { KIND_TABS } from "@editor/presentation/utils/block-meta";
import { formatDate } from "@editor/presentation/utils/format-date";
import styles from "./OpenContentDialog.module.css";

type Filter = DraftKind | "all";

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "Todos" },
  { id: "thought", label: "Pensamentos" },
  { id: "book", label: "Livros" },
  { id: "game", label: "Jogos" },
  { id: "lesson", label: "Aulas" },
];
const GLYPH: Record<DraftKind, string> = { thought: "“", book: "▤", game: "▶", lesson: "◫" };
const kindLabel = (kind: DraftKind) => KIND_TABS.find((k) => k.id === kind)?.label ?? "";

type OpenContentDialogProps = {
  open: boolean;
  dirty: Record<DraftKind, boolean>;
  listFiles: ListContentFiles;
  openFile: OpenContentFile;
  pickFile: PickContentFile;
  onOpen: (content: OpenedContent) => void;
  onNewDraft: () => void;
  onClose: () => void;
};

type Selection = { state: "none" } | { state: "loading"; path: string } | { state: "ready"; path: string; content: OpenedContent } | { state: "error"; path: string; message: string };

const message = (error: unknown) => (error instanceof Error ? error.message : "Não foi possível ler o arquivo.");

/** "Abrir Markdown": escolhe um post ou aula em content/post para editar. */
export function OpenContentDialog({ open, dirty, listFiles, openFile, pickFile, onOpen, onNewDraft, onClose }: OpenContentDialogProps) {
  const [files, setFiles] = useState<ContentFileSummary[] | null>(null);
  const [listError, setListError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [selection, setSelection] = useState<Selection>({ state: "none" });

  useEffect(() => {
    if (!open) return;
    let active = true;
    setFiles(null);
    setListError(null);
    setSelection({ state: "none" });
    listFiles
      .list()
      .then((list) => active && setFiles(list))
      .catch((error) => active && setListError(message(error)));
    return () => {
      active = false;
    };
  }, [open, listFiles]);

  const select = async (path: string) => {
    setSelection({ state: "loading", path });
    try {
      const content = await openFile.open(path);
      setSelection((current) => (current.state === "loading" && current.path === path ? { state: "ready", path, content } : current));
    } catch (error) {
      setSelection({ state: "error", path, message: message(error) });
    }
  };

  const browse = async () => {
    try {
      const path = await pickFile.pick();
      if (path) await select(path);
    } catch (error) {
      setSelection({ state: "error", path: "", message: message(error) });
    }
  };

  const q = query.trim().toLowerCase();
  const visible = (files ?? []).filter((f) => (filter === "all" || f.kind === filter) && (!q || `${f.title} ${f.path}`.toLowerCase().includes(q)));
  const selectedPath = selection.state === "none" ? null : selection.path;
  const ready = selection.state === "ready" ? selection.content : null;

  return (
    <Modal open={open} size="l" labelledBy="open-title" onClose={onClose}>
      <div className={styles.head}>
        <div>
          <span className={`mono ${styles.label}`}>Abrir conteúdo existente</span>
          <h2 id="open-title" className={styles.title}>
            Editar um post ou aula
          </h2>
          <FieldHint>Arquivos .md em content/post do blog. Os dados obrigatórios vêm do frontmatter e os blocos, do corpo do arquivo.</FieldHint>
        </div>
        <button type="button" className={styles.close} aria-label="Fechar" onClick={onClose}>
          <Icon name="close" />
        </button>
      </div>

      <div className={styles.toolbar}>
        <div className={styles.filters} role="group" aria-label="Filtrar por tipo">
          {FILTERS.map((f) => (
            <Chip key={f.id} selected={filter === f.id} aria-pressed={filter === f.id} className={styles.chip} onClick={() => setFilter(f.id)}>
              {f.label}
              <span className={`mono ${styles.count}`}>{f.id === "all" ? (files?.length ?? 0) : (files ?? []).filter((x) => x.kind === f.id).length}</span>
            </Chip>
          ))}
        </div>
        <TextInput type="search" aria-label="Buscar por título ou arquivo" placeholder="Buscar por título ou arquivo" value={query} onChange={(e) => setQuery(e.target.value)} className={styles.search} />
      </div>

      <div className={styles.columns}>
        <div className={styles.listColumn}>
          <div className={styles.list} role="listbox" aria-label="Arquivos" aria-busy={files === null && !listError}>
            {files === null && !listError && <p className={styles.empty}>Lendo content/post…</p>}
            {listError && (
              <p className={styles.empty} role="alert">
                {listError}
              </p>
            )}
            {files !== null && visible.length === 0 && <p className={styles.empty}>{files.length ? "Nenhum arquivo com esse filtro." : "Nenhum arquivo em content/post ainda."}</p>}
            {visible.map((file) => {
              const on = file.path === selectedPath;
              return (
                <button key={file.path} type="button" role="option" aria-selected={on} className={`${styles.file} ${on ? styles.on : ""}`} onClick={() => select(file.path)}>
                  <span className={`mono ${styles.glyph}`} aria-hidden="true">
                    {GLYPH[file.kind]}
                  </span>
                  <span className={styles.fileText}>
                    <span className={styles.fileTitle}>{file.title}</span>
                    <span className={`mono ${styles.path}`}>{file.path}</span>
                  </span>
                  <span className={`mono ${styles.date}`}>{formatDate(file.modifiedAt)}</span>
                </button>
              );
            })}
          </div>
          <button type="button" className={styles.browse} onClick={browse}>
            <span className={`mono ${styles.glyph}`} aria-hidden="true">
              …
            </span>
            <span>
              <span className={styles.fileTitle}>Escolher outro arquivo .md</span>
              <span className={styles.hint}>Abre o seletor do sistema na pasta content/</span>
            </span>
          </button>
        </div>

        <PanelSection title={ready ? undefined : "Nenhum arquivo selecionado"} label="Prévia do arquivo">
          {selection.state === "none" && <FieldHint>Escolha um arquivo à esquerda para ver o que será carregado no editor.</FieldHint>}
          {selection.state === "loading" && <FieldHint>Lendo {selection.path}…</FieldHint>}
          {selection.state === "error" && (
            <p className={styles.notice} role="alert">
              {selection.message}
            </p>
          )}
          {ready && <ReadingPreview content={ready} replacing={dirty[ready.kind]} />}
        </PanelSection>
      </div>

      <div className={styles.footer}>
        <Button variant="ghost" className={styles.button} onClick={onNewDraft}>
          Começar rascunho novo
        </Button>
        <div className={styles.actions}>
          <Button variant="ghost" className={styles.button} onClick={onClose}>
            Cancelar
          </Button>
          <Button className={styles.button} disabled={!ready} onClick={() => ready && onOpen(ready)}>
            Abrir para editar
          </Button>
        </div>
      </div>
    </Modal>
  );
}

function ReadingPreview({ content, replacing }: { content: OpenedContent; replacing: boolean }) {
  const { reading } = content;
  const facts: Fact[] = [
    { label: "Arquivo", value: content.path },
    { label: "Blocos", value: `${reading.blocks}${content.kind === "lesson" ? " nesta aula" : ""}` },
    { label: "Imagens", value: reading.images ? `${reading.images} imagem(ns)` : "nenhuma" },
  ];
  if (reading.study) facts.push({ label: "Estudo", value: `${reading.study.title} · ${reading.study.lessons} aula(s)` });
  if (reading.collection) facts.push({ label: "Coleção", value: reading.collection });

  return (
    <>
      <div>
        <span className={`mono ${styles.label}`}>{kindLabel(content.kind)}</span>
        <p className={styles.previewTitle}>{reading.title || "Sem título"}</p>
      </div>
      <FactSheet facts={facts} layout="list" />
      <div>
        <span className={`mono ${styles.label}`}>Leitura do arquivo</span>
        <ul className={styles.checks}>
          <CheckRow ok text="Frontmatter lido: os dados obrigatórios entram na aba Dados." tone="warn" />
          <CheckRow
            ok={reading.unknown === 0}
            tone="warn"
            text={reading.unknown ? `${reading.unknown} bloco(s) não reconhecido(s): entram como “Markdown não reconhecido” e voltam ao arquivo sem mudanças.` : "Todos os blocos reconhecidos."}
          />
          {reading.study && <CheckRow ok tone="warn" text={`As ${reading.study.lessons} aulas do estudo abrem juntas, com esta em foco.`} />}
        </ul>
      </div>
      {replacing && (
        <p className={styles.notice} role="status">
          O rascunho aberto de {kindLabel(content.kind)} tem alterações não salvas e será substituído por este arquivo.
        </p>
      )}
    </>
  );
}
