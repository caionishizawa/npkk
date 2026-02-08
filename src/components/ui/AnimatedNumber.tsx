'use client';

import CountUp from 'react-countup';

interface AnimatedNumberProps {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  duration?: number;
  className?: string;
}

export function AnimatedNumber({
  value,
  prefix = '',
  suffix = '',
  decimals = 1,
  duration = 0.8,
  className,
}: AnimatedNumberProps) {
  return (
    <span className={className}>
      <CountUp
        end={value}
        prefix={prefix}
        suffix={suffix}
        decimals={decimals}
        duration={duration}
        preserveValue
        useEasing
      />
    </span>
  );
}
