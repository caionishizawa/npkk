"use client";

export function BigStat({
  label,
  value,
  sub,
  color = "text-text",
  icon,
}: {
  label: string;
  value: string;
  sub?: string;
  color?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="bg-surface border border-border rounded-xl p-4">
      <div className="flex items-center gap-2 mb-2">
        {icon && <span className="text-text-muted">{icon}</span>}
        <span className="text-xs text-text-muted uppercase tracking-wider">
          {label}
        </span>
      </div>
      <div className={`font-mono text-xl font-bold ${color}`}>{value}</div>
      {sub && (
        <div className="text-xs text-text-muted mt-1 font-mono">{sub}</div>
      )}
    </div>
  );
}
