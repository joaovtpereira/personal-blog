import type { Locale } from "@/domain/entities";
import { HomeScreen } from "@/presentation/screens/home";
import { makeGetFeaturedStudies, makeGetLatestPosts, makeGetProjects } from "../use-cases/use-cases";

/** Quantos posts recentes a home carrega para o filtro por categoria funcionar no cliente. */
const LATEST_POSTS_LIMIT = 12;
const FEATURED_STUDIES_LIMIT = 3;

export async function makeHomeScreen(locale: Locale) {
  const [posts, studies, projects] = await Promise.all([
    makeGetLatestPosts().execute({ locale, limit: LATEST_POSTS_LIMIT }),
    makeGetFeaturedStudies().execute({ locale, limit: FEATURED_STUDIES_LIMIT }),
    makeGetProjects().execute({ locale }),
  ]);

  return <HomeScreen posts={posts} studies={studies} projects={projects} />;
}
