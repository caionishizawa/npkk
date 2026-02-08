'use client';

import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  ComposedChart,
} from 'recharts';
import { useRiskLabStore, useStrategyStore } from '@/lib/store';
import { getMarketById } from '@/lib/data';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export function RoeLtvChart() {
  const marketId = useStrategyStore((s) => s.marketId);
  const capital = useStrategyStore((s) => s.capital);
  const result = useStrategyStore((s) => s.result);
  const { roeLtvCurve, runRoeLtvCurve } = useRiskLabStore();

  const handleGenerate = () => {
    const market = getMarketById(marketId);
    if (market) runRoeLtvCurve(market, capital);
  };

  if (!result) return null;

  return (
    <Card glow>
      <CardHeader
        title="ROE vs LTV"
        subtitle="Interactive: see how leverage affects returns"
      />

      <Button onClick={handleGenerate} variant="secondary" size="sm" className="mb-4">
        Generate Chart
      </Button>

      {roeLtvCurve.length > 0 && (
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={roeLtvCurve} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E2732" />
              <XAxis
                dataKey="ltv"
                stroke="#8B949E"
                fontSize={10}
                tickFormatter={(v: number) => `${v.toFixed(0)}%`}
                label={{ value: 'LTV %', position: 'bottom', fill: '#8B949E', fontSize: 10 }}
              />
              <YAxis
                stroke="#8B949E"
                fontSize={10}
                tickFormatter={(v: number) => `${v.toFixed(0)}%`}
                label={{
                  value: 'ROE %',
                  angle: -90,
                  position: 'insideLeft',
                  fill: '#8B949E',
                  fontSize: 10,
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#151B23',
                  border: '1px solid #1E2732',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
                labelStyle={{ color: '#8B949E' }}
                formatter={(value, name) => {
                  const v = Number(value) || 0;
                  if (name === 'roe') return [`${v.toFixed(1)}%`, 'ROE'];
                  if (name === 'hf') return [v.toFixed(2), 'Health Factor'];
                  return [String(v), String(name)];
                }}
                labelFormatter={(label) => `LTV: ${Number(label).toFixed(0)}%`}
              />
              <ReferenceLine y={0} stroke="#FF3366" strokeDasharray="5 5" label="" />
              <Line
                type="monotone"
                dataKey="roe"
                stroke="#00D9FF"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: '#00D9FF', stroke: '#0A0E14', strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey="hf"
                stroke="#00FF88"
                strokeWidth={1}
                dot={false}
                strokeDasharray="3 3"
                activeDot={{ r: 3, fill: '#00FF88' }}
              />
            </ComposedChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-4 mt-2 justify-center text-[10px] text-text-secondary">
            <span className="flex items-center gap-1">
              <span className="w-3 h-0.5 bg-primary inline-block" /> ROE
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-0.5 bg-emerald-400 inline-block opacity-60" /> Health Factor
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-0.5 bg-rose-500 inline-block opacity-60" /> Break-even
            </span>
          </div>
        </div>
      )}
    </Card>
  );
}
