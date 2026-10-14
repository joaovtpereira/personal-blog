import type { CalloutTone, DividerVariant, EditorBlock, FigureRatio, FreeBlock, FreeBlockData, HeadingLevel, ImageRef } from "@editor/domain/entities";
import { CheckboxField, FieldHint, FieldShell, ImageField, LinesField, PanelSection, SelectInput, TextArea, TextInput } from "@editor/presentation/components";
import { Button } from "@/presentation/components/Button";
import { BLOCK_META, SLOT_META } from "@editor/presentation/utils/block-meta";
import { LINE_FORMATS, pad2 } from "@editor/presentation/utils/text-lines";
import styles from "./Panels.module.css";

type BlockInspectorProps = {
  block: EditorBlock | null;
  index: number;
  imageError: string | null;
  onChange: (patch: Partial<FreeBlockData>) => void;
  onPickImage: (apply: (image: ImageRef) => void) => void;
  onOpenData: () => void;
};

const LEVELS: HeadingLevel[] = [2, 3, 4];
const TONES: { value: CalloutTone; label: string }[] = [
  { value: "note", label: "Nota" },
  { value: "tip", label: "Dica" },
  { value: "warning", label: "Atenção" },
  { value: "exercise", label: "Exercício" },
];
const DIVIDERS: { value: DividerVariant; label: string }[] = [
  { value: "line", label: "Fio" },
  { value: "short", label: "Fio curto" },
  { value: "ornament", label: "Ornamento ✦ ✦ ✦" },
];
const RATIOS: { value: FigureRatio; label: string }[] = [
  { value: "16 / 9", label: "16:9 — captura, paisagem" },
  { value: "2 / 3", label: "2:3 — capa de livro" },
  { value: "1 / 1", label: "1:1 — quadrada" },
];

/** Aba Bloco: edita o conteúdo do bloco selecionado. */
export function BlockInspector({ block, index, imageError, onChange, onPickImage, onOpenData }: BlockInspectorProps) {
  if (!block) {
    return (
      <PanelSection title="Nenhum bloco selecionado">
        <FieldHint>Clique no nome de um bloco no documento para editar o conteúdo dele aqui.</FieldHint>
      </PanelSection>
    );
  }

  if (block.type === "bound") {
    return (
      <PanelSection title={SLOT_META[block.slot].label} aside={`Bloco ${pad2(index + 1)}`}>
        <FieldHint>{SLOT_META[block.slot].help}</FieldHint>
        <div className={`${styles.result} ${styles.quiet}`}>
          Este bloco é preenchido pelos dados obrigatórios. Você pode mudar a posição dele, mas o conteúdo é editado na aba Dados.
        </div>
        <Button variant="ghost" className={styles.inlineButton} onClick={onOpenData}>
          Editar na aba Dados
        </Button>
      </PanelSection>
    );
  }

  return (
    <PanelSection title={BLOCK_META[block.type].label} aside={`Bloco ${pad2(index + 1)}`}>
      <FieldHint>{BLOCK_META[block.type].help}</FieldHint>
      {/* key: reinicia os campos de texto ao trocar de bloco */}
      <FreeBlockFields key={block.id} block={block} imageError={imageError} onChange={onChange} onPickImage={onPickImage} />
    </PanelSection>
  );
}

function FreeBlockFields({ block, imageError, onChange, onPickImage }: { block: FreeBlock } & Pick<BlockInspectorProps, "imageError" | "onChange" | "onPickImage">) {
  const id = (field: string) => `blk-${block.id}-${field}`;
  const text = (label: string, rows = 5) =>
    "text" in block && (
      <FieldShell htmlFor={id("text")} label={label} hint="Aceita **negrito**, *itálico*, `código` e [link](url).">
        <TextArea id={id("text")} rows={rows} value={block.text} onChange={(e) => onChange({ text: e.target.value })} />
      </FieldShell>
    );

  switch (block.type) {
    case "heading":
      return (
        <>
          <FieldShell label="Nível">
            <div className={styles.levels} role="group" aria-label="Nível do título">
              {LEVELS.map((level) => (
                <button key={level} type="button" aria-pressed={block.level === level} className={`mono ${block.level === level ? styles.on : ""}`} onClick={() => onChange({ level })}>
                  H{level}
                </button>
              ))}
            </div>
          </FieldShell>
          <FieldShell htmlFor={id("text")} label="Texto">
            <TextInput id={id("text")} value={block.text} onChange={(e) => onChange({ text: e.target.value })} />
          </FieldShell>
          <FieldShell htmlFor={id("accent")} label="Palavra em itálico (opcional)">
            <TextInput id={id("accent")} value={block.accent} placeholder="Uma palavra no fim do título" onChange={(e) => onChange({ accent: e.target.value })} />
          </FieldShell>
        </>
      );
    case "paragraph":
      return (
        <>
          {text("Texto", 7)}
          <CheckboxField label="Letra capitular (só no 1º parágrafo)" checked={block.dropCap} onChange={(e) => onChange({ dropCap: e.target.checked })} />
        </>
      );
    case "quote":
      return (
        <>
          {text("Citação", 4)}
          <FieldShell htmlFor={id("cite")} label="Fonte (opcional)">
            <TextInput id={id("cite")} value={block.cite} placeholder="[Autor], p. [nº]" onChange={(e) => onChange({ cite: e.target.value })} />
          </FieldShell>
        </>
      );
    case "callout":
      return (
        <>
          <FieldShell htmlFor={id("tone")} label="Tipo de aviso">
            <SelectInput id={id("tone")} value={block.tone} options={TONES} onChange={(e) => onChange({ tone: e.target.value as CalloutTone })} />
          </FieldShell>
          <FieldShell htmlFor={id("title")} label="Título (opcional)">
            <TextInput id={id("title")} value={block.title} onChange={(e) => onChange({ title: e.target.value })} />
          </FieldShell>
          {text("Texto", 4)}
        </>
      );
    case "spoiler":
      return text("Texto", 4);
    case "list":
      return (
        <>
          <LinesField id={id("items")} label="Itens" hint="Um item por linha." value={block.items} {...LINE_FORMATS.items} onChange={(items) => onChange({ items })} />
          <CheckboxField label="Lista numerada" checked={block.ordered} onChange={(e) => onChange({ ordered: e.target.checked })} />
        </>
      );
    case "checklist":
      return (
        <>
          <FieldShell htmlFor={id("title")} label="Título (opcional)">
            <TextInput id={id("title")} value={block.title} onChange={(e) => onChange({ title: e.target.value })} />
          </FieldShell>
          <LinesField id={id("items")} label="Tarefas" hint="Uma tarefa por linha." value={block.items} {...LINE_FORMATS.items} onChange={(items) => onChange({ items })} />
        </>
      );
    case "keyPoints":
      return <LinesField id={id("items")} label="Ideias" hint="Uma ideia por linha." value={block.items} {...LINE_FORMATS.items} onChange={(items) => onChange({ items })} />;
    case "steps":
      return <LinesField id={id("items")} label="Passos" hint="Um por linha: título — explicação." value={block.items} {...LINE_FORMATS.steps} onChange={(items) => onChange({ items })} />;
    case "glossary":
      return <LinesField id={id("items")} label="Termos" hint="Um por linha: termo: definição." value={block.items} {...LINE_FORMATS.glossary} onChange={(items) => onChange({ items })} />;
    case "table":
      return (
        <>
          <FieldShell htmlFor={id("caption")} label="Título da tabela">
            <TextInput id={id("caption")} value={block.caption} onChange={(e) => onChange({ caption: e.target.value })} />
          </FieldShell>
          <LinesField
            id={id("data")}
            label="Dados"
            hint="1ª linha = cabeçalho. Separe colunas com |."
            mono
            value={{ columns: block.columns, rows: block.rows }}
            {...LINE_FORMATS.table}
            onChange={(table) => onChange(table)}
          />
        </>
      );
    case "code":
      return (
        <>
          <FieldShell htmlFor={id("file")} label="Arquivo ou linguagem">
            <TextInput id={id("file")} value={block.filename} placeholder="exemplo.ts ou python" onChange={(e) => onChange({ filename: e.target.value })} />
          </FieldShell>
          <FieldShell htmlFor={id("code")} label="Código">
            <TextArea id={id("code")} mono rows={10} spellCheck={false} value={block.code} onChange={(e) => onChange({ code: e.target.value })} />
          </FieldShell>
          <CheckboxField label="Mostrar números de linha" checked={block.lineNumbers} onChange={(e) => onChange({ lineNumbers: e.target.checked })} />
        </>
      );
    case "figure":
      return (
        <>
          <ImageField
            image={block.image}
            cta="Enviar imagem"
            format="JPG, PNG ou WEBP — copiada para public/images ao exportar"
            error={imageError}
            onPick={() => onPickImage((image) => onChange({ image }))}
            onRemove={() => onChange({ image: null })}
          />
          <FieldShell htmlFor={id("alt")} label="Texto alternativo" hint="Descreva a imagem para leitores de tela. Sem ele, a legenda é usada.">
            <TextInput id={id("alt")} value={block.alt} onChange={(e) => onChange({ alt: e.target.value })} />
          </FieldShell>
          <FieldShell htmlFor={id("caption")} label="Legenda">
            <TextInput id={id("caption")} value={block.caption} onChange={(e) => onChange({ caption: e.target.value })} />
          </FieldShell>
          <FieldShell htmlFor={id("credit")} label="Crédito">
            <TextInput id={id("credit")} value={block.credit} placeholder="Foto: [autor]" onChange={(e) => onChange({ credit: e.target.value })} />
          </FieldShell>
          <FieldShell htmlFor={id("ratio")} label="Proporção">
            <SelectInput id={id("ratio")} value={block.ratio} options={RATIOS} onChange={(e) => onChange({ ratio: e.target.value as FigureRatio })} />
          </FieldShell>
        </>
      );
    case "video":
      return (
        <>
          <FieldShell htmlFor={id("url")} label="URL do vídeo">
            <TextInput id={id("url")} type="url" value={block.url} placeholder="https://" onChange={(e) => onChange({ url: e.target.value })} />
          </FieldShell>
          <FieldShell htmlFor={id("duration")} label="Duração">
            <TextInput id={id("duration")} value={block.duration} placeholder="12:40" onChange={(e) => onChange({ duration: e.target.value })} />
          </FieldShell>
        </>
      );
    case "raw":
      return (
        <FieldShell htmlFor={id("markdown")} label="Markdown original" hint="Gravado sem mudanças ao salvar. Se não precisar dele, remova o bloco.">
          <TextArea id={id("markdown")} mono rows={10} spellCheck={false} value={block.markdown} onChange={(e) => onChange({ markdown: e.target.value })} />
        </FieldShell>
      );
    case "divider":
      return (
        <FieldShell htmlFor={id("variant")} label="Estilo">
          <SelectInput id={id("variant")} value={block.variant} options={DIVIDERS} onChange={(e) => onChange({ variant: e.target.value as DividerVariant })} />
        </FieldShell>
      );
  }
}
