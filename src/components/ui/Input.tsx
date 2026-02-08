"use client";

export function Input({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  disabled,
  hint,
  suffix,
  className = "",
}: {
  label?: string;
  value: string | number;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  hint?: string;
  suffix?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-xs text-text-soft mb-1.5">{label}</label>
      )}
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full bg-raised border border-border rounded-lg px-3 py-2 text-sm text-text font-mono
            placeholder:text-text-muted focus:outline-none focus:border-border-focus
            disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-text-muted">
            {suffix}
          </span>
        )}
      </div>
      {hint && <div className="text-xs text-text-muted mt-1">{hint}</div>}
    </div>
  );
}
