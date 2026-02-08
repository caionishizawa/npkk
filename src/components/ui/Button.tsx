'use client';

import { cn } from '@/lib/utils';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
  active?: boolean;
}

const variants = {
  primary:
    'bg-primary/10 border-primary/30 text-primary hover:bg-primary/20 hover:border-primary/50',
  secondary:
    'bg-panel border-border text-text-primary hover:border-primary/30 hover:text-primary',
  ghost:
    'bg-transparent border-transparent text-text-secondary hover:text-text-primary hover:bg-panel',
  danger:
    'bg-danger/10 border-danger/30 text-danger hover:bg-danger/20 hover:border-danger/50',
};

const sizes = {
  sm: 'text-xs px-3 py-1.5',
  md: 'text-sm px-4 py-2.5',
  lg: 'text-sm px-6 py-3',
};

export function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className,
  disabled,
  active,
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center gap-2 border rounded-lg font-medium',
        'transition-all duration-200 active:scale-[0.98]',
        'disabled:opacity-40 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        active && 'border-primary/50 bg-primary/20 text-primary',
        className
      )}
    >
      {children}
    </button>
  );
}
