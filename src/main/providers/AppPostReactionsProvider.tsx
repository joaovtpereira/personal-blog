"use client";

import { useState, type ReactNode } from "react";
import { PostReactionsProvider } from "@/presentation/contexts/PostReactionsContext";
import {
  makeGetPostReactionChoices,
  makeSetPostReactionChoice,
  makeWatchPostReactionChoices,
} from "../factories/use-cases/post-reactions";

/** Composição no cliente: reações do visitante guardadas no navegador. */
export function AppPostReactionsProvider({ children }: { children: ReactNode }) {
  const [useCases] = useState(() => ({
    getChoices: makeGetPostReactionChoices(),
    setChoice: makeSetPostReactionChoice(),
    watch: makeWatchPostReactionChoices(),
  }));
  return <PostReactionsProvider {...useCases}>{children}</PostReactionsProvider>;
}
