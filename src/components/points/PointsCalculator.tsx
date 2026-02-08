'use client';

import { useState } from 'react';
import { usePointsStore } from '@/lib/store';
import { Card, CardHeader } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { formatUsd, formatNumber } from '@/lib/utils';

export function PointsCalculator() {
  const { inputs, result, setField, calculate } = usePointsStore();
  const [showProSettings, setShowProSettings] = useState(false);
  const [showFormula, setShowFormula] = useState(false);

  return (
    <div className="space-y-4">
      {/* Inputs */}
      <Card glow>
        <CardHeader title="Airdrop Valuation" subtitle="Calculate your projected airdrop value" />

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Points/Day"
              value={inputs.pointsPerDay}
              onChange={(v) => setField('pointsPerDay', Number(v) || 0)}
              type="number"
            />
            <Input
              label="Campaign Duration (days)"
              value={inputs.duration}
              onChange={(v) => setField('duration', Number(v) || 0)}
              type="number"
              suffix="days"
            />
          </div>

          <Slider
            label="Points Multiplier"
            value={inputs.multiplier}
            min={1}
            max={5}
            step={0.1}
            onChange={(v) => setField('multiplier', v)}
            formatValue={(v) => `${v.toFixed(1)}x`}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Total Points (min)"
              value={inputs.totalPointsMin}
              onChange={(v) => setField('totalPointsMin', Number(v) || 0)}
              type="number"
            />
            <Input
              label="Total Points (max)"
              value={inputs.totalPointsMax}
              onChange={(v) => setField('totalPointsMax', Number(v) || 0)}
              type="number"
            />
          </div>

          <p className="text-xs text-text-secondary font-medium pt-2">FDV Scenarios</p>
          <div className="grid grid-cols-3 gap-3">
            <Input
              label="Conservative"
              value={inputs.fdvConservative}
              onChange={(v) => setField('fdvConservative', Number(v) || 0)}
              type="number"
              prefix="$"
            />
            <Input
              label="Base"
              value={inputs.fdvBase}
              onChange={(v) => setField('fdvBase', Number(v) || 0)}
              type="number"
              prefix="$"
            />
            <Input
              label="Bull"
              value={inputs.fdvBull}
              onChange={(v) => setField('fdvBull', Number(v) || 0)}
              type="number"
              prefix="$"
            />
          </div>

          <Slider
            label="Airdrop %"
            value={inputs.airdropPercent * 100}
            min={1}
            max={30}
            step={1}
            onChange={(v) => setField('airdropPercent', v / 100)}
            formatValue={(v) => `${v.toFixed(0)}%`}
          />

          <button
            onClick={() => setShowProSettings(!showProSettings)}
            className="text-xs text-text-secondary hover:text-primary transition-colors flex items-center gap-1"
          >
            <span className="font-mono">{showProSettings ? '[-]' : '[+]'}</span>
            Pro Settings
          </button>

          {showProSettings && (
            <div className="pt-3 border-t border-border grid grid-cols-2 gap-3">
              <Slider
                label="Sybil Discount"
                value={inputs.sybilDiscount * 100}
                min={0}
                max={50}
                step={5}
                onChange={(v) => setField('sybilDiscount', v / 100)}
                formatValue={(v) => `${v.toFixed(0)}%`}
              />
              <Slider
                label="TGE Unlock"
                value={inputs.tgeUnlockPercent * 100}
                min={5}
                max={100}
                step={5}
                onChange={(v) => setField('tgeUnlockPercent', v / 100)}
                formatValue={(v) => `${v.toFixed(0)}%`}
              />
              <Input
                label="Vesting (months)"
                value={inputs.vestingMonths}
                onChange={(v) => setField('vestingMonths', Number(v) || 0)}
                type="number"
                suffix="mo"
              />
            </div>
          )}

          <Button onClick={calculate} variant="primary" size="lg" className="w-full mt-2">
            Calculate Airdrop Value
          </Button>
        </div>
      </Card>

      {/* Results */}
      {result && (
        <Card glow>
          <CardHeader title="Your Projected Airdrop" subtitle="Range-based estimation" />

          <div className="mb-4">
            <p className="text-xs text-text-secondary">Total Points</p>
            <p className="text-2xl font-mono font-semibold text-primary">
              {formatNumber(result.totalPoints, 0)}
            </p>
            <p className="text-xs font-mono text-text-secondary mt-1">
              ({formatNumber(inputs.pointsPerDay, 0)} x {inputs.duration} x {inputs.multiplier})
            </p>
          </div>

          <div className="space-y-4">
            {result.scenarios.map((scenario) => (
              <div
                key={scenario.label}
                className="p-4 bg-background border border-border rounded-lg space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-text-primary">
                    {scenario.label.toUpperCase()} ({formatUsd(scenario.fdv / 1_000_000, 0)}M FDV)
                  </span>
                  <span className="text-xs font-mono text-text-secondary">
                    Pool: {formatUsd(scenario.poolUsd / 1_000_000, 1)}M
                  </span>
                </div>
                <div className="flex justify-between text-xs text-text-secondary">
                  <span>Value/Point</span>
                  <span className="font-mono">
                    ${scenario.vppMin.toFixed(3)} - ${scenario.vppMax.toFixed(3)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-text-secondary">Your Airdrop</span>
                  <span className="text-sm font-mono text-text-primary font-semibold">
                    {formatUsd(scenario.valueMin)} - {formatUsd(scenario.valueMax)}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-text-secondary">
                  <span>TGE Unlock ({(inputs.tgeUnlockPercent * 100).toFixed(0)}%)</span>
                  <span className="font-mono">
                    {formatUsd(scenario.tgeUnlockMin)} - {formatUsd(scenario.tgeUnlockMax)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-amber-500/5 border border-amber-500/20 rounded-lg">
            <p className="text-xs text-amber-400">
              Assumptions: No sybil penalty, linear distribution, TGE at FDV
            </p>
          </div>

          <button
            onClick={() => setShowFormula(!showFormula)}
            className="mt-3 text-xs text-primary hover:text-cyan-300 transition-colors"
          >
            {showFormula ? 'Hide' : 'View'} Formula Breakdown
          </button>

          {showFormula && (
            <div className="mt-3 pt-3 border-t border-border font-mono text-xs text-text-secondary space-y-3">
              <div>
                <p className="text-text-primary font-medium mb-1">1) Your points</p>
                <p>P_user = p x t x m</p>
                <p>= {formatNumber(inputs.pointsPerDay, 0)} x {inputs.duration} x {inputs.multiplier} = {formatNumber(result.totalPoints, 0)}</p>
              </div>
              {result.scenarios.map((s) => (
                <div key={s.label}>
                  <p className="text-text-primary font-medium mb-1">
                    {s.label} ({formatUsd(s.fdv / 1_000_000, 0)}M FDV)
                  </p>
                  <p>Pool = FDV x airdrop% = {formatUsd(s.fdv)} x {(inputs.airdropPercent * 100).toFixed(0)}% = {formatUsd(s.poolUsd)}</p>
                  <p>VPP_min = Pool / TP_max = {formatUsd(s.poolUsd)} / {formatNumber(inputs.totalPointsMax, 0)} = ${s.vppMin.toFixed(4)}</p>
                  <p>VPP_max = Pool / TP_min = {formatUsd(s.poolUsd)} / {formatNumber(inputs.totalPointsMin, 0)} = ${s.vppMax.toFixed(4)}</p>
                  <p>Value = {formatNumber(result.totalPoints, 0)} x ${s.vppMin.toFixed(4)}-${s.vppMax.toFixed(4)} = {formatUsd(s.valueMin)}-{formatUsd(s.valueMax)}</p>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
