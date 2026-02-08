"use client";

const variantMap: Record<string, string> = {
  green: "bg-green/15 text-green border-green/30",
  red: "bg-red/15 text-red border-red/30",
  amber: "bg-amber/15 text-amber border-amber/30",
  purple: "bg-purple/15 text-purple border-purple/30",
  brand: "bg-brand/15 text-brand border-brand/30",
  orange: "bg-orange/15 text-orange border-orange/30",
  muted: "bg-raised text-text-soft border-border",
};

export function Badge({
  children,
  variant = "muted",
  className = "",
}: {
  children: React.ReactNode;
  variant?: keyof typeof variantMap | string;
  className?: string;
}) {
  const cls = variantMap[variant] || variantMap.muted;
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded border ${cls} ${className}`}
    >
      {children}
    </span>
  );
}
