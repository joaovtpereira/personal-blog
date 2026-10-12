import { useTranslations } from "next-intl";
import { collectionStatus, type Collection } from "@/domain/entities";
import { Link } from "@/main/i18n/navigation";
import { ROUTES } from "@/main/routes";
import { CollectionStack } from "@/presentation/components/CollectionStack";
import { ShareButton } from "@/presentation/components/ShareButton";
import { PageHeader } from "@/presentation/contexts/PageHeaderContext";
import { CollectionItems } from "./sections/CollectionItems";
import { CollectionProgressPanel } from "./sections/CollectionProgressPanel";
import styles from "./CollectionScreen.module.css";

/**
 * Coleção de estudos ou série de resenhas.
 * Celular: capa → progresso → itens em trilha · Tablet: capa | card de progresso, itens em grade ·
 * Desktop: capa e progresso fixos à esquerda, itens em trilha à direita.
 */
export function CollectionScreen({ collection }: { collection: Collection }) {
  const t = useTranslations("Collection");
  const back = collection.kind === "studies" ? ROUTES.studies : ROUTES.blog;
  const share = { title: collection.name, label: t("share"), ariaLabel: t("shareAria"), copiedLabel: t("copied") };

  return (
    <main id="conteudo">
      <PageHeader
        crumb={t("crumb")}
        backHref={back}
        backLabel={t(`back.${collection.kind}`)}
        section={collection.kind === "studies" ? "studies" : "blog"}
        action={<ShareButton {...share} variant="round" />}
      />

      <div className={`wrap ${styles.backRow}`}>
        <Link href={back} className={`ul rise ${styles.back}`}>
          ← {t(`back.${collection.kind}`)}
        </Link>
      </div>

      <div className={`wrap ${styles.layout}`}>
        <aside className={styles.aside}>
          <section className={styles.hero} aria-labelledby="collection-title">
            <div className="rise d1">
              <CollectionStack count={collection.entries.length} />
            </div>
            <div className={`rise d2 mono ${styles.badges}`}>
              <span className={styles.badge}>{t("badge", { kind: t(`kind.${collection.kind}`) })}</span>
              <span className={styles.status}>{t(`status.${collectionStatus(collection)}`)}</span>
              <ShareButton {...share} className={styles.share} />
            </div>
            <h1 id="collection-title" className={`rise d3 ${styles.title}`}>
              {collection.name}
            </h1>
            <p className={`rise d4 ${styles.description}`}>{collection.description}</p>
          </section>
          <div className={`rise d5 ${styles.progress}`}>
            <CollectionProgressPanel collection={collection} />
          </div>
        </aside>

        <div className={styles.items}>
          <CollectionItems collection={collection} />
        </div>
      </div>
    </main>
  );
}
