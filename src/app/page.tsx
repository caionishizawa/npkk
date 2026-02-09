"use client";

import { Header } from "@/components/layout/Header";
import { DashboardView } from "@/components/dashboard/DashboardView";
import { LendingView } from "@/components/lending/LendingView";
import { LoopView } from "@/components/loops/LoopView";
import { AdminView } from "@/components/admin/AdminView";
import { useAppStore } from "@/lib/store";
import { t } from "@/lib/i18n";

export default function Home() {
  const view = useAppStore((s) => s.view);
  const lang = useAppStore((s) => s.lang);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6">
        {view === "airdrops" && <DashboardView />}
        {view === "lending" && <LendingView />}
        {view === "loops" && <LoopView />}
        {view === "admin" && <AdminView />}

        <footer className="mt-12 py-6 border-t border-border text-center">
          <p className="text-xs text-text-muted">
            {t("footer.disclaimer", lang)}
          </p>
          <p className="text-[10px] text-text-muted/60 mt-1">
            {t("footer.audit", lang)}
          </p>
        </footer>
      </main>
    </div>
  );
}
