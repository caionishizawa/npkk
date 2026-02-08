"use client";

export function Select({
  label,
  value,
  onChange,
  options,
  disabled,
  className = "",
}: {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  disabled?: boolean;
  className?: string;
}) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-xs text-text-soft mb-1.5">{label}</label>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full bg-raised border border-border rounded-lg px-3 py-2 text-sm text-text
          focus:outline-none focus:border-border-focus disabled:opacity-50
          disabled:cursor-not-allowed transition-colors appearance-none cursor-pointer"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
