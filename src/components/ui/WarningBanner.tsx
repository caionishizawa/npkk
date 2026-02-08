"use client";

import { AlertTriangle } from "lucide-react";

export function WarningBanner({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex items-start gap-3 bg-amber/10 border border-amber/30 rounded-lg px-4 py-3 ${className}`}
    >
      <AlertTriangle className="w-4 h-4 text-amber mt-0.5 shrink-0" />
      <div className="text-sm text-amber/90">{children}</div>
    </div>
  );
}
