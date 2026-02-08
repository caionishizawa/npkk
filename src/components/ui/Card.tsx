'use client';

import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
}

export function Card({ children, className, glow }: CardProps) {
  return (
    <div
      className={cn(
        'bg-panel border border-border rounded-xl p-6',
        'transition-all duration-200',
        glow && 'hover:border-primary/30 hover:shadow-[0_0_20px_rgba(0,217,255,0.05)]',
        className
      )}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  icon?: string;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function CardHeader({ icon, title, subtitle, action }: CardHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div>
        <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
          {icon && <span>{icon}</span>}
          {title}
        </h3>
        {subtitle && (
          <p className="text-xs text-text-secondary mt-0.5">{subtitle}</p>
        )}
      </div>
      {action}
    </div>
  );
}
