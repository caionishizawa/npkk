'use client';

export function Header() {
  return (
    <header className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-cyan-400 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-background">
              <path d="M4 12V4h2v6h4V4h2v8H4z" fill="currentColor" />
            </svg>
          </div>
          <span className="text-lg font-semibold text-text-primary tracking-tight">
            Loop<span className="text-primary">Lab</span>
          </span>
          <span className="text-[10px] font-mono text-text-secondary bg-panel border border-border rounded px-1.5 py-0.5 uppercase tracking-wider">
            Beta
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-text-secondary">
          <span className="hidden sm:inline font-mono">Engine v1.0</span>
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="hidden sm:inline">Live</span>
        </div>
      </div>
    </header>
  );
}
