import type { BookMeta, CollectionPlan, EditorCatalog, GameMeta, KeptCollection, RequirementCheck } from "@editor/domain/entities";
import { ChoiceGroup, FieldShell, RequiredBadge, SelectInput, TextInput } from "@editor/presentation/components";
import styles from "./Panels.module.css";

type Props = {
  plan: CollectionPlan | null;
  check: RequirementCheck | null;
  catalog: EditorCatalog;
  onPatch: (patch: Record<string, unknown>) => void;
} & ({ kind: "book"; meta: BookMeta } | { kind: "game"; meta: GameMeta });

function resultText(plan: CollectionPlan | null, kept: boolean): { text: string; quiet: boolean } | null {
  if (!plan) return null;
  if (kept && plan.status !== "standalone") return { text: `Mantém “${plan.name}”, parte ${plan.position}, como está no arquivo.`, quiet: true };
  if (plan.status === "standalone") return { text: "Sem coleção: o bloco de coleção não aparece no post.", quiet: true };
  if (plan.status === "join") return { text: `Esta resenha entra em “${plan.name}” como parte ${plan.position} de ${plan.total}.`, quiet: false };
  if (plan.total < 2) return { text: `Cria “${plan.name}” com 1 item. Com 1 item não é coleção: o bloco só aparece quando o próximo entrar.`, quiet: true };
  return { text: `Cria a coleção “${plan.name}” com 2 resenhas: a anterior (parte 1) e esta (parte 2).`, quiet: false };
}

/** Opção extra quando o arquivo aberto já tem coleção. */
const keptChoice = (kept: KeptCollection | null) =>
  kept ? [{ value: "kept" as const, label: "Manter coleção atual", description: `${kept.name} · parte ${kept.position}, como está no arquivo.` }] : [];

/** Pergunta obrigatória de coleção (resenhas). Define se o post entra, cria ou não tem série. */
export function CollectionQuestion(props: Props) {
  const { plan, check, catalog, onPatch } = props;
  const result = resultText(plan, props.meta.collection.answer === "kept");
  const question = props.kind === "book" ? "Continua uma resenha anterior?" : "Faz parte de uma coleção?";

  let details = null;
  let choice;
  if (props.kind === "book") {
    const { collection } = props.meta;
    const previous = catalog.previousBookReviews.find((r) => r.id === collection.previousReviewId);
    const set = (patch: Partial<BookMeta["collection"]>) => onPatch({ collection: { ...collection, ...patch } });
    choice = (
      <ChoiceGroup
        label={question}
        value={collection.answer}
        onChange={(answer) => set({ answer })}
        choices={[
          ...keptChoice(collection.kept),
          { value: "standalone", label: "Não", description: "Resenha independente. Sem bloco de coleção." },
          { value: "continuation", label: "Sim, é continuação", description: "Liga a uma resenha anterior e vira (ou entra em) uma coleção." },
        ]}
      />
    );
    if (collection.answer === "continuation") {
      details = (
        <>
          <FieldShell htmlFor="coll-previous" label="Resenha anterior" missing={!previous}>
            <SelectInput
              id="coll-previous"
              value={collection.previousReviewId ?? ""}
              placeholder="Selecione a resenha…"
              options={catalog.previousBookReviews.map((r) => ({
                value: r.id,
                label: r.series ? `${r.title} — em “${r.series.name}”` : `${r.title} — sem coleção`,
              }))}
              onChange={(e) => set({ previousReviewId: e.target.value || null })}
            />
          </FieldShell>
          {previous && !previous.series && (
            <FieldShell htmlFor="coll-name" label="Nome da nova coleção" missing={!collection.newSeriesName.trim()}>
              <TextInput id="coll-name" value={collection.newSeriesName} placeholder="Ex.: [Nome da série]" onChange={(e) => set({ newSeriesName: e.target.value })} />
            </FieldShell>
          )}
        </>
      );
    }
  } else {
    const { collection } = props.meta;
    const set = (patch: Partial<GameMeta["collection"]>) => onPatch({ collection: { ...collection, ...patch } });
    choice = (
      <ChoiceGroup
        label={question}
        value={collection.answer}
        onChange={(answer) => set({ answer })}
        choices={[
          ...keptChoice(collection.kept),
          { value: "standalone", label: "Não", description: "Jogo independente." },
          { value: "existing", label: "Sim, coleção existente", description: "Entra no fim de uma franquia já criada." },
          { value: "new", label: "Criar nova coleção", description: "Este jogo é o primeiro item." },
        ]}
      />
    );
    if (collection.answer === "existing") {
      details = (
        <FieldShell htmlFor="coll-existing" label="Coleção" missing={!collection.collectionId}>
          <SelectInput
            id="coll-existing"
            value={collection.collectionId ?? ""}
            placeholder="Selecione a coleção…"
            options={catalog.gameCollections.map((c) => ({ value: c.id, label: `${c.name} · ${c.publishedCount} jogo(s)` }))}
            onChange={(e) => set({ collectionId: e.target.value || null })}
          />
        </FieldShell>
      );
    }
    if (collection.answer === "new") {
      details = (
        <FieldShell htmlFor="coll-new" label="Nome da nova coleção" missing={!collection.newCollectionName.trim()}>
          <TextInput id="coll-new" value={collection.newCollectionName} placeholder="Ex.: [Nome da franquia]" onChange={(e) => set({ newCollectionName: e.target.value })} />
        </FieldShell>
      );
    }
  }

  return (
    <div className={styles.collection}>
      <FieldShell label={question} badge={<RequiredBadge ok={!!check?.ok} problem={check?.problem} />}>
        {choice}
      </FieldShell>
      {details}
      {result && <div className={`${styles.result} ${result.quiet ? styles.quiet : ""}`}>{result.text}</div>}
    </div>
  );
}
