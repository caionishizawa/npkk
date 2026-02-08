'use client';

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (val: number) => void;
  formatValue?: (val: number) => string;
  leftLabel?: string;
  rightLabel?: string;
}

export function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  formatValue,
  leftLabel,
  rightLabel,
}: SliderProps) {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-text-secondary uppercase tracking-wider">
          {label}
        </label>
        <span className="text-sm font-mono text-primary">
          {formatValue ? formatValue(value) : value}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer
          [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:w-4
          [&::-webkit-slider-thumb]:h-4
          [&::-webkit-slider-thumb]:rounded-full
          [&::-webkit-slider-thumb]:bg-primary
          [&::-webkit-slider-thumb]:shadow-[0_0_8px_rgba(0,217,255,0.4)]
          [&::-webkit-slider-thumb]:cursor-pointer
          [&::-webkit-slider-thumb]:transition-shadow
          [&::-webkit-slider-thumb]:hover:shadow-[0_0_12px_rgba(0,217,255,0.6)]"
        style={{
          background: `linear-gradient(to right, #00D9FF ${percentage}%, #1E2732 ${percentage}%)`,
        }}
      />
      {(leftLabel || rightLabel) && (
        <div className="flex justify-between text-[10px] text-text-secondary">
          <span>{leftLabel}</span>
          <span>{rightLabel}</span>
        </div>
      )}
    </div>
  );
}
