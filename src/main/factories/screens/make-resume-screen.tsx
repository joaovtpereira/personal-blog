import type { Locale } from "@/domain/entities";
import { ResumeScreen } from "@/presentation/screens/resume";
import { makeGetResume } from "../use-cases/use-cases";

export async function makeResumeScreen(locale: Locale) {
  const resume = await makeGetResume().execute({ locale });
  return <ResumeScreen resume={resume} />;
}
