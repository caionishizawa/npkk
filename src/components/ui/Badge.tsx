'use client';

import { cn } from '@/lib/utils';
import type { SafetyBadge, SafetyScore } from '@/lib/types';

interface BadgeProps {
  variant: 'safe' | 'watch' | 'danger' | 'neutral';
  children: React.ReactNode;
  size?: 'sm' | 'md';
}

const variants = {
  safe: 'bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border-emerald-500/50 text-emerald-400',
  watch: 'bg-amber-500/20 border-amber-500/50 text-amber-400',
  danger: 'bg-rose-500/20 border-rose-500/50 text-rose-400',
  neutral: 'bg-slate-500/20 border-slate-500/50 text-slate-400',
};

export function Badge({ variant, children, size = 'sm' }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center border rounded font-mono uppercase tracking-wider',
        variants[variant],
        size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-3 py-1'
      )}
    >
      {children}
    </span>
  );
}

export function SafetyBadgeComponent({ badge }: { badge: SafetyBadge }) {
  const map: Record<SafetyBadge, { variant: BadgeProps['variant']; icon: string }> = {
    SAFE: { variant: 'safe', icon: '●' },
    WATCH: { variant: 'watch', icon: '●' },
    DANGER: { variant: 'danger', icon: '●' },
  };
  const { variant, icon } = map[badge];
  return (
    <Badge variant={variant} size="md">
      {icon} {badge}
    </Badge>
  );
}

export function SafetyScoreBadge({ score }: { score: SafetyScore }) {
  const map: Record<SafetyScore, { variant: BadgeProps['variant']; icon: string }> = {
    PASS: { variant: 'safe', icon: 'PASS' },
    MARGINAL: { variant: 'watch', icon: 'MARGINAL' },
    FAIL: { variant: 'danger', icon: 'FAIL' },
  };
  const { variant, icon } = map[score];
  return <Badge variant={variant}>{icon}</Badge>;
}
