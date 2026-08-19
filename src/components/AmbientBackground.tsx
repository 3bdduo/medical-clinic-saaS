// Vibrant, slow-moving multi-color gradient mesh.
// Pure GPU transforms (translate3d/scale) for 60fps silky smooth rendering.
export function AmbientBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* Top-right vibrant Electric Cyan / Teal orb */}
      <div className="gpu absolute -right-36 -top-36 h-[46rem] w-[46rem] rounded-full bg-gradient-to-br from-primary/20 via-cyan-400/15 to-transparent blur-[120px] motion-safe:animate-drift dark:from-primary/25 dark:via-cyan-500/20" />

      {/* Bottom-left Electric Emerald orb */}
      <div
        className="gpu absolute -bottom-40 -left-40 h-[44rem] w-[44rem] rounded-full bg-gradient-to-tr from-accent/20 via-emerald-400/15 to-transparent blur-[120px] motion-safe:animate-drift dark:from-accent/25 dark:via-emerald-500/20"
        style={{ animationDelay: "-9s" }}
      />

      {/* Center Top subtle violet/blue glow tint for depth */}
      <div
        className="gpu absolute left-1/3 top-1/4 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-500/10 via-primary/10 to-teal-400/10 blur-[110px] motion-safe:animate-pulse-slow dark:from-blue-600/15 dark:via-primary/15"
        style={{ animationDelay: "-4s" }}
      />
    </div>
  );
}
