'use client';

import { cn } from '@/lib/utils';

interface InputProps {
  label: string;
  value: string | number;
  onChange: (val: string) => void;
  type?: 'text' | 'number';
  prefix?: string;
  suffix?: string;
  placeholder?: string;
  className?: string;
  min?: number;
  max?: number;
  step?: number;
}

export function Input({
  label,
  value,
  onChange,
  type = 'text',
  prefix,
  suffix,
  placeholder,
  className,
  min,
  max,
  step,
}: InputProps) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <label className="text-xs font-medium text-text-secondary uppercase tracking-wider">
        {label}
      </label>
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary text-sm">
            {prefix}
          </span>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          min={min}
          max={max}
          step={step}
          className={cn(
            'w-full bg-panel border border-border rounded-lg py-2.5 text-sm text-text-primary',
            'font-mono placeholder:text-text-secondary/50',
            'focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(0,217,255,0.1)]',
            'transition-all duration-200',
            prefix ? 'pl-8 pr-3' : 'px-3',
            suffix ? 'pr-12' : ''
          )}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary text-xs font-mono">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}
