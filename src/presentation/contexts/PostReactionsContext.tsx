"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { PostReactionChoice } from "@/domain/entities";
import type { GetPostReactionChoices, SetPostReactionChoice, WatchPostReactionChoices } from "@/domain/use-cases";

type Value = {
  ready: boolean;
  choices: Record<string, PostReactionChoice>;
  setChoice: (postId: string, choice: PostReactionChoice | null) => Promise<void>;
};

const PostReactionsContext = createContext<Value | null>(null);

type ProviderProps = {
  getChoices: GetPostReactionChoices;
  setChoice: SetPostReactionChoice;
  watch: WatchPostReactionChoices;
  children: ReactNode;
};

/** Reações do visitante (curtir / fez sentido...) — casos de uso injetados pelo main/. */
export function PostReactionsProvider({ getChoices, setChoice, watch, children }: ProviderProps) {
  const [choices, setChoices] = useState<Record<string, PostReactionChoice>>({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    const load = () =>
      getChoices.execute().then((value) => {
        if (!active) return;
        setChoices(value);
        setReady(true);
      });
    load();
    const unsubscribe = watch.subscribe(load);
    return () => {
      active = false;
      unsubscribe();
    };
  }, [getChoices, watch]);

  const update = useCallback(
    (postId: string, choice: PostReactionChoice | null) => setChoice.execute({ postId, choice }),
    [setChoice],
  );

  const value = useMemo(() => ({ ready, choices, setChoice: update }), [ready, choices, update]);
  return <PostReactionsContext.Provider value={value}>{children}</PostReactionsContext.Provider>;
}

/** Reação atual do visitante neste post e como trocá-la (tocar de novo remove). */
export function usePostReaction(postId: string) {
  const context = useContext(PostReactionsContext);
  if (!context) throw new Error("usePostReaction precisa estar dentro de <PostReactionsProvider>.");
  const choice = context.choices[postId] ?? null;
  const toggle = (next: PostReactionChoice) => context.setChoice(postId, choice === next ? null : next);
  return { ready: context.ready, choice, toggle };
}
