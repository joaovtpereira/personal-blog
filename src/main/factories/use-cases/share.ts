import {
  BrowserDownloadImage,
  ClipboardCopyLink,
  NativeShareImage,
  NativeShareLink,
  SocialShareLinks,
} from "@/data/use-cases/web-share";
import type { CopyLink, DownloadImage, GetShareLinks, ShareImage, ShareLink } from "@/domain/use-cases";
import { AnchorFileDownloader, BrowserNativeShare, FetchBlobFetcher, NavigatorClipboard } from "@/infra/share";

/* Só no cliente: usam navigator.share, área de transferência e download do navegador. */

export const makeShareImage = (): ShareImage =>
  new NativeShareImage(new FetchBlobFetcher(), new BrowserNativeShare(), new AnchorFileDownloader());

export const makeDownloadImage = (): DownloadImage =>
  new BrowserDownloadImage(new FetchBlobFetcher(), new AnchorFileDownloader());

export const makeShareLink = (): ShareLink => new NativeShareLink(new BrowserNativeShare(), new NavigatorClipboard());

export const makeCopyLink = (): CopyLink => new ClipboardCopyLink(new NavigatorClipboard());

export const makeGetShareLinks = (): GetShareLinks => new SocialShareLinks();
