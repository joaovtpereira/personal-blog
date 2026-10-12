/** Formato externo (markdown/API). Não usar na camada de apresentação. */
export type ProjectModel = {
  id: string;
  locale: string;
  type: "empresa" | "app";
  name: string;
  name_accent?: string | null;
  description: string;
  url: string;
  platforms?: string[];
  cover_image?: string | null;
  icon_image?: string | null;
  order: number;
};
