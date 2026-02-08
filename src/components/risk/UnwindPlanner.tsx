'use client';

import { useRiskLabStore, useStrategyStore } from '@/lib/store';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatUsd } from '@/lib/utils';

export function UnwindPlanner() {
  const result = useStrategyStore((s) => s.result);
  const { unwindPlan, runUnwindPlan } = useRiskLabStore();

  if (!result) return null;

  return (
    <Card glow>
      <CardHeader title="Unwind to Safety" subtitle="Recovery options" />

      <Button
        onClick={() => runUnwindPlan(result)}
        variant="secondary"
        size="sm"
        className="mb-4"
      >
        Show Unwind Plan
      </Button>

      {unwindPlan && (
        <div className="space-y-4">
          <div className="flex items-center gap-4 text-xs text-text-secondary">
            <span>
              Current HF: <span className="font-mono text-text-primary">{unwindPlan.currentHf.toFixed(2)}</span>
            </span>
            <span>→</span>
            <span>
              Target HF: <span className="font-mono text-primary">{unwindPlan.targetHf.toFixed(2)}</span>
            </span>
          </div>

          <div className="space-y-3">
            {unwindPlan.options.map((opt, i) => (
              <div
                key={opt.type}
                className="p-3 bg-background border border-border rounded-lg space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-text-primary">
                    Option {i + 1}: {opt.label}
                  </span>
                  <span className="text-xs font-mono text-text-secondary">
                    Gas: ~{formatUsd(opt.gasCost)}
                  </span>
                </div>
                <p className="text-xs text-text-secondary">{opt.description}</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-text-secondary">Result:</span>
                  <span className="text-xs font-mono text-primary">
                    HF {opt.resultingHf.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
