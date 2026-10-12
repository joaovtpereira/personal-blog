import { useTranslations } from "next-intl";
import { projectFullName, type Project } from "@/domain/entities";
import { ROUTES, SECTIONS } from "@/main/routes";
import { AppCard, CompanyCard, TileCard } from "@/presentation/components/ProjectCard";
import { SectionHeader } from "@/presentation/components/SectionHeader";
import { richTags } from "@/presentation/i18n/rich";
import styles from "./ProjectsSection.module.css";

export function ProjectsSection({ projects }: { projects: Project[] }) {
  const t = useTranslations("Home.projects");
  const tc = useTranslations("Common");
  const company = projects.find((project) => project.kind === "company");
  const apps = projects.filter((project) => project.kind === "app");

  return (
    <section id={SECTIONS.projects} className={`wrap ${styles.section}`} aria-labelledby="projects-title">
      <SectionHeader
        id="projects-title"
        title={t.rich("title", richTags)}
        aside={<span className={`mono ${styles.index}`}>{t("index")}</span>}
      />
      <div className={styles.grid}>
        {company && <CompanyCard project={company} label={t("company")} />}
        {apps.map((app) => (
          <AppCard
            key={app.id}
            project={app}
            label={t("app")}
            screenAlt={t("appScreenAlt", { name: projectFullName(app) })}
          />
        ))}
        <div className={styles.tiles}>
          <TileCard
            className={styles.resume}
            title={tc("resume")}
            description={t("resumeDesc")}
            href={ROUTES.resume}
          />
          <TileCard title={t("soon")} placeholderTag={t("soonTag")} />
        </div>
      </div>
    </section>
  );
}
