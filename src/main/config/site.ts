/**
 * Endereço público do site, usado nos links compartilhados e nas prévias (Open Graph).
 * Defina NEXT_PUBLIC_SITE_URL no .env (ex.: https://joaovitorpereira.com).
 */
export const SITE_URL = new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000");

export const absoluteUrl = (path: string): string => new URL(path, SITE_URL).toString();
