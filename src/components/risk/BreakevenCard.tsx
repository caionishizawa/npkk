'use client';

import { useRiskLabStore, useStrategyStore } from '@/lib/store';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { getMarketById } from '@/lib/data';

export function BreakevenCard() {
  const result = useStrategyStore((s) => s.result);
  const marketId = useStrategyStore((s) => s.marketId);
  const { breakeven, runBreakeven } = useRiskLabStore();

  if (!result) return null;

  const handleCalculate = () => {
    const market = getMarketById(marketId);
    if (market) runBreakeven(result, market);
  };

  return (
    <Card glow>
      <CardHeader title="Sensitivity Analysis" subtitle="Break-even borrow rate" />

      <Button onClick={handleCalculate} variant="secondary" size="sm" className="mb-4">
        Calculate Break-even
      </Button>

      {breakeven && (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs text-text-secondary">Break-even Borrow Rate</span>
            <span className="text-lg font-mono font-semibold text-amber-400">
              {(breakeven.breakevenBorrowRate * 100).toFixed(1)}% APY
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-text-secondary">Current Borrow Rate</span>
            <span className="text-sm font-mono text-text-primary">
              {(breakeven.currentBorrowRate * 100).toFixed(1)}% APY
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-text-secondary">Safety Margin</span>
            <span className="text-sm font-mono text-emerald-400">
              +{(breakeven.safetyMargin * 100).toFixed(1)}%
            </span>
          </div>

          <div className="mt-3 p-3 bg-amber-500/5 border border-amber-500/20 rounded-lg">
            <p className="text-xs text-amber-400">
              If borrow rate spikes above {(breakeven.breakevenBorrowRate * 100).toFixed(1)}%,
              your organic ROE goes negative.
            </p>
          </div>
        </div>
      )}
    </Card>
  );
}
