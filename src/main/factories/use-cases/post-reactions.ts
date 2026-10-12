import {
  CachedGetPostReactionChoices,
  CachedSetPostReactionChoice,
  CachedWatchPostReactionChoices,
} from "@/data/use-cases/cached-post-reactions";
import type { GetPostReactionChoices, SetPostReactionChoice, WatchPostReactionChoices } from "@/domain/use-cases";
import { makeBrowserCache } from "../infra/cache";

/* Só no cliente: a reação do visitante fica no navegador. */

export const makeGetPostReactionChoices = (): GetPostReactionChoices => new CachedGetPostReactionChoices(makeBrowserCache());

export const makeSetPostReactionChoice = (): SetPostReactionChoice => new CachedSetPostReactionChoice(makeBrowserCache());

export const makeWatchPostReactionChoices = (): WatchPostReactionChoices =>
  new CachedWatchPostReactionChoices(makeBrowserCache());
