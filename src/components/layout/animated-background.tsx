export function AnimatedBackground() {
  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div
        className="blob blob-1"
        style={{
          width: 520,
          height: 520,
          top: "-12%",
          left: "-8%",
          background: "radial-gradient(circle, #a855f7 0%, transparent 65%)",
        }}
      />
      <div
        className="blob blob-2"
        style={{
          width: 480,
          height: 480,
          top: "10%",
          right: "-10%",
          background: "radial-gradient(circle, #22d3ee 0%, transparent 65%)",
          opacity: 0.4,
        }}
      />
      <div
        className="blob blob-3"
        style={{
          width: 600,
          height: 600,
          bottom: "-20%",
          left: "30%",
          background: "radial-gradient(circle, #6366f1 0%, transparent 65%)",
          opacity: 0.45,
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage:
            "radial-gradient(ellipse at center, rgba(0,0,0,0.85) 30%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, rgba(0,0,0,0.85) 30%, transparent 75%)",
        }}
      />
    </div>
  );
}
