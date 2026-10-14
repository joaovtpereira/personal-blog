import { ContentRenderer } from "@/presentation/components/Content";
import { isValidVideoUrl, type FreeBlock } from "@editor/domain/entities";
import type { BlockPreviewMapper } from "@editor/domain/mappers";
import styles from "./DocumentCanvas.module.css";

/** Bloco livre renderizado pelo ContentRenderer do blog (mesmo visual do site). */
export function BlockPreview({ block, preview }: { block: FreeBlock; preview: BlockPreviewMapper }) {
  if (block.type === "figure" && !block.image) {
    return (
      <figure className={styles.figure}>
        <div className={`mono ${styles.mediaPlaceholder}`} style={{ aspectRatio: block.ratio }}>
          [IMAGEM] · ENVIE NO INSPECTOR
        </div>
        {block.caption && <figcaption className={`mono ${styles.caption}`}>{block.caption}</figcaption>}
      </figure>
    );
  }
  if (block.type === "video" && !isValidVideoUrl(block.url)) {
    return (
      <div className={`mono ${styles.mediaPlaceholder}`} style={{ aspectRatio: "16 / 9" }}>
        [VÍDEO] · COLE A URL NO INSPECTOR
      </div>
    );
  }
  return <ContentRenderer blocks={[preview.toContentBlock(block)]} headingOffset={0} />;
}
