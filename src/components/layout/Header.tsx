"use client";

import { Layers, Landmark, Repeat, Settings } from "lucide-react";
import { useAppStore, ViewType } from "@/lib/store";

const tabs: { id: ViewType; label: string; icon: React.ReactNode }[] = [
  { id: "airdrops", label: "Airdrops", icon: <Layers className="w-4 h-4" /> },
  { id: "lending", label: "Liquidation Calc", icon: <Landmark className="w-4 h-4" /> },
  { id: "loops", label: "Loop Simulator", icon: <Repeat className="w-4 h-4" /> },
  { id: "admin", label: "Admin", icon: <Settings className="w-4 h-4" /> },
];

export function Header() {
  const view = useAppStore((s) => s.view);
  const setView = useAppStore((s) => s.setView);

  return (
    <header className="sticky top-0 z-50 bg-bg/80 backdrop-blur-xl border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand to-purple flex items-center justify-center text-white font-bold text-sm">
              N
            </div>
            <span className="text-text font-semibold text-sm hidden sm:block">
              Not Just Tools
            </span>
            <span className="text-[10px] font-mono text-text-muted border border-border rounded px-1.5 py-0.5">
              v1.0
            </span>
          </div>

          <nav className="flex items-center gap-1">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setView(t.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  view === t.id
                    ? "bg-brand/15 text-brand"
                    : "text-text-muted hover:text-text-soft hover:bg-raised"
                }`}
              >
                {t.icon}
                <span className="hidden sm:inline">{t.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
