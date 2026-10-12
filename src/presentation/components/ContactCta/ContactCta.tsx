import type { ReactNode } from "react";
import { Link } from "@/main/i18n/navigation";
import { EXTERNAL, ROUTES } from "@/main/routes";
import { ButtonLink } from "../ButtonLink";
import { Icon } from "../Icon";
import styles from "./ContactCta.module.css";

type ContactCtaProps = {
  tag: string;
  title: ReactNode;
  description: string;
  shortDescription: string;
  formLabel: string;
};

/**
 * Celular/tablet: card invertido que leva à página de contato.
 * Desktop: bloco invertido com e-mail, LinkedIn e link para o formulário.
 */
export function ContactCta({ tag, title, description, shortDescription, formLabel }: ContactCtaProps) {
  return (
    <>
      <Link href={ROUTES.contact} className={`lift ${styles.compact}`}>
        <div>
          <div className={`mono ${styles.tag}`}>{tag}</div>
          <div className={styles.title}>{title}</div>
        </div>
        <div className={styles.compactFoot}>
          <span className={styles.short}>{shortDescription}</span>
          <span className={styles.circle}>
            <Icon name="arrowUpRight" size={22} className="arrow" />
          </span>
        </div>
      </Link>

      <div className={styles.full}>
        <div>
          <div className={`mono ${styles.tag}`}>{tag}</div>
          <div className={styles.title}>{title}</div>
        </div>
        <div className={styles.actions}>
          <p className={styles.description}>{description}</p>
          <ButtonLink href={`mailto:${EXTERNAL.email}`} external variant="inverse" size="l">
            {EXTERNAL.email}
            <Icon name="arrowUpRight" size={20} />
          </ButtonLink>
          <ButtonLink href={EXTERNAL.linkedin} external variant="inverseGhost" size="l">
            LinkedIn
            <Icon name="arrowUpRight" size={20} />
          </ButtonLink>
          <Link href={ROUTES.contact} className={`ul ${styles.form}`}>
            {formLabel} →
          </Link>
        </div>
      </div>
    </>
  );
}
