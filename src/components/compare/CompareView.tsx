'use client';

import { useCompareStore, useStrategyStore } from '@/lib/store';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge, SafetyScoreBadge } from '@/components/ui/Badge';
import { formatUsd } from '@/lib/utils';
import type { CompareSortKey } from '@/lib/types';

export function CompareView() {
  const { strategies, sortKey, addStrategy, removeStrategy, clearAll, setSortKey } =
    useCompareStore();
  const strategyStore = useStrategyStore();

  const handleAddCurrent = () => {
    if (!strategyStore.result) return;
    const market = `${strategyStore.marketId}`;
    const name = market.replace(/-/g, ' ').toUpperCase();
    addStrategy(name, {
      network: strategyStore.network,
      protocol: strategyStore.protocol,
      marketId: strategyStore.marketId,
      capital: strategyStore.capital,
      capitalInToken: false,
      riskTolerance: strategyStore.riskTolerance,
      pro: strategyStore.showProMode ? strategyStore.pro : undefined,
    }, strategyStore.result);
  };

  const sorted = [...strategies].sort((a, b) => {
    switch (sortKey) {
      case 'rar': return b.rar - a.rar;
      case 'roe': return b.result.netRoeOrganic - a.result.netRoeOrganic;
      case 'safety': return b.result.distanceToLiquidation - a.result.distanceToLiquidation;
      case 'speculative': return (b.result.speculative?.scenarios.base ?? 0) - (a.result.speculative?.scenarios.base ?? 0);
      default: return 0;
    }
  });

  const bestRar = sorted.length > 0 ? sorted.reduce((best, s) => s.rar > best.rar ? s : best).id : '';
  const bestRoe = sorted.length > 0 ? sorted.reduce((best, s) => s.result.netRoeOrganic > best.result.netRoeOrganic ? s : best).id : '';
  const safest = sorted.length > 0 ? sorted.reduce((best, s) => s.result.distanceToLiquidation > best.result.distanceToLiquidation ? s : best).id : '';

  const handleExportCsv = () => {
    if (strategies.length === 0) return;
    const headers = ['Name', 'Net ROE', 'RAR', 'Health Factor', 'Distance to Liq', 'Safety Score', 'Speculative (Base)'];
    const rows = strategies.map((s) => [
      s.name,
      `${(s.result.netRoeOrganic * 100).toFixed(1)}%`,
      s.rar.toFixed(2),
      s.result.healthFactor.toFixed(2),
      `${(s.result.distanceToLiquidation * 100).toFixed(1)}%`,
      s.safetyScore,
      s.result.speculative ? formatUsd(s.result.speculative.scenarios.base) : '$0',
    ]);
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'looplab-compare.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader
          title="Compare Strategies"
          subtitle={`${strategies.length}/6 strategies`}
          action={
            <div className="flex gap-2">
              <Button
                onClick={handleAddCurrent}
                variant="primary"
                size="sm"
                disabled={!strategyStore.result || strategies.length >= 6}
              >
                + Add Current
              </Button>
              <Button onClick={clearAll} variant="ghost" size="sm" disabled={strategies.length === 0}>
                Clear
              </Button>
            </div>
          }
        />

        {strategies.length === 0 ? (
          <div className="py-12 text-center text-text-secondary text-sm">
            <p>No strategies to compare.</p>
            <p className="mt-1">Calculate a strategy and add it here.</p>
          </div>
        ) : (
          <>
            {/* Sort buttons */}
            <div className="flex gap-2 mb-4">
              <span className="text-xs text-text-secondary self-center">Sort by:</span>
              {(['rar', 'roe', 'safety', 'speculative'] as CompareSortKey[]).map((key) => (
                <Button
                  key={key}
                  variant="ghost"
                  size="sm"
                  active={sortKey === key}
                  onClick={() => setSortKey(key)}
                >
                  {key.toUpperCase()}
                </Button>
              ))}
            </div>

            {/* Comparison table */}
            <div className="overflow-x-auto">
              <div className="inline-flex gap-4 min-w-full pb-2">
                {sorted.map((s) => (
                  <div
                    key={s.id}
                    className="w-56 flex-shrink-0 bg-background border border-border rounded-lg p-4 space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium text-text-primary truncate max-w-[140px]">
                          {s.name}
                        </p>
                        <div className="flex gap-1 mt-1">
                          {s.id === bestRar && <Badge variant="safe" size="sm">Best RAR</Badge>}
                          {s.id === bestRoe && <Badge variant="neutral" size="sm">Best ROE</Badge>}
                          {s.id === safest && <Badge variant="safe" size="sm">Safest</Badge>}
                        </div>
                      </div>
                      <button
                        onClick={() => removeStrategy(s.id)}
                        className="text-text-secondary hover:text-danger text-xs"
                      >
                        x
                      </button>
                    </div>

                    <CompareMetric label="Net ROE" value={`${(s.result.netRoeOrganic * 100).toFixed(1)}%`} />
                    <CompareMetric label="RAR" value={s.rar.toFixed(2)} />
                    <CompareMetric label="Health Factor" value={s.result.healthFactor.toFixed(2)} />
                    <CompareMetric
                      label="Distance to Liq"
                      value={`${(s.result.distanceToLiquidation * 100).toFixed(1)}%`}
                    />
                    <CompareMetric
                      label="Speculative (Base)"
                      value={s.result.speculative ? formatUsd(s.result.speculative.scenarios.base) : '$0'}
                    />
                    <div className="pt-2 border-t border-border">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-text-secondary">Safety (-25%)</span>
                        <SafetyScoreBadge score={s.safetyScore} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <Button onClick={handleExportCsv} variant="secondary" size="sm">
                Export to CSV
              </Button>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}

function CompareMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-[10px] text-text-secondary">{label}</span>
      <span className="text-xs font-mono text-text-primary">{value}</span>
    </div>
  );
}
