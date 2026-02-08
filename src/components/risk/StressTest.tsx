'use client';

import { useRiskLabStore, useStrategyStore } from '@/lib/store';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { SafetyBadgeComponent } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { AnimatedNumber } from '@/components/ui/AnimatedNumber';

export function StressTest() {
  const result = useStrategyStore((s) => s.result);
  const {
    priceDrop,
    borrowSpike,
    depeg,
    stressResult,
    setPriceDrop,
    setBorrowSpike,
    setDepeg,
    runStressTest,
  } = useRiskLabStore();

  if (!result) {
    return (
      <Card>
        <CardHeader title="Stress Test" subtitle="Calculate a strategy first" />
        <p className="text-sm text-text-secondary">
          Go to Strategy Builder to calculate a position before stress testing.
        </p>
      </Card>
    );
  }

  const handleRun = () => runStressTest(result);

  return (
    <Card glow>
      <CardHeader title="Stress Test Your Position" subtitle="Simulate adverse scenarios" />

      <div className="space-y-4">
        {/* Price Drop */}
        <div>
          <p className="text-xs text-text-secondary mb-2 font-medium">Price Drop</p>
          <div className="flex gap-2 flex-wrap">
            {[0.10, 0.20, 0.30].map((v) => (
              <Button
                key={v}
                variant="secondary"
                size="sm"
                active={priceDrop === v}
                onClick={() => { setPriceDrop(v); }}
              >
                -{v * 100}%
              </Button>
            ))}
            <Input
              label=""
              value={(priceDrop * 100).toFixed(0)}
              onChange={(val) => setPriceDrop(Number(val) / 100)}
              type="number"
              suffix="%"
              className="w-24"
            />
          </div>
        </div>

        {/* Borrow Spike */}
        <div>
          <p className="text-xs text-text-secondary mb-2 font-medium">Borrow Rate Spike</p>
          <div className="flex gap-2 flex-wrap">
            {[0.05, 0.10, 0.15].map((v) => (
              <Button
                key={v}
                variant="secondary"
                size="sm"
                active={borrowSpike === v}
                onClick={() => { setBorrowSpike(v); }}
              >
                +{v * 100}%
              </Button>
            ))}
            <Input
              label=""
              value={(borrowSpike * 100).toFixed(0)}
              onChange={(val) => setBorrowSpike(Number(val) / 100)}
              type="number"
              suffix="%"
              className="w-24"
            />
          </div>
        </div>

        {/* Depeg */}
        <div>
          <p className="text-xs text-text-secondary mb-2 font-medium">Depeg (LST/LRT)</p>
          <div className="flex gap-2 flex-wrap">
            {[0.01, 0.03, 0.05].map((v) => (
              <Button
                key={v}
                variant="secondary"
                size="sm"
                active={depeg === v}
                onClick={() => { setDepeg(v); }}
              >
                -{v * 100}%
              </Button>
            ))}
            <Input
              label=""
              value={(depeg * 100).toFixed(0)}
              onChange={(val) => setDepeg(Number(val) / 100)}
              type="number"
              suffix="%"
              className="w-24"
            />
          </div>
        </div>

        <Button onClick={handleRun} variant="primary" size="md" className="w-full">
          Run Stress Test
        </Button>

        {/* Results */}
        {stressResult && (
          <div className="mt-4 pt-4 border-t border-border space-y-3">
            <p className="text-xs text-text-secondary font-medium uppercase tracking-wider">
              After {(priceDrop * 100).toFixed(0)}% price drop:
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-text-secondary">New HF</p>
                <div className="flex items-center gap-2">
                  <AnimatedNumber
                    value={stressResult.newHealthFactor}
                    decimals={2}
                    className="text-xl font-mono font-semibold text-text-primary"
                  />
                  <span className="text-xs text-text-secondary font-mono">
                    (was {stressResult.previousHealthFactor.toFixed(2)})
                  </span>
                </div>
              </div>
              <div>
                <p className="text-xs text-text-secondary">New Distance</p>
                <div className="flex items-center gap-2">
                  <AnimatedNumber
                    value={stressResult.newDistanceToLiq * 100}
                    suffix="%"
                    decimals={1}
                    className="text-xl font-mono font-semibold text-text-primary"
                  />
                  <span className="text-xs text-text-secondary font-mono">
                    (was {(stressResult.previousDistanceToLiq * 100).toFixed(1)}%)
                  </span>
                </div>
              </div>
            </div>
            <SafetyBadgeComponent badge={stressResult.newSafetyBadge} />
          </div>
        )}
      </div>
    </Card>
  );
}
