import type { AnchorHTMLAttributes } from "react";

type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & { href: string };

/**
 * Adaptador do Link do blog. No editor os links só aparecem na pré-visualização,
 * então não navegam (o app não tem as páginas do site).
 */
export function Link({ onClick, ...rest }: LinkProps) {
  return (
    <a
      {...rest}
      onClick={(event) => {
        event.preventDefault();
        onClick?.(event);
      }}
    />
  );
}
