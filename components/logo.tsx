import { cn } from "@/lib/utils";

export function Logo({
  className,
  showWordmark = true,
}: {
  className?: string;
  showWordmark?: boolean;
}) {
  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      <LogoMark className="h-7 w-7" />
      {showWordmark && (
        <span className="text-base font-semibold tracking-[-0.02em]">
          ClipForge
        </span>
      )}
    </div>
  );
}

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="cf-grad" x1="0" y1="0" x2="32" y2="32">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#7c5cff" />
        </linearGradient>
      </defs>
      {/* Rounded square mark */}
      <rect x="0" y="0" width="32" height="32" rx="8" fill="url(#cf-grad)" />
      {/* A stylized "cut" — two converging triangles forming a play head /
          scissors-cut silhouette */}
      <path
        d="M11 8 L11 24 L22 16 Z"
        fill="white"
        fillOpacity="0.95"
      />
      <circle cx="11" cy="16" r="2.5" fill="url(#cf-grad)" />
    </svg>
  );
}
