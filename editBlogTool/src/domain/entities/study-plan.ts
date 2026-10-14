import type { EditorCatalog } from "./catalog";
import { slugify } from "./content-location";
import type { StudyChoice } from "./draft";

export type StudyTarget = { id: string | null; slug: string; title: string; existingLessons: number };

/** Estudo onde as aulas serão gravadas; null = ainda não escolhido. */
export function studyTarget(choice: StudyChoice, catalog: EditorCatalog): StudyTarget | null {
  if (choice.mode === "existing") {
    const study = catalog.studies.find((s) => s.id === choice.studyId);
    return study ? { id: study.id, slug: study.slug, title: study.title, existingLessons: study.lessonCount } : null;
  }
  if (choice.mode === "opened" && choice.opened) {
    return { ...choice.opened, existingLessons: 0 };
  }
  if (choice.mode === "new") {
    const title = choice.newStudyName.trim();
    return title ? { id: null, slug: slugify(title), title, existingLessons: 0 } : null;
  }
  return null;
}
