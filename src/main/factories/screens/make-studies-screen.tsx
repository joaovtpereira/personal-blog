import type { Locale } from "@/domain/entities";
import { StudiesScreen } from "@/presentation/screens/studies";
import { makeGetStudies } from "../use-cases/use-cases";

export async function makeStudiesScreen(locale: Locale) {
  const studies = await makeGetStudies().execute({ locale });
  return <StudiesScreen studies={studies} />;
}
