"use client";

import { Layers, Landmark, Repeat, Settings, Globe } from "lucide-react";
import { useAppStore, ViewType } from "@/lib/store";
import { t } from "@/lib/i18n";

export function Header() {
  const view = useAppStore((s) => s.view);
  const setView = useAppStore((s) => s.setView);
  const lang = useAppStore((s) => s.lang);
  const setLang = useAppStore((s) => s.setLang);

  const tabs: { id: ViewType; labelKey: "header.airdrops" | "header.liquidation" | "header.loops" | "header.admin"; icon: React.ReactNode }[] = [
    { id: "airdrops", labelKey: "header.airdrops", icon: <Layers className="w-4 h-4" /> },
    { id: "lending", labelKey: "header.liquidation", icon: <Landmark className="w-4 h-4" /> },
    { id: "loops", labelKey: "header.loops", icon: <Repeat className="w-4 h-4" /> },
    { id: "admin", labelKey: "header.admin", icon: <Settings className="w-4 h-4" /> },
  ];

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

          <div className="flex items-center gap-2">
            <nav className="flex items-center gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setView(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    view === tab.id
                      ? "bg-brand/15 text-brand"
                      : "text-text-muted hover:text-text-soft hover:bg-raised"
                  }`}
                >
                  {tab.icon}
                  <span className="hidden sm:inline">{t(tab.labelKey, lang)}</span>
                </button>
              ))}
            </nav>

            <button
              onClick={() => setLang(lang === "en" ? "pt" : "en")}
              className="flex items-center gap-1 px-2 py-1.5 text-xs font-medium rounded-lg text-text-muted hover:text-text-soft hover:bg-raised transition-colors border border-border ml-1"
              title={lang === "en" ? "Mudar para Portugues" : "Switch to English"}
            >
              <Globe className="w-3.5 h-3.5" />
              <span className="font-mono uppercase">{lang === "en" ? "PT" : "EN"}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
