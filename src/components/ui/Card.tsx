import { HTMLAttributes } from "react";

export function Card({
  className = "",
  hover = false,
  glass = false,
  vibrant = false,
  ...props
}: HTMLAttributes<HTMLDivElement> & { hover?: boolean; glass?: boolean; vibrant?: boolean }) {
  return (
    <div
      className={`
        rounded-2xl border border-border/80 bg-surface p-6 shadow-sm
        transition-all duration-450 ease-silky
        ${glass ? "glass-alive" : ""}
        ${vibrant ? "hover:border-primary/60 hover:shadow-glow-cyan" : ""}
        ${hover ? "hover:shadow-lg hover:border-primary/40 hover:-translate-y-1 cursor-pointer" : ""}
        ${className}
      `}
      {...props}
    />
  );
}
