import { useState } from "react";
import { Button } from "@/presentation/components/Button";
import { Chip } from "@/presentation/components/Chip";
import { CONTENT_LOCALES, type ContentLocale, type Publication } from "@editor/domain/entities";
import { FieldShell, PanelSection, SelectInput, TextInput } from "@editor/presentation/components";
import type { EditorAction } from "../state/editor-state";
import styles from "./Panels.module.css";

const LOCALE_LABEL: Record<ContentLocale, string> = { pt: "Português", es: "Español", en: "English" };

type PublicationPanelProps = {
  publication: Publication;
  readingMinutes: number;
  dispatch: (action: EditorAction) => void;
};

/** Aba Publicação: tags, idioma do conteúdo e tempo de leitura. */
export function PublicationPanel({ publication, readingMinutes, dispatch }: PublicationPanelProps) {
  const [newTag, setNewTag] = useState("");
  const add = () => {
    dispatch({ type: "addTag", tag: newTag });
    setNewTag("");
  };

  return (
    <PanelSection title="Publicação">
      <FieldShell label="Tags">
        <div className={styles.chips}>
          {publication.tagPool.map((tag) => {
            const on = publication.tags.includes(tag);
            return (
              <Chip key={tag} selected={on} aria-pressed={on} className={`mono ${styles.chip}`} onClick={() => dispatch({ type: "toggleTag", tag })}>
                #{tag}
              </Chip>
            );
          })}
        </div>
        <form
          className={styles.addTag}
          onSubmit={(event) => {
            event.preventDefault();
            add();
          }}
        >
          <TextInput aria-label="Nova tag" value={newTag} placeholder="nova tag" onChange={(e) => setNewTag(e.target.value)} />
          <Button type="submit" variant="ghost" className={styles.inlineButton} disabled={!newTag.trim()}>
            Adicionar
          </Button>
        </form>
      </FieldShell>
      <FieldShell htmlFor="pub-locale" label="Idioma do conteúdo">
        <SelectInput
          id="pub-locale"
          value={publication.locale}
          options={CONTENT_LOCALES.map((l) => ({ value: l, label: LOCALE_LABEL[l] }))}
          onChange={(e) => dispatch({ type: "setLocale", locale: e.target.value as ContentLocale })}
        />
      </FieldShell>
      <div className={styles.readTime}>
        <span>Tempo de leitura estimado</span>
        <span className="mono">{readingMinutes} MIN</span>
      </div>
    </PanelSection>
  );
}
