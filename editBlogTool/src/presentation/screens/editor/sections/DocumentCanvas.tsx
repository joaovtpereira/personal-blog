import { CollectionNav } from "@/presentation/components/CollectionNav";
import type { CollectionPosition } from "@/domain/entities";
import type { CollectionPlan, EditorBlock } from "@editor/domain/entities";
import { showsCollection } from "@editor/domain/entities";
import { BlockFrame } from "@editor/presentation/components";
import { BLOCK_META, SLOT_META } from "@editor/presentation/utils/block-meta";
import { pad2 } from "@editor/presentation/utils/text-lines";
import type { EditorAction } from "../state/editor-state";
import { BlockPreview } from "./BlockPreview";
import { SlotPreview, type SlotContext } from "./SlotPreview";
import styles from "./DocumentCanvas.module.css";

type DocumentCanvasProps = {
  id: string;
  labelledBy: string;
  blocks: EditorBlock[];
  selectedId: string | null;
  plain: boolean;
  collection: CollectionPlan | null;
  context: SlotContext;
  dispatch: (action: EditorAction) => void;
};

/** Monta a posição na coleção para o CollectionNav do blog (só com 2+ itens). */
function collectionPosition(plan: CollectionPlan, currentTitle: string): CollectionPosition | null {
  if (plan.status === "standalone" || !showsCollection(plan)) return null;
  const previousPosition = plan.position - 1;
  return {
    kind: "reviews",
    id: plan.id ?? "nova-colecao",
    slug: plan.slug,
    name: plan.name,
    position: plan.position,
    total: plan.total,
    previous: previousPosition > 0 ? { slug: "anterior", title: plan.previous?.title ?? "[Parte anterior]", position: previousPosition } : null,
    current: { slug: "atual", title: currentTitle || "[Esta resenha]", position: plan.position },
    next: null,
  };
}

export function DocumentCanvas({ id, labelledBy, blocks, selectedId, plain, collection, context, dispatch }: DocumentCanvasProps) {
  const { workspace } = context;
  const title = workspace.kind === "lesson" ? context.lesson.title : workspace[workspace.kind].meta.title;
  const position = collection ? collectionPosition(collection, title) : null;

  return (
    <article id={id} role="tabpanel" aria-labelledby={labelledBy} className={`${styles.doc} ${plain ? styles.plain : ""}`}>
      {blocks.length === 0 && (
        <div className={styles.empty}>
          <p className={styles.emptyTitle}>Documento vazio</p>
          <p>Escolha um bloco na coluna da esquerda para começar.</p>
        </div>
      )}

      {blocks.map((block, i) => {
        const bound = block.type === "bound";
        return (
          <BlockFrame
            key={block.id}
            index={pad2(i + 1)}
            label={bound ? SLOT_META[block.slot].label : BLOCK_META[block.type].label}
            boundLabel={bound ? SLOT_META[block.slot].bound : null}
            selected={block.id === selectedId}
            plain={plain}
            isFirst={i === 0}
            isLast={i === blocks.length - 1}
            onSelect={() => dispatch({ type: "selectBlock", id: block.id })}
            onMove={(direction) => dispatch({ type: "moveBlock", id: block.id, direction })}
            onDuplicate={() => dispatch({ type: "duplicateBlock", id: block.id })}
            onRemove={() => dispatch({ type: "removeBlock", id: block.id })}
          >
            {bound ? <SlotPreview slot={block.slot} context={context} /> : <BlockPreview block={block} preview={context.preview} />}
          </BlockFrame>
        );
      })}

      {position && (
        <div className={styles.collection}>
          {!plain && <span className={`mono ${styles.generated}`}>Gerado a partir da coleção · não editável aqui</span>}
          <CollectionNav collection={position} />
        </div>
      )}
    </article>
  );
}
