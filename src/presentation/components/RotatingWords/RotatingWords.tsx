import styles from "./RotatingWords.module.css";

/** Palavras que trocam no lugar (4 palavras + a primeira de novo para o loop). */
export function RotatingWords({ words }: { words: string[] }) {
  const loop = [...words.slice(0, 4), words[0]];
  return (
    <>
      <span className="sr-only">{words.join(" ")}</span>
      <span className={styles.window} aria-hidden="true">
        <span className={styles.track}>
          {loop.map((word, i) => (
            <span key={i} className={`serif ${styles.word}`}>
              {word}
            </span>
          ))}
        </span>
      </span>
    </>
  );
}
