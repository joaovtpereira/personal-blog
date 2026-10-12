"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { NavItem } from "../navigation";

export type PageHeaderOverride = {
  /** Texto central do cabeçalho no celular (ex.: "AULA 03/08"). */
  crumb?: string;
  /** Para onde o botão voltar leva (rota sem idioma). */
  backHref?: string;
  backLabel?: string;
  /** Ação à direita no cabeçalho do celular (ex.: compartilhar). */
  action?: ReactNode;
  /** Seção do menu que fica ativa quando a URL não diz (ex.: coleção de estudos). */
  section?: NavItem["key"];
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
export function PageHeader({ crumb, backHref, backLabel, action, section }: PageHeaderOverride) {
  const setOverride = useContext(PageHeaderContext)?.setOverride;
  useEffect(() => {
    setOverride?.({ crumb, backHref, backLabel, action, section });
    return () => setOverride?.(null);
  }, [setOverride, crumb, backHref, backLabel, action, section]);
  return null;
}
