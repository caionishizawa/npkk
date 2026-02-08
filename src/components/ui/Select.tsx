'use client';

import { cn } from '@/lib/utils';

interface SelectOption {
  value: string;
  label: string;
  badge?: string;
}

interface SelectProps {
  label: string;
  value: string;
  options: SelectOption[];
  onChange: (val: string) => void;
  className?: string;
}

export function Select({ label, value, options, onChange, className }: SelectProps) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <label className="text-xs font-medium text-text-secondary uppercase tracking-wider">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          'w-full bg-panel border border-border rounded-lg py-2.5 px-3 text-sm text-text-primary',
          'focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(0,217,255,0.1)]',
          'transition-all duration-200 appearance-none',
          'bg-[url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%238B949E%22%20d%3D%22M2%204l4%204%204-4%22%2F%3E%3C%2Fsvg%3E")]',
          'bg-no-repeat bg-[right_12px_center]'
        )}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label} {opt.badge ? `(${opt.badge})` : ''}
          </option>
        ))}
      </select>
    </div>
  );
}
