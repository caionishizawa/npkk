"use client";

export function Card({
  children,
  className = "",
  padding = true,
}: {
  children: React.ReactNode;
  className?: string;
  padding?: boolean;
}) {
  return (
    <div
      className={`bg-surface border border-border rounded-xl ${
        padding ? "p-5" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
