import { useTranslations } from "next-intl";
import { isCollection, type CollectionItem, type StudyCollectionPosition } from "@/domain/entities";
import { Link } from "@/main/i18n/navigation";
import { ROUTES } from "@/main/routes";
import { Icon } from "../Icon";
import styles from "./CollectionNav.module.css";

/**
 * Navegação de coleção de estudos.
 * Celular: segmentos + anterior/próximo · Tablet: anterior/atual/próximo · Desktop: resumo + 3 cards.
 * Regra de negócio: com 1 item não é coleção — não renderiza.
 */
export function CollectionNav({ collection }: { collection: StudyCollectionPosition | null }) {
  const t = useTranslations("Lesson.collection");
  if (!collection || !isCollection(collection.total)) return null;

  const card = (item: CollectionItem | null, direction: "previous" | "next") =>
    item ? (
      <Link href={ROUTES.study(item.slug)} className={`${styles.card} ${styles[direction]}`}>
        <span className={`mono ${styles.cardLabel}`}>{t(direction, { position: item.position })}</span>
        <span className={styles.cardTitle}>{item.title}</span>
      </Link>
    ) : (
      <span className={`${styles.card} ${styles.empty} ${styles[direction]}`} aria-hidden="true" />
    );

  return (
    <nav aria-label={t("aria")} className={styles.nav}>
      <div className={styles.info}>
        <div className={styles.heading}>
          <span className={styles.icon} aria-hidden="true">
            <Icon name="book" size={18} />
          </span>
          <div className={styles.name}>
            <div className={`mono ${styles.kicker}`}>{t("label")}</div>
            <div className={styles.title}>{collection.name}</div>
          </div>
          <span className={`mono ${styles.position}`}>
            {t("position", { position: collection.position, total: collection.total })}
          </span>
        </div>
        <Link href={ROUTES.collection(collection.slug)} className={`${styles.seeAll} ${styles.seeAllDesktop}`}>
          {t("seeAll")}
        </Link>
      </div>

      <div
        className={styles.segments}
        aria-hidden="true"
        style={{ gridTemplateColumns: `repeat(${collection.total}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: collection.total }, (_, i) => (
          <span key={i} className={styles.segment}>
            <span
              className={`${styles.segmentFill} ${i + 1 < collection.position ? styles.past : i + 1 === collection.position ? styles.here : ""}`}
              style={{ animationDelay: `${0.3 + i * 0.08}s` }}
            />
          </span>
        ))}
      </div>

      <div className={styles.cards}>
        {card(collection.previous, "previous")}
        <div className={`${styles.card} ${styles.currentCard}`} aria-current="page">
          <span className={`mono ${styles.cardLabel}`}>{t("here", { position: collection.position })}</span>
          <span className={styles.cardTitle}>{collection.current.title}</span>
          <span className={styles.currentBar} aria-hidden="true">
            <span />
          </span>
        </div>
        {card(collection.next, "next")}
      </div>

      <Link href={ROUTES.collection(collection.slug)} className={`${styles.seeAll} ${styles.seeAllMobile}`}>
        {t("seeAll")} <span className={`mono ${styles.count}`}>{t("seeAllCount", { total: collection.total })}</span>
      </Link>
    </nav>
  );
}
