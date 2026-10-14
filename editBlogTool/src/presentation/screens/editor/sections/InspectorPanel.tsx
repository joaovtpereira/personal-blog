import { SegmentedTabs, panelId } from "@/presentation/components/SegmentedTabs";
import type { ReactNode } from "react";
import type { InspectorPanel as Panel } from "../state/editor-state";
import styles from "./InspectorPanel.module.css";

const PREFIX = "inspector";

type InspectorPanelProps = {
  panel: Panel;
  dataCount: string;
  onChange: (panel: Panel) => void;
  children: ReactNode;
};

/** Coluna da direita: abas Dados / Bloco / Publicação. */
export function InspectorPanel({ panel, dataCount, onChange, children }: InspectorPanelProps) {
  return (
    <aside className={styles.inspector} aria-label="Propriedades">
      <SegmentedTabs
        tabs={[
          { id: "data", label: `Dados ${dataCount}` },
          { id: "block", label: "Bloco" },
          { id: "post", label: "Publicação" },
        ]}
        value={panel}
        onChange={onChange}
        label="Painel de propriedades"
        idPrefix={PREFIX}
      />
      <div id={panelId(PREFIX, panel)} role="tabpanel" aria-labelledby={`${PREFIX}-tab-${panel}`} className={styles.body}>
        {children}
      </div>
    </aside>
  );
}
