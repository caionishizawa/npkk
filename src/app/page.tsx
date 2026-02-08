'use client';

import { Header } from '@/components/layout/Header';
import { TabNav } from '@/components/layout/TabNav';
import { StrategyInputs } from '@/components/strategy/StrategyInputs';
import { StrategyOutputs } from '@/components/strategy/StrategyOutputs';
import { StressTest } from '@/components/risk/StressTest';
import { UnwindPlanner } from '@/components/risk/UnwindPlanner';
import { BreakevenCard } from '@/components/risk/BreakevenCard';
import { RoeLtvChart } from '@/components/charts/RoeLtvChart';
import { CompareView } from '@/components/compare/CompareView';
import { PointsCalculator } from '@/components/points/PointsCalculator';
import { useUIStore } from '@/lib/store';

export default function Home() {
  const activeTab = useUIStore((s) => s.activeTab);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <TabNav />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
        {activeTab === 'strategy' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4">
              <StrategyInputs />
            </div>
            <div className="lg:col-span-8">
              <StrategyOutputs />
            </div>
          </div>
        )}

        {activeTab === 'risk' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <StressTest />
            <div className="space-y-6">
              <UnwindPlanner />
              <BreakevenCard />
            </div>
            <div className="lg:col-span-2">
              <RoeLtvChart />
            </div>
          </div>
        )}

        {activeTab === 'compare' && <CompareView />}

        {activeTab === 'points' && (
          <div className="max-w-3xl mx-auto">
            <PointsCalculator />
          </div>
        )}

        {/* Footer */}
        <footer className="mt-12 py-6 border-t border-border text-center">
          <p className="text-xs text-text-secondary">
            LoopLab does not provide financial advice. All calculations are estimates.
          </p>
          <p className="text-[10px] text-text-secondary/60 mt-1">
            Formulas are visible and auditable. Verify before acting.
          </p>
        </footer>
      </main>
    </div>
  );
}
