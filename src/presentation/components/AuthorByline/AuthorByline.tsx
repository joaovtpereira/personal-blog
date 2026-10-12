import Image from "next/image";
import styles from "./AuthorByline.module.css";

/** Foto redonda + nome + linha em mono (tags, data...). */
export function AuthorByline({ name, meta, avatar = "/images/portrait.webp" }: { name: string; meta?: string; avatar?: string }) {
  return (
    <div className={styles.byline}>
      <Image src={avatar} alt="" width={36} height={36} className={styles.avatar} />
      <div className={styles.text}>
        <div className={styles.name}>{name}</div>
        {meta && <div className={`mono ${styles.meta}`}>{meta}</div>}
      </div>
    </div>
  );
}
