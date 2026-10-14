"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { CopyLink, DownloadImage, GetShareLinks, ShareImage, ShareLink } from "@/domain/use-cases";

type Value = {
  shareImage: ShareImage;
  downloadImage: DownloadImage;
  shareLink: ShareLink;
  copyLink: CopyLink;
  getLinks: GetShareLinks;
};

const ShareContext = createContext<Value | null>(null);

/** Casos de uso de compartilhamento injetados pelo main/. */
export function ShareProvider({ children, ...value }: Value & { children: ReactNode }) {
  return <ShareContext.Provider value={value}>{children}</ShareContext.Provider>;
}

export function useShare(): Value {
  const value = useContext(ShareContext);
  if (!value) throw new Error("useShare precisa do ShareProvider (main/providers/AppShareProvider).");
  return value;
}
