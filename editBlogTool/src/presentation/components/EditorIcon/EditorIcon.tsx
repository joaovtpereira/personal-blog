import type { SVGProps } from "react";

/** Ícones do editor que o Icon do blog não tem. Mesmo padrão do DS: 24×24, traço 1.6, cor herdada. */
const PATHS = {
  arrowUp: "M12 19V5M6 11l6-6 6 6",
  arrowDown: "M12 5v14M6 13l6 6 6-6",
  duplicate: "M8 8h12v12H8z M16 8V4H4v12h4",
  trash: "M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3",
  eye: "M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z M12 9a3 3 0 1 1 0 6a3 3 0 0 1 0-6z",
  download: "M12 4v12M7 11l5 5 5-5M5 20h14",
  upload: "M12 15V3M7 8l5-5 5 5M5 13v7h14v-7",
  plus: "M12 5v14M5 12h14",
  folder: "M3 6h6l2 2h10v11H3z",
} as const;

export type EditorIconName = keyof typeof PATHS | "grip";

type EditorIconProps = Omit<SVGProps<SVGSVGElement>, "name"> & { name: EditorIconName; size?: number };

export function EditorIcon({ name, size = 16, ...rest }: EditorIconProps) {
  const common = { width: size, height: size, viewBox: "0 0 24 24", "aria-hidden": true, focusable: false, ...rest } as const;
  if (name === "grip") {
    return (
      <svg {...common} fill="currentColor">
        {[6, 12, 18].flatMap((y) => [9, 15].map((x) => <circle key={`${x}-${y}`} cx={x} cy={y} r="1.5" />))}
      </svg>
    );
  }
  return (
    <svg {...common} fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <path d={PATHS[name]} />
    </svg>
  );
}
