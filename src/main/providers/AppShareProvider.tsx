"use client";

import { useState, type ReactNode } from "react";
import { ShareProvider } from "@/presentation/contexts/ShareContext";
import { makeCopyLink, makeDownloadImage, makeGetShareLinks, makeShareImage, makeShareLink } from "../factories/use-cases/share";

/** Composição no cliente: compartilhar pelo menu nativo, copiar e baixar. */
export function AppShareProvider({ children }: { children: ReactNode }) {
  const [useCases] = useState(() => ({
    shareImage: makeShareImage(),
    downloadImage: makeDownloadImage(),
    shareLink: makeShareLink(),
    copyLink: makeCopyLink(),
    getLinks: makeGetShareLinks(),
  }));
  return <ShareProvider {...useCases}>{children}</ShareProvider>;
}
