import type { ImageRef } from "@editor/domain/entities";
import { EditorIcon } from "../EditorIcon";
import styles from "./ImageField.module.css";

type ImageFieldProps = {
  image: ImageRef | null;
  /** texto do botão sem imagem ("Enviar capa do livro") */
  cta: string;
  /** formato esperado ("JPG ou PNG, 2:3") */
  format: string;
  shape?: "portrait" | "landscape";
  error?: string | null;
  onPick: () => void;
  onRemove?: () => void;
};

/** Botão de envio de imagem com miniatura. A cópia para o blog só acontece na exportação. */
export function ImageField({ image, cta, format, shape = "landscape", error, onPick, onRemove }: ImageFieldProps) {
  return (
    <div className={styles.wrap}>
      <button type="button" className={`${styles.upload} ${image ? styles.ok : ""}`} onClick={onPick}>
        <span className={`mono ${styles.thumb} ${styles[shape]}`} aria-hidden="true">
          {image ? <img src={image.previewUrl} alt="" /> : <EditorIcon name="plus" />}
        </span>
        <span className={styles.text}>
          <span className={styles.name}>{image ? image.fileName : cta}</span>
          <span className={styles.hint}>{image ? "Clique para trocar a imagem" : format}</span>
        </span>
      </button>
      {image && onRemove && (
        <button type="button" className={`mono ${styles.remove}`} onClick={onRemove}>
          Remover imagem
        </button>
      )}
      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
