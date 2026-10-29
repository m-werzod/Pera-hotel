import type { ReactNode } from "react";
import { Reveal } from "./reveal";

type SectionHeadingProps = {
  eyebrow: string;
  heading: string;
  lede?: string;
  /** Headings default to h2; the hero owns the single h1 on the page. */
  as?: "h2" | "h3";
  align?: "start" | "center";
  children?: ReactNode;
};

export function SectionHeading({
  eyebrow,
  heading,
  lede,
  as: Tag = "h2",
  align = "start",
  children,
}: SectionHeadingProps) {
  const centered = align === "center";

  return (
    <Reveal
      className={`flex flex-col gap-4 ${centered ? "items-center text-center" : "items-start"}`}
    >
      <div className={`flex items-center gap-3 ${centered ? "justify-center" : ""}`}>
        <span className="rule-accent" aria-hidden="true" />
        <span className="eyebrow">{eyebrow}</span>
      </div>

      <Tag className="max-w-2xl text-3xl leading-[1.1] text-ivory sm:text-4xl lg:text-5xl">
        {heading}
      </Tag>

      {lede ? (
        <p className="max-w-xl text-base leading-relaxed text-sand-deep sm:text-lg">
          {lede}
        </p>
      ) : null}

      {children}
    </Reveal>
  );
}
