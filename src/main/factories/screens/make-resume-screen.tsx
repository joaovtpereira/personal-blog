import type { Locale } from "@/domain/entities";
import { currentYear } from "@/main/cache/clock";
import { ResumeScreen } from "@/presentation/screens/resume";
import { makeGetResume } from "../use-cases/use-cases";

export async function makeResumeScreen(locale: Locale) {
  const [resume, year] = await Promise.all([makeGetResume().execute({ locale }), currentYear()]);
  return <ResumeScreen resume={resume} currentYear={year} />;
}
