import { ROUTES, SECTIONS } from "@/main/routes";
import type { IconName } from "./components/Icon";

export type NavHref = string | { pathname: "/"; hash: string };

export type NavItem = {
  key: "home" | "blog" | "studies" | "projects" | "resume" | "contact";
  href: NavHref;
  icon: IconName;
  /** Onde o item aparece no cabeçalho de tablet e desktop. */
  header: "tablet" | "desktop" | "both";
};

/** Ordem do menu principal (celular), do cabeçalho e da navegação inferior. */
export const NAV_ITEMS: NavItem[] = [
  { key: "home", href: ROUTES.home, icon: "home", header: "tablet" },
  { key: "resume", href: ROUTES.resume, icon: "user", header: "both" },
  { key: "blog", href: ROUTES.blog, icon: "doc", header: "both" },
  { key: "studies", href: ROUTES.studies, icon: "book", header: "both" },
  { key: "projects", href: { pathname: "/", hash: SECTIONS.projects }, icon: "code", header: "both" },
  { key: "contact", href: ROUTES.contact, icon: "mail", header: "desktop" },
];

/** Ordem do cabeçalho de tablet/desktop (Blog primeiro, como no canvas). */
export const HEADER_ORDER: NavItem["key"][] = ["home", "blog", "studies", "projects", "resume", "contact"];

export const BOTTOM_NAV_KEYS: NavItem["key"][] = ["home", "blog", "studies", "resume", "contact"];

export const isActive = (item: NavItem, pathname: string): boolean =>
  typeof item.href === "string" &&
  (item.href === "/" ? pathname === "/" : pathname === item.href || pathname.startsWith(`${item.href}/`));
