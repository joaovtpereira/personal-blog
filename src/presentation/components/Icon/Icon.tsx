import type { SVGProps } from "react";

const PATHS = {
  arrowUpRight: "M7 17L17 7M8 7h9v9",
  arrowRight: "M5 12h14M13 6l6 6-6 6",
  menu: "M4 9h16M4 15h16",
  close: "M6 6l12 12M18 6L6 18",
  home: "M4 11l8-7 8 7v9h-5v-6H9v6H4z",
  doc: "M5 4h10l4 4v12H5z M9 12h6M9 16h6",
  book: "M3 5h6a3 3 0 0 1 3 3v12a2 2 0 0 0-2-2H3z M21 5h-6a3 3 0 0 0-3 3v12a2 2 0 0 1 2-2h7z",
  user: "M12 4a4 4 0 1 1 0 8a4 4 0 0 1 0-8z M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6",
  mail: "M4 6h16v12H4z M4 7l8 6 8-6",
  code: "M8 6l-5 6 5 6M16 6l5 6-5 6M13.5 4l-3 16",
} as const;

export type IconName = keyof typeof PATHS | "theme" | "play";

type IconProps = Omit<SVGProps<SVGSVGElement>, "name"> & {
  name: IconName;
  size?: number;
  strokeWidth?: number;
};

/** Ícones de linha do DS: 24×24, traço 1.6, cor herdada. */
export function Icon({ name, size = 18, strokeWidth = 1.6, ...rest }: IconProps) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    "aria-hidden": true,
    focusable: false,
    ...rest,
  } as const;

  if (name === "play") {
    return (
      <svg {...common} fill="currentColor">
        <path d="M7 4l13 8-13 8z" />
      </svg>
    );
  }

  if (name === "theme") {
    return (
      <svg {...common} fill="none" stroke="currentColor" strokeWidth={strokeWidth}>
        <circle cx="12" cy="12" r="8" />
        <path d="M12 4a8 8 0 0 1 0 16z" fill="currentColor" />
      </svg>
    );
  }

  return (
    <svg
      {...common}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={PATHS[name]} />
    </svg>
  );
}
