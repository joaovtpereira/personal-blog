import type { ReactNode } from "react";
import { Link } from "@/main/i18n/navigation";
import styles from "./ButtonLink.module.css";

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "ghost" | "inverse" | "inverseGhost";
  size?: "m" | "l";
  /** Link externo (http, mailto) — não recebe prefixo de idioma. */
  external?: boolean;
  className?: string;
};

export function ButtonLink({ href, children, variant = "primary", size = "m", external, className }: ButtonLinkProps) {
  const cls = [styles.button, styles[variant], styles[size], className ?? ""].join(" ");
  if (external) {
    const isHttp = href.startsWith("http");
    return (
      <a className={cls} href={href} {...(isHttp ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
        {children}
      </a>
    );
  }
  return (
    <Link className={cls} href={href}>
      {children}
    </Link>
  );
}
