"use client";

const variantStyles: Record<string, string> = {
  brand: "bg-brand hover:bg-brand/80 text-white",
  green: "bg-green hover:bg-green/80 text-white",
  red: "bg-red hover:bg-red/80 text-white",
  amber: "bg-amber hover:bg-amber/80 text-black",
  orange: "bg-orange hover:bg-orange/80 text-white",
  ghost: "bg-transparent hover:bg-raised text-text-soft border border-border",
  outline: "bg-transparent hover:bg-raised text-text border border-border",
};

export function Button({
  children,
  onClick,
  variant = "brand",
  disabled,
  className = "",
  full,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: string;
  disabled?: boolean;
  className?: string;
  full?: boolean;
}) {
  const vs = variantStyles[variant] || variantStyles.brand;
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg
        transition-colors disabled:opacity-50 disabled:cursor-not-allowed
        ${vs} ${full ? "w-full" : ""} ${className}`}
    >
      {children}
    </button>
  );
}
