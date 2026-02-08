'use client';

import { useState } from 'react';
import { Card, CardHeader } from '@/components/ui/Card';
import { formatUsd, formatNumber } from '@/lib/utils';
import type { SpeculativeResult } from '@/lib/types';

export function SpeculativeCard({ speculative }: { speculative: SpeculativeResult }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card glow>
      <CardHeader
        title="Speculative Upside (Airdrops)"
        subtitle="This value may be ZERO"
        action={
          <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
            SPECULATIVE
          </span>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <p className="text-xs text-text-secondary">Points/Day</p>
          <p className="text-lg font-mono text-text-primary">
            {formatNumber(speculative.pointsPerDay, 0)}
          </p>
        </div>
        <div>
          <p className="text-xs text-text-secondary">Campaign Duration</p>
          <p className="text-lg font-mono text-text-primary">
            {speculative.campaignDuration} days
          </p>
        </div>
        <div>
          <p className="text-xs text-text-secondary">Total Points</p>
          <p className="text-lg font-mono text-text-primary">
            {formatNumber(speculative.totalPoints, 0)}
          </p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-border space-y-3">
        <p className="text-xs text-text-secondary font-medium">Scenarios</p>
        <ScenarioRow
          label="Conservative"
          value={speculative.scenarios.conservative}
          rate="0.004"
        />
        <ScenarioRow
          label="Base"
          value={speculative.scenarios.base}
          rate="0.01"
        />
        <ScenarioRow
          label="Bull"
          value={speculative.scenarios.bull}
          rate="0.025"
        />

        <div className="pt-2 text-xs text-text-secondary">
          <p>
            TGE Unlock: {(speculative.tgeUnlockPercent * 100).toFixed(0)}% (vested{' '}
            {speculative.vestingMonths}mo)
          </p>
        </div>
      </div>

      <button
        onClick={() => setExpanded(!expanded)}
        className="mt-3 text-xs text-primary hover:text-cyan-300 transition-colors"
      >
        {expanded ? 'Hide' : 'View Full'} Calculation
      </button>

      {expanded && (
        <div className="mt-3 pt-3 border-t border-border text-xs font-mono text-text-secondary space-y-1">
          <p>Points/Day x Duration = Total Points</p>
          <p>
            {formatNumber(speculative.pointsPerDay, 0)} x {speculative.campaignDuration} ={' '}
            {formatNumber(speculative.totalPoints, 0)}
          </p>
          <p className="mt-2">Value = Total Points x Rate/Point</p>
          <p>Conservative: {formatNumber(speculative.totalPoints, 0)} x $0.004 = {formatUsd(speculative.scenarios.conservative)}</p>
          <p>Base: {formatNumber(speculative.totalPoints, 0)} x $0.01 = {formatUsd(speculative.scenarios.base)}</p>
          <p>Bull: {formatNumber(speculative.totalPoints, 0)} x $0.025 = {formatUsd(speculative.scenarios.bull)}</p>
        </div>
      )}
    </Card>
  );
}

function ScenarioRow({
  label,
  value,
  rate,
}: {
  label: string;
  value: number;
  rate: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-text-secondary">{label}</span>
      <div className="flex items-center gap-3">
        <span className="text-xs font-mono text-text-secondary">(${rate}/point)</span>
        <span className="text-sm font-mono text-text-primary">{formatUsd(value)}</span>
      </div>
    </div>
  );
}
