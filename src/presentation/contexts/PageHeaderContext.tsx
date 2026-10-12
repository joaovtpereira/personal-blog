"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type PageHeaderOverride = {
  /** Texto central do cabeçalho no celular (ex.: "AULA 03/08"). */
  crumb?: string;
  /** Para onde o botão voltar leva (rota sem idioma). */
  backHref?: string;
  backLabel?: string;
};

type Value = {
  override: PageHeaderOverride | null;
  setOverride: (value: PageHeaderOverride | null) => void;
};

const PageHeaderContext = createContext<Value | null>(null);

export function PageHeaderProvider({ children }: { children: ReactNode }) {
  const [override, setOverride] = useState<PageHeaderOverride | null>(null);
  return <PageHeaderContext.Provider value={{ override, setOverride }}>{children}</PageHeaderContext.Provider>;
}

export function usePageHeaderOverride(): PageHeaderOverride | null {
  return useContext(PageHeaderContext)?.override ?? null;
}

/** Uma tela pede um cabeçalho diferente enquanto estiver montada. */
export function PageHeader({ crumb, backHref, backLabel }: PageHeaderOverride) {
  const setOverride = useContext(PageHeaderContext)?.setOverride;
  useEffect(() => {
    setOverride?.({ crumb, backHref, backLabel });
    return () => setOverride?.(null);
  }, [setOverride, crumb, backHref, backLabel]);
  return null;
}
