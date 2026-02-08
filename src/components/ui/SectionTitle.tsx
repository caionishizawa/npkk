"use client";

export function SectionTitle({
  children,
  icon,
  className = "",
}: {
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={`flex items-center gap-2 text-sm font-semibold text-text-soft uppercase tracking-wider ${className}`}
    >
      {icon}
      {children}
    </h2>
  );
}
