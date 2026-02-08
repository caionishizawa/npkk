'use client';

import { useStrategyStore } from '@/lib/store';
import { Card, CardHeader } from '@/components/ui/Card';
import { SafetyBadgeComponent } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { AnimatedNumber } from '@/components/ui/AnimatedNumber';
import { formatUsd } from '@/lib/utils';
import { SpeculativeCard } from './SpeculativeCard';

export function StrategyOutputs() {
  const result = useStrategyStore((s) => s.result);

  if (!result) {
    return (
      <div className="flex items-center justify-center h-64 text-text-secondary text-sm">
        <div className="text-center space-y-2">
          <div className="text-2xl opacity-30">&#9881;</div>
          <p>Configure your strategy and click Calculate</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Column 1: Returns */}
        <Card glow>
          <CardHeader title="Returns" subtitle="Net organic yield" />
          <div className="space-y-4">
            <div>
              <p className="text-xs text-text-secondary uppercase tracking-wider">Net ROE (Organic)</p>
              <div className="flex items-baseline gap-2 mt-1">
                <AnimatedNumber
                  value={result.netRoeOrganic * 100}
                  suffix="% APR"
                  decimals={1}
                  className="text-3xl font-semibold font-mono text-primary"
                />
              </div>
            </div>

            <div className="space-y-2 pt-3 border-t border-border">
              <p className="text-xs text-text-secondary font-medium">Breakdown</p>
              <BreakdownRow label="Supply APY" value={result.supplyApy} positive />
              <BreakdownRow label="Borrow Cost" value={-result.borrowCost} />
              <BreakdownRow label="Protocol Rewards" value={result.protocolRewards} positive />
              <BreakdownRow label="Fees/Slippage" value={-result.feesSlippage} />
              <div className="border-t border-border pt-2">
                <BreakdownRow label="Net Organic" value={result.netRoeOrganic} bold />
              </div>
            </div>
          </div>
        </Card>

        {/* Column 2: Position Details */}
        <Card glow>
          <CardHeader title="Position Details" subtitle="Leverage & exposure" />
          <div className="space-y-3">
            <DetailRow
              label="Effective Leverage"
              value={`${result.effectiveLeverage.toFixed(2)}x`}
              highlight
            />
            <DetailRow label="Collateral Value" value={formatUsd(result.collateralValue)} />
            <DetailRow label="Debt Value" value={formatUsd(result.debtValue)} />
            <DetailRow
              label="Net Exposure"
              value={formatUsd(result.netExposure)}
              highlight
            />
            <div className="border-t border-border pt-3">
              <DetailRow
                label="Loop Iterations"
                value={`~${result.loopIterations} cycles`}
              />
              <DetailRow
                label="Gas Cost (est.)"
                value={formatUsd(result.gasCostEstimated)}
              />
            </div>
          </div>
        </Card>

        {/* Column 3: Risk Metrics */}
        <Card glow>
          <CardHeader title="Risk Metrics" subtitle="Safety profile" />
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-secondary">Health Factor</span>
              <div className="flex items-center gap-2">
                <span className="text-xl font-mono font-semibold text-text-primary">
                  <AnimatedNumber value={result.healthFactor} decimals={2} />
                </span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-text-secondary">Distance to Liquidation</span>
                <span className="text-sm font-mono text-text-primary">
                  {(result.distanceToLiquidation * 100).toFixed(1)}%
                </span>
              </div>
              <ProgressBar
                value={result.distanceToLiquidation * 100}
                variant={
                  result.distanceToLiquidation > 0.3
                    ? 'safe'
                    : result.distanceToLiquidation > 0.15
                    ? 'warning'
                    : 'danger'
                }
              />
            </div>

            <div className="space-y-2">
              <DetailRow
                label="Liquidation Price"
                value={`${result.currentPrice > 100 ? formatUsd(result.liquidationPrice) : result.liquidationPrice.toFixed(4)}`}
              />
              <DetailRow
                label="Current Price"
                value={`${result.currentPrice > 100 ? formatUsd(result.currentPrice) : result.currentPrice.toFixed(4)}`}
              />
            </div>

            <div className="pt-2">
              <SafetyBadgeComponent badge={result.safetyBadge} />
            </div>
          </div>
        </Card>
      </div>

      {/* Speculative Upside */}
      {result.speculative && <SpeculativeCard speculative={result.speculative} />}
    </div>
  );
}

function BreakdownRow({
  label,
  value,
  bold,
}: {
  label: string;
  value: number;
  positive?: boolean;
  bold?: boolean;
}) {
  const color = value >= 0 ? 'text-emerald-400' : 'text-rose-400';
  return (
    <div className="flex justify-between items-center">
      <span className={`text-xs ${bold ? 'text-text-primary font-medium' : 'text-text-secondary'}`}>
        {value >= 0 ? '+' : ''} {label}
      </span>
      <span className={`text-xs font-mono ${bold ? 'text-text-primary font-semibold' : color}`}>
        {(value * 100).toFixed(1)}%
      </span>
    </div>
  );
}

function DetailRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-xs text-text-secondary">{label}</span>
      <span
        className={`text-sm font-mono ${
          highlight ? 'text-primary font-semibold' : 'text-text-primary'
        }`}
      >
        {value}
      </span>
    </div>
  );
}
