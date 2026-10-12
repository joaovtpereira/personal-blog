import styles from "./StatTile.module.css";

type StatTileProps = {
  value: string;
  label: string;
  detail?: string;
  /** outline: borda fina · surface: fundo da página (sobre fotos) · inverted: destaque */
  variant?: "outline" | "surface" | "inverted";
  /** responsive: cresce no tablet · compact: tamanho fixo para flutuar sobre imagens */
  size?: "responsive" | "compact";
  className?: string;
};

/** Número grande + rótulo em mono (8+ ANOS, 4 PLATAFORMAS). */
export function StatTile({ value, label, detail, variant = "outline", size = "responsive", className }: StatTileProps) {
  return (
    <div className={[styles.tile, styles[variant], styles[size], className ?? ""].join(" ")}>
      <div className={styles.value}>{value}</div>
      <div className={`mono ${styles.label}`}>{label}</div>
      {detail && <div className={styles.detail}>{detail}</div>}
    </div>
  );
}
