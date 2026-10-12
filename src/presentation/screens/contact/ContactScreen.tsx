import { useTranslations } from "next-intl";
import { Marquee } from "@/presentation/components/Marquee";
import type { ContactFormAction } from "./contact-form-state";
import { ContactForm } from "./sections/ContactForm";
import { ContactIntro } from "./sections/ContactIntro";
import { DirectContact } from "./sections/DirectContact";
import styles from "./ContactScreen.module.css";

export type ContactScreenProps = {
  sendAction: ContactFormAction;
};

/**
 * Celular: título → formulário → contato direto.
 * Tablet/desktop: título e contato direto à esquerda, formulário em card à direita.
 */
export function ContactScreen({ sendAction }: ContactScreenProps) {
  const t = useTranslations("Contact");

  return (
    <main id="conteudo">
      <section className={`wrap ${styles.layout}`}>
        <div className={styles.intro}>
          <ContactIntro />
        </div>
        <div className={`rise d4 ${styles.form}`}>
          <ContactForm action={sendAction} />
        </div>
        <div className={styles.direct}>
          <DirectContact />
        </div>
      </section>
      <Marquee items={t.raw("marquee") as string[]} className={styles.marquee} />
    </main>
  );
}
