import Image from "next/image";
import styles from "./CoverStage.module.css";

/** Palco da capa do livro: fundo listrado e a capa inclinada flutuando (imagem ou capa-modelo). */
export function BookCoverStage({ title, image, placeholderLabel }: { title: string; image: string | null; placeholderLabel: string }) {
  return (
    <div className={`${styles.stage} ${styles.bookStage}`}>
      <div className={styles.lines} aria-hidden="true" />
      <div className={styles.book}>
        {image ? (
          <Image src={image} alt="" fill sizes="200px" className={styles.bookImage} />
        ) : (
          <>
            <span className={`mono ${styles.bookLabel}`}>{placeholderLabel}</span>
            <span className={`serif ${styles.bookTitle}`}>{title}</span>
          </>
        )}
      </div>
    </div>
  );
}

/** Captura do jogo em tela fixa escura, com linhas de varredura e HUD. */
export function GameCaptureStage({ image, label, alt }: { image: string | null; label: string; alt: string }) {
  return (
    <div className={`${styles.stage} ${styles.gameStage}`}>
      {image && <Image src={image} alt={alt} fill sizes="(min-width: 1200px) 1280px, 100vw" className={styles.capture} />}
      <div className={styles.scan} aria-hidden="true" />
      <div className={`mono ${styles.hud}`} aria-hidden="true">
        {label}
      </div>
      <div className={`mono ${styles.hp}`} aria-hidden="true">
        <span>HP</span>
        <span className={styles.hpBar}>
          <span />
        </span>
      </div>
    </div>
  );
}
