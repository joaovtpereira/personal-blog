import { Fragment } from "react";
import type { InlineNode, RichText } from "@/domain/entities";
import styles from "./Content.module.css";

function renderNode(node: InlineNode, key: number) {
  if (node.type === "link") {
    const external = /^https?:\/\//.test(node.href);
    return (
      <a
        key={key}
        href={node.href}
        className={`ul ${styles.link}`}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {node.children.map(renderNode)}
      </a>
    );
  }
  let content: React.ReactNode = node.text;
  if (node.marks.includes("code")) content = <code className={styles.inlineCode}>{content}</code>;
  if (node.marks.includes("italic")) content = <em>{content}</em>;
  if (node.marks.includes("bold")) content = <strong>{content}</strong>;
  return <Fragment key={key}>{content}</Fragment>;
}

/** Renderiza texto com formatação inline (negrito, itálico, código, links). */
export function RichTextView({ text }: { text: RichText }) {
  return <>{text.map(renderNode)}</>;
}
