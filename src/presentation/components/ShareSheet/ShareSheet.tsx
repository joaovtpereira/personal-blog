"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useEffect, useId, useRef, useState, type MouseEvent, type ReactNode } from "react";
import type { ShareTarget } from "@/domain/entities";
import { useShare } from "@/presentation/contexts/ShareContext";
import { Icon, type IconName } from "../Icon";
import { SegmentedTabs, panelId, tabId } from "../SegmentedTabs";
import styles from "./ShareSheet.module.css";

type Tab = "image" | "link";
type Status = "preparing" | "downloaded" | "shared" | "failed" | "copied" | null;

type ShareSheetProps = {
  target: ShareTarget;
  open: boolean;
  onClose: () => void;
};

/**
 * Painel de compartilhar: imagem para story (Instagram, Facebook, WhatsApp) ou link.
 * Celular/tablet: folha que sobe da base · desktop: modal com a prévia ao lado.
 */
export function ShareSheet({ target, open, onClose }: ShareSheetProps) {
  const t = useTranslations("Share");
  const tPost = useTranslations("Post");
  const tLesson = useTranslations("Lesson");
  const { shareImage, downloadImage, shareLink, copyLink, getLinks } = useShare();
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const tabsId = useId();
  const [tab, setTab] = useState<Tab>("image");
  const [status, setStatus] = useState<Status>(null);
  const [busy, setBusy] = useState(false);
  const statusTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    if (open && !element.open) {
      element.showModal();
      document.documentElement.style.overflow = "hidden";
    }
    if (!open && element.open) element.close();
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  useEffect(() => () => clearTimeout(statusTimer.current), []);

  const flash = (next: Status) => {
    setStatus(next);
    clearTimeout(statusTimer.current);
    if (next && next !== "preparing") statusTimer.current = setTimeout(() => setStatus(null), 4000);
  };

  const image = { imageUrl: target.storyImage, fileName: target.imageFileName, title: target.title };
  const links = getLinks.execute({ url: target.url, title: target.title });
  const kindLabel = target.kind === "lesson" ? tLesson("badge") : tPost(`kind.${target.kind}`);

  const sendImage = async () => {
    if (busy) return;
    setBusy(true);
    flash("preparing");
    const result = await shareImage.execute(image);
    setBusy(false);
    flash(result === "cancelled" ? null : result);
  };

  const saveImage = async () => {
    if (busy) return;
    setBusy(true);
    flash("preparing");
    const ok = await downloadImage.execute(image);
    setBusy(false);
    flash(ok ? "downloaded" : "failed");
  };

  const copy = async () => flash((await copyLink.execute({ url: target.url })) ? "copied" : "failed");

  const more = async () => {
    const result = await shareLink.execute({ url: target.url, title: target.title });
    flash(result === "copied" ? "copied" : result === "failed" ? "failed" : null);
  };

  /** Clique no fundo (fora do painel) fecha. */
  const onBackdrop = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === event.currentTarget) onClose();
  };

  const copied = status === "copied";

  return (
    <dialog ref={dialog} className={styles.dialog} aria-labelledby={titleId} onClose={onClose} onCancel={onClose} onClick={onBackdrop}>
      <div className={styles.panel}>
        <span className={styles.handle} aria-hidden="true" />

        <header className={styles.head}>
          <div className={styles.headText}>
            <p className={`mono ${styles.kind}`}>{kindLabel}</p>
            <h2 id={titleId} className={styles.title}>
              {t("title")} <span className={`serif ${styles.titleAccent}`}>{t(`heading.${target.kind}`)}</span>
            </h2>
            <p className={styles.postTitle}>{target.title}</p>
          </div>
          <button type="button" className={styles.close} aria-label={t("close")} onClick={onClose}>
            <Icon name="close" />
          </button>
        </header>

        <SegmentedTabs
          className={styles.tabs}
          idPrefix={tabsId}
          label={t("formatLabel")}
          value={tab}
          onChange={setTab}
          tabs={[
            { id: "image", label: t("tabs.image") },
            { id: "link", label: t("tabs.link") },
          ]}
        />

        <div className={styles.preview}>
          {tab === "image" ? (
            <figure className={`${styles.figure} ${styles.swap}`} key="image">
              <div className={styles.story}>
                <Image src={target.storyImage} alt={t("storyAlt", { title: target.title })} width={1080} height={1920} unoptimized />
              </div>
              <figcaption className="mono">{t("storySize")}</figcaption>
            </figure>
          ) : (
            <figure className={`${styles.figure} ${styles.swap}`} key="link">
              <div className={styles.linkCard}>
                <Image src={target.linkImage} alt={t("linkAlt", { title: target.title })} width={1200} height={630} unoptimized />
                <div className={styles.linkMeta}>
                  <span className={`mono ${styles.linkHost}`}>{target.host.toUpperCase()}</span>
                  <strong>{target.title}</strong>
                  <span className={styles.linkSummary}>{target.summary}</span>
                </div>
              </div>
              <figcaption className={`mono ${styles.desktopOnly}`}>{t("linkPreviewNote")}</figcaption>
            </figure>
          )}
        </div>

        <div className={styles.actions} id={panelId(tabsId, tab)} role="tabpanel" aria-labelledby={tabId(tabsId, tab)}>
          {tab === "image" ? (
            <>
              <div className={`${styles.destinations} ${styles.compactOnly}`}>
                <Destination icon="instagram" label={t("networks.instagram")} onClick={sendImage} disabled={busy} />
                <Destination icon="facebook" label={t("networks.facebook")} onClick={sendImage} disabled={busy} />
                <Destination icon="whatsapp" label={t("networks.whatsapp")} onClick={sendImage} disabled={busy} />
                <Destination icon="download" label={t("networks.download")} onClick={saveImage} disabled={busy} primary />
              </div>

              <div className={`${styles.rows} ${styles.desktopOnly}`}>
                {(["instagram", "facebook", "whatsapp"] as const).map((network) => (
                  <button key={network} type="button" className={styles.row} onClick={sendImage} disabled={busy}>
                    <Icon name={network} size={24} />
                    <span className={styles.rowText}>
                      <span>{t(`rows.${network}.title`)}</span>
                      <span className={styles.rowHint}>{t(`rows.${network}.hint`)}</span>
                    </span>
                    <Icon name="arrowUpRight" className={styles.rowArrow} />
                  </button>
                ))}
              </div>
              <div className={`${styles.footer} ${styles.desktopOnly}`}>
                <button type="button" className={styles.primary} onClick={saveImage} disabled={busy}>
                  <Icon name="download" />
                  {t("downloadPng")}
                </button>
                <button type="button" className={styles.secondary} onClick={copy}>
                  {copied ? t("linkCopied") : t("copyLink")}
                </button>
              </div>
            </>
          ) : (
            <>
              <div className={styles.copyField}>
                <label className={`mono ${styles.copyLabel} ${styles.desktopOnly}`} htmlFor={`${tabsId}-url`}>
                  {t(`linkLabel.${target.kind === "lesson" ? "lesson" : "post"}`)}
                </label>
                <div className={styles.copyBox}>
                  <input id={`${tabsId}-url`} className="mono" readOnly value={target.url} onFocus={(event) => event.currentTarget.select()} />
                  <button type="button" className={styles.copyButton} onClick={copy}>
                    {copied ? t("copied") : t("copy")}
                  </button>
                </div>
              </div>
              <div className={styles.networks}>
                <NetworkLink href={links.whatsapp} icon="whatsapp" label={t("networks.whatsapp")} />
                <NetworkLink href={links.facebook} icon="facebook" label={t("networks.facebook")} />
                <button type="button" className={`${styles.network} ${styles.compactOnly}`} onClick={more}>
                  <Icon name="share" />
                  {t("networks.more")}
                </button>
                <NetworkLink href={links.email} icon="mail" label={t("networks.email")} className={styles.desktopOnly} external={false} />
              </div>
              <p className={`${styles.hint} ${styles.desktopOnly}`}>{t("linkHint")}</p>
            </>
          )}
          <p className={styles.status} aria-live="polite">
            {status ? t(`status.${status}`) : ""}
          </p>
        </div>
      </div>
    </dialog>
  );
}

function Destination({
  icon,
  label,
  onClick,
  disabled,
  primary,
}: {
  icon: IconName;
  label: string;
  onClick: () => void;
  disabled: boolean;
  primary?: boolean;
}) {
  return (
    <button type="button" className={styles.destination} onClick={onClick} disabled={disabled}>
      <span className={`${styles.ring} ${primary ? styles.ringPrimary : ""}`}>
        <Icon name={icon} size={22} />
      </span>
      {label}
    </button>
  );
}

function NetworkLink({
  href,
  icon,
  label,
  className,
  external = true,
}: {
  href: string;
  icon: IconName;
  label: ReactNode;
  className?: string;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      className={`${styles.network} ${className ?? ""}`}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      <Icon name={icon} />
      {label}
    </a>
  );
}
