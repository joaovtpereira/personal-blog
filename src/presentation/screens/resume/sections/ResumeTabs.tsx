"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { isCurrentExperience, type Resume } from "@/domain/entities";
import { SegmentedTabs, panelId, tabId } from "@/presentation/components/SegmentedTabs";
import { Timeline, TimelineItem } from "@/presentation/components/Timeline";
import { useResumePeriod } from "../use-resume-period";
import { EducationCard } from "./EducationCard";
import styles from "./ResumeTabs.module.css";

type TabKey = "experience" | "education" | "stack";

const TABS: TabKey[] = ["experience", "education", "stack"];
const ID = "resume";

type ResumeTabsProps = Pick<Resume, "experiences" | "education" | "skills">;

export function ResumeTabs({ experiences, education, skills }: ResumeTabsProps) {
  const t = useTranslations("Resume");
  const period = useResumePeriod();
  const [tab, setTab] = useState<TabKey>("experience");

  return (
    <div>
      <SegmentedTabs
        idPrefix={ID}
        label={t("tabs.label")}
        value={tab}
        onChange={setTab}
        tabs={TABS.map((id) => ({ id, label: t(`tabs.${id}`) }))}
        className={styles.tabs}
      />

      <div
        key={tab}
        id={panelId(ID, tab)}
        role="tabpanel"
        aria-labelledby={tabId(ID, tab)}
        tabIndex={0}
        className={styles.panel}
      >
        {tab === "experience" && (
          <Timeline>
            {experiences.map((experience, i) => (
              <TimelineItem
                key={experience.id}
                when={period(experience)}
                title={experience.role}
                subtitle={experience.organization}
                description={experience.description}
                current={isCurrentExperience(experience)}
                currentLabel={t("current")}
                delay={i * 0.1}
              />
            ))}
          </Timeline>
        )}

        {tab === "education" && (
          <div className={styles.cards}>
            {education.map((item, i) => (
              <EducationCard key={item.id} education={item} delay={i * 0.1} />
            ))}
          </div>
        )}

        {tab === "stack" && (
          <ul className={styles.skills}>
            {skills.map((group, i) => (
              <li key={group.id} className={styles.skill} style={{ animationDelay: `${i * 0.08}s` }}>
                <div className={`mono ${styles.skillLabel}`}>{group.label}</div>
                <div className={styles.skillItems}>{group.items.join(" · ")}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
