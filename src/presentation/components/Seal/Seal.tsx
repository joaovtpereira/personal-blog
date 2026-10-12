import styles from "./Seal.module.css";

type SealProps = {
  text: string;
  /** id único do caminho circular na página. */
  pathId: string;
  className?: string;
};

/** Selo girando com texto em círculo e seta ao centro. Decorativo. */
export function Seal({ text, pathId, className }: SealProps) {
  return (
    <div className={`${styles.seal} ${className ?? ""}`} aria-hidden="true">
      <svg viewBox="0 0 112 112" width="100%" height="100%">
        <defs>
          <path id={pathId} d="M56 56m-40 0a40 40 0 1 1 80 0a40 40 0 1 1-80 0" />
        </defs>
        <text className={`mono ${styles.text}`}>
          <textPath href={`#${pathId}`} textLength="249" lengthAdjust="spacing">
            {text}
          </textPath>
        </text>
        <path
          d="M50 62l12-12M52 50h10v10"
          stroke="currentColor"
          strokeWidth="1.6"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
