import { useTranslations } from "next-intl";
import type { Study } from "@/domain/entities";
import { Link } from "@/main/i18n/navigation";
import { ROUTES, SECTIONS } from "@/main/routes";
import { SectionHeader } from "@/presentation/components/SectionHeader";
import { StudyCard } from "@/presentation/components/StudyCard";
import { richTags } from "@/presentation/i18n/rich";
import styles from "./StudiesSection.module.css";

export function StudiesSection({ studies }: { studies: Study[] }) {
  const t = useTranslations("Home.studies");

  if (studies.length === 0) return null;

  return (
    <section id={SECTIONS.studies} className={styles.section} aria-labelledby="studies-title">
      <div className="wrap">
        <SectionHeader
          id="studies-title"
          title={t.rich("title", richTags)}
          description={t("description")}
          aside={
            <Link href={ROUTES.studies} className="ul">
              {t("seeAll")} →
            </Link>
          }
        />
      </div>
      <ul className={`wrap ${styles.list}`}>
        {studies.map((study, i) => (
          <li key={study.id} className={styles.item}>
            <StudyCard study={study} index={i} />
          </li>
        ))}
      </ul>
    </section>
  );
}
