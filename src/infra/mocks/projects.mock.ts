import type { ProjectModel } from "@/domain/models";

const COMPANY = {
  pt: "Estúdio que fundei com Hugo Santos. Criamos produtos digitais — o primeiro deles é o FotSquad.",
  es: "Estudio que fundé con Hugo Santos. Creamos productos digitales — el primero es FotSquad.",
  en: "A studio I co-founded with Hugo Santos. We build digital products — the first one is FotSquad.",
};
const APP = {
  pt: "App para organizar o futebol com os amigos — times, partidas e estatísticas.",
  es: "App para organizar el fútbol con amigos — equipos, partidos y estadísticas.",
  en: "An app to organize football with friends — teams, matches and stats.",
};

export const PROJECTS_MOCK: ProjectModel[] = (["pt", "es", "en"] as const).flatMap((locale) => [
  {
    id: "bytekickstudio",
    locale,
    type: "empresa",
    name: "ByteKick",
    name_accent: "Studio",
    description: COMPANY[locale],
    url: "https://bytekickstudio.com",
    order: 1,
  },
  {
    id: "fotsquad",
    locale,
    type: "app",
    name: "FotSquad",
    description: APP[locale],
    url: "https://fotsquad.com",
    platforms: ["iOS", "Android", "watchOS", "Wear OS"],
    cover_image: "/images/fotsquad-screen.jpg",
    icon_image: "/images/fotsquad-icon.png",
    order: 2,
  },
]);
