'use client';

import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number; // 0-100
  max?: number;
  variant?: 'safe' | 'warning' | 'danger' | 'primary';
  size?: 'sm' | 'md';
  showLabel?: boolean;
}

const barColors = {
  safe: 'bg-gradient-to-r from-emerald-500 to-cyan-400',
  warning: 'bg-gradient-to-r from-amber-500 to-amber-400',
  danger: 'bg-gradient-to-r from-rose-500 to-rose-400',
  primary: 'bg-gradient-to-r from-primary to-cyan-400',
};

export function ProgressBar({
  value,
  max = 100,
  variant = 'primary',
  size = 'md',
  showLabel,
}: ProgressBarProps) {
  const percent = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className="flex items-center gap-3">
      <div
        className={cn(
          'flex-1 bg-border/50 rounded-full overflow-hidden',
          size === 'sm' ? 'h-1.5' : 'h-2.5'
        )}
      >
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500 ease-out',
            barColors[variant]
          )}
          style={{ width: `${percent}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-mono text-text-secondary min-w-[3rem] text-right">
          {value.toFixed(1)}%
        </span>
      )}
    </div>
  );
}
