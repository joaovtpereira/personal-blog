/** Rotas do site (o prefixo de idioma é adicionado pelo Link do next-intl). */
export const ROUTES = {
  home: "/",
  blog: "/blog",
  post: (slug: string) => `/blog/${slug}`,
  studies: "/estudos",
  study: (slug: string) => `/estudos/${slug}`,
  resume: "/curriculo",
  contact: "/contato",
} as const;

export const SECTIONS = {
  projects: "projetos",
  studies: "estudos",
  contact: "contato",
} as const;

export const EXTERNAL = {
  linkedin: "https://www.linkedin.com/in/joaovtpereira",
  email: "joaovitorpessoal2@gmail.com",
  byteKickStudio: "https://bytekickstudio.com",
  fotSquad: "https://fotsquad.com",
} as const;
