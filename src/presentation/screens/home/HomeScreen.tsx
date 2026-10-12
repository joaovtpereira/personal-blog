import { useTranslations } from "next-intl";
import type { Post, Project, Study } from "@/domain/entities";
import { Marquee } from "@/presentation/components/Marquee";
import { ContactSection } from "./sections/ContactSection";
import { HeroSection } from "./sections/HeroSection";
import { LatestPostsSection } from "./sections/LatestPostsSection";
import { ProjectsSection } from "./sections/ProjectsSection";
import { ShortcutsSection } from "./sections/ShortcutsSection";
import { StudiesSection } from "./sections/StudiesSection";

export type HomeScreenProps = {
  posts: Post[];
  studies: Study[];
  projects: Project[];
};

export function HomeScreen({ posts, studies, projects }: HomeScreenProps) {
  const t = useTranslations("Home");

  return (
    <main id="conteudo">
      <HeroSection />
      <Marquee items={t.raw("marquee") as string[]} />
      <ShortcutsSection />
      <ProjectsSection projects={projects} />
      <StudiesSection studies={studies} />
      <LatestPostsSection posts={posts} />
      <ContactSection />
    </main>
  );
}
