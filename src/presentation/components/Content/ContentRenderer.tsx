import Image from "next/image";
import { useTranslations } from "next-intl";
import type { ContentBlock } from "@/domain/entities";
import { splitDropCap } from "@/presentation/utils/drop-cap";
import { VideoPlayer } from "../VideoPlayer";
import { Checklist } from "./Checklist";
import { CodeBlock } from "./CodeBlock";
import { RichTextView } from "./RichTextView";
import { Spoiler } from "./Spoiler";
import styles from "./Content.module.css";

type ContentRendererProps = {
  blocks: ContentBlock[];
  /** reading: texto corrido de aula/post · notes: anotações compactas ao lado do vídeo */
  variant?: "reading" | "notes";
  /**
   * Quantos níveis somar aos títulos do markdown: 1 quando a página já tem um h2 acima
   * (título da aula), 0 quando o texto vem logo após o h1 (posts).
   */
  headingOffset?: 0 | 1;
  className?: string;
};

/**
 * Transforma os blocos da entidade (vindos do markdown) nos componentes de conteúdo do DS.
 * Tamanhos em `em`: herdam a fonte do contêiner (controle de tamanho do texto).
 */
export function ContentRenderer({ blocks, variant = "reading", headingOffset = 1, className }: ContentRendererProps) {
  return (
    <div className={`${styles.content} ${styles[variant]} ${className ?? ""}`}>
      {blocks.map((block, i) => (
        <Block key={i} block={block} headingOffset={headingOffset} />
      ))}
    </div>
  );
}

function Block({ block, headingOffset }: { block: ContentBlock; headingOffset: 0 | 1 }) {
  const t = useTranslations("Content");

  switch (block.type) {
    case "heading": {
      const Tag = `h${block.level + headingOffset}` as "h2" | "h3" | "h4" | "h5";
      return (
        <Tag id={block.anchor} className={`${styles.heading} ${styles[`h${block.level}`]}`}>
          {block.text}
        </Tag>
      );
    }
    case "lead":
      return (
        <p className={`serif ${styles.lead}`}>
          <RichTextView text={block.text} />
        </p>
      );
    case "paragraph": {
      const dropCap = block.dropCap ? splitDropCap(block.text) : null;
      return (
        <p className={`${styles.paragraph} ${block.muted ? styles.muted : ""} ${dropCap ? styles.dropCap : ""}`}>
          {dropCap && (
            <>
              <span className={styles.dropCapLetter} aria-hidden>
                {dropCap.cap}
              </span>
              {dropCap.spoken && <span className="sr-only">{dropCap.spoken}</span>}
            </>
          )}
          <RichTextView text={dropCap ? dropCap.rest : block.text} />
        </p>
      );
    }
    case "keyIdea":
      return (
        <figure className={styles.keyIdea}>
          {block.label && <figcaption className={`mono ${styles.blockLabel}`}>{block.label}</figcaption>}
          <blockquote className="serif">“{block.text}”</blockquote>
        </figure>
      );
    case "quote":
      return (
        <figure className={styles.quote}>
          <blockquote className="serif">
            “<RichTextView text={block.text} />”
          </blockquote>
          {block.cite && <figcaption className="mono">— {block.cite.toUpperCase()}</figcaption>}
        </figure>
      );
    case "reference":
      return <div className={`mono ${styles.reference}`}>{block.text}</div>;
    case "code":
      return <CodeBlock code={block.code} language={block.language} filename={block.filename} />;
    case "list": {
      const List = block.ordered ? "ol" : "ul";
      return (
        <List className={`${styles.list} ${block.ordered ? styles.ordered : ""}`}>
          {block.items.map((item, i) => (
            <li key={i}>
              <RichTextView text={item} />
            </li>
          ))}
        </List>
      );
    }
    case "checklist":
      return <Checklist title={block.title ?? t("checklist")} items={block.items} />;
    case "steps":
      return (
        <ol className={styles.steps}>
          {block.items.map((item, i) => (
            <li key={i}>
              <span className={`mono ${styles.stepNumber}`} aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <strong className={styles.stepTitle}>{item.title}</strong>
                <p className={styles.muted}>
                  <RichTextView text={item.text} />
                </p>
              </div>
            </li>
          ))}
        </ol>
      );
    case "table":
      return (
        <div className={styles.tableWrap} role="region" aria-label={block.caption ?? undefined} tabIndex={0}>
          <table className={styles.table}>
            {block.caption && <caption className="mono">{block.caption}</caption>}
            <thead>
              <tr>
                {block.columns.map((column, i) => (
                  <th key={i} scope="col" className="mono">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, r) => (
                <tr key={r}>
                  {row.map((cell, c) => (
                    <td key={c}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "callout":
      return (
        <aside className={`${styles.callout} ${styles[block.tone]}`}>
          <div className={`mono ${styles.blockLabel}`}>{block.title ?? t(`callout.${block.tone}`)}</div>
          <p>
            <RichTextView text={block.text} />
          </p>
        </aside>
      );
    case "figure":
      return (
        <figure className={styles.figure}>
          <div className={styles.figureMedia} style={{ aspectRatio: block.ratio ?? "16 / 9" }}>
            <Image src={block.src} alt={block.alt} fill sizes="(min-width: 1200px) 760px, 100vw" className={styles.figureImage} />
          </div>
          {(block.caption || block.credit) && (
            <figcaption className={`mono ${styles.figureCaption}`}>
              {block.caption}
              {block.credit && <span> · {block.credit}</span>}
            </figcaption>
          )}
        </figure>
      );
    case "video":
      return (
        <figure className={styles.figure}>
          <VideoPlayer video={block.video} title={block.caption ?? ""} size="inline" />
          {block.caption && <figcaption className={`mono ${styles.figureCaption}`}>{block.caption}</figcaption>}
        </figure>
      );
    case "keyPoints":
      return (
        <section className={styles.keyPoints}>
          <div className={`mono ${styles.blockLabel}`}>{block.title ?? t("keyPoints")}</div>
          <ul>
            {block.items.map((item, i) => (
              <li key={i}>
                <RichTextView text={item} />
              </li>
            ))}
          </ul>
        </section>
      );
    case "glossary":
      return (
        <dl className={styles.glossary}>
          {block.items.map((item, i) => (
            <div key={i}>
              <dt>{item.term}</dt>
              <dd className={styles.muted}>
                <RichTextView text={item.definition} />
              </dd>
            </div>
          ))}
        </dl>
      );
    case "divider":
      return block.variant === "ornament" ? (
        <div className={styles.ornament} role="separator">
          ✦ ✦ ✦
        </div>
      ) : (
        <hr className={`${styles.divider} ${block.variant === "short" ? styles.dividerShort : ""}`} />
      );
    case "spoiler":
      return (
        <Spoiler>
          <RichTextView text={block.text} />
        </Spoiler>
      );
  }
}
