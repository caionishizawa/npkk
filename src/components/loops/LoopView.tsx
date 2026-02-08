"use client";

import { useLoopStore } from "@/lib/store";
import { ASSET_PRICES } from "@/lib/data";
import { Card } from "@/components/ui/Card";
import { BigStat } from "@/components/ui/BigStat";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Toggle } from "@/components/ui/Toggle";
import { SectionTitle } from "@/components/ui/SectionTitle";
import {
  Repeat,
  TrendingUp,
  DollarSign,
  Percent,
  Shield,
  Activity,
  AlertTriangle,
} from "lucide-react";

function fmt(n: number, d = 2): string {
  if (Math.abs(n) >= 1e9) return "$" + (n / 1e9).toFixed(d) + "B";
  if (Math.abs(n) >= 1e6) return "$" + (n / 1e6).toFixed(d) + "M";
  if (Math.abs(n) >= 1e3) return "$" + (n / 1e3).toFixed(d) + "K";
  return "$" + n.toFixed(d);
}

const assetOptions = Object.entries(ASSET_PRICES).map(([k, v]) => ({
  value: k,
  label: `${k} ($${v.toLocaleString()})`,
}));

export function LoopView() {
  const s = useLoopStore();
  const colPrice = ASSET_PRICES[s.collateralToken] || 1;

  return (
    <div className="flex gap-6">
      {/* Sidebar */}
      <div className="w-[280px] shrink-0 sticky top-20 self-start space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1 h-5 bg-orange rounded-full" />
          <h3 className="text-sm font-semibold text-text">Parameters</h3>
        </div>

        <Toggle
          label={s.investInToken ? "Investment in Tokens" : "Investment in USD"}
          checked={s.investInToken}
          onChange={s.setInvestInToken}
        />

        <Input
          label={s.investInToken ? "Investment (tokens)" : "Investment (USD)"}
          value={s.investmentUsd}
          onChange={(v) => s.setInvestmentUsd(parseFloat(v) || 0)}
          type="number"
          suffix={s.investInToken ? s.collateralToken : "USD"}
        />

        <Select
          label={`Collateral Token ($${colPrice.toLocaleString()})`}
          value={s.collateralToken}
          onChange={s.setCollateralToken}
          options={assetOptions}
        />

        <Select
          label="Debt Token"
          value={s.debtToken}
          onChange={s.setDebtToken}
          options={assetOptions}
        />

        <Input
          label="Max LTV %"
          value={s.maxLtvPct}
          onChange={(v) => s.setMaxLtvPct(parseFloat(v) || 0)}
          type="number"
          suffix="%"
        />

        <Input
          label="LLTV %"
          value={s.lltvPct}
          onChange={(v) => s.setLltvPct(parseFloat(v) || 0)}
          type="number"
          suffix="%"
        />

        <Input
          label="Collateral APR %"
          value={s.collateralApr}
          onChange={(v) => s.setCollateralApr(parseFloat(v) || 0)}
          type="number"
          suffix="%"
        />

        <Input
          label="Debt Interest %"
          value={s.debtInterest}
          onChange={(v) => s.setDebtInterest(parseFloat(v) || 0)}
          type="number"
          suffix="%"
        />

        <Input
          label="Exposure Days"
          value={s.exposureDays}
          onChange={(v) => s.setExposureDays(parseInt(v) || 0)}
          type="number"
          suffix="days"
        />

        <Input
          label="Min Loop Value"
          value={s.minLoopValue}
          onChange={(v) => s.setMinLoopValue(parseFloat(v) || 0)}
          type="number"
          suffix="USD"
          hint="Recommended: 500-1000"
        />

        <Input
          label="Safety Margin %"
          value={s.safetyMargin}
          onChange={(v) => s.setSafetyMargin(parseFloat(v) || 0)}
          type="number"
          suffix="%"
          hint="Recommended: 3-10%"
        />

        <Button variant="orange" onClick={s.simulate} full>
          <Repeat className="w-4 h-4" />
          Simulate Loops
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-6">
        {!s.result ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Repeat className="w-12 h-12 text-text-muted mb-4" />
            <h3 className="text-lg font-semibold text-text mb-2">
              Loop Simulator
            </h3>
            <p className="text-sm text-text-muted max-w-md">
              Configure your parameters on the left and click &quot;Simulate
              Loops&quot; to see the detailed breakdown of your leveraged
              position.
            </p>
          </div>
        ) : (
          <>
            {/* Summary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <BigStat
                label="Max Loops"
                value={s.result.maxLoops.toString()}
                icon={<Repeat className="w-4 h-4" />}
                color="text-brand"
              />
              <BigStat
                label="APR Value"
                value={fmt(s.result.aprValueUsd)}
                icon={<TrendingUp className="w-4 h-4" />}
                color="text-green"
              />
              <BigStat
                label="Max Leverage"
                value={s.result.maxLeverage.toFixed(2) + "x"}
                icon={<Activity className="w-4 h-4" />}
                color="text-brand"
              />
              <BigStat
                label="Interest"
                value={fmt(s.result.interestValueUsd)}
                icon={<DollarSign className="w-4 h-4" />}
                color="text-orange"
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <BigStat
                label="Final Collateral"
                value={fmt(s.result.finalCol)}
                color="text-red"
              />
              <BigStat
                label="P&L"
                value={fmt(s.result.profitLoss)}
                color={s.result.profitLoss >= 0 ? "text-green" : "text-red"}
              />
              <BigStat
                label="Final Debt"
                value={fmt(s.result.finalDebt)}
                color="text-amber"
              />
              <BigStat
                label="ROI %"
                value={s.result.roi.toFixed(2) + "%"}
                icon={<Percent className="w-4 h-4" />}
                color="text-orange"
              />
            </div>

            {/* Risk Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div
                className={`rounded-xl p-4 border ${
                  s.result.finalHf > 1.5
                    ? "bg-green/10 border-green/20"
                    : s.result.finalHf > 1.15
                    ? "bg-amber/10 border-amber/20"
                    : "bg-red/10 border-red/20"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-wider">
                    Health Factor
                  </span>
                </div>
                <div
                  className={`font-mono text-xl font-bold ${
                    s.result.finalHf > 1.5
                      ? "text-green"
                      : s.result.finalHf > 1.15
                      ? "text-amber"
                      : "text-red"
                  }`}
                >
                  {s.result.finalHf > 100 ? ">100" : s.result.finalHf.toFixed(3)}
                </div>
              </div>

              <div className="bg-surface border border-border rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-text-muted" />
                  <span className="text-xs text-text-muted uppercase tracking-wider">
                    Liquidation Price
                  </span>
                </div>
                <div className="font-mono text-xl font-bold text-amber">
                  ${s.result.finalLiqPrice.toFixed(2)}
                </div>
              </div>

              <div className="bg-surface border border-border rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Percent className="w-4 h-4 text-text-muted" />
                  <span className="text-xs text-text-muted uppercase tracking-wider">
                    Liquidation %
                  </span>
                </div>
                <div className="font-mono text-xl font-bold text-text">
                  {s.result.liqPct.toFixed(2)}%
                </div>
              </div>
            </div>

            {/* Detail Table */}
            <SectionTitle>Details</SectionTitle>
            <Card padding={false}>
              <div className="overflow-x-auto">
                <table className="w-full text-xs font-mono">
                  <thead>
                    <tr className="bg-orange/10 text-orange">
                      <th className="px-3 py-2 text-left">#</th>
                      <th className="px-3 py-2 text-right">Col (tk)</th>
                      <th className="px-3 py-2 text-right">Debt (tk)</th>
                      <th className="px-3 py-2 text-right">Col ($)</th>
                      <th className="px-3 py-2 text-right">Debt ($)</th>
                      <th className="px-3 py-2 text-right">LTV %</th>
                      <th className="px-3 py-2 text-right">Leverage</th>
                      <th className="px-3 py-2 text-right">LLTV Margin</th>
                      <th className="px-3 py-2 text-right">HF</th>
                      <th className="px-3 py-2 text-right">Liq Price</th>
                      <th className="px-3 py-2 text-right">Remaining</th>
                    </tr>
                  </thead>
                  <tbody>
                    {s.result.loops.map((row, i) => {
                      const isLast = i === s.result!.loops.length - 1;
                      return (
                        <tr
                          key={row.loop}
                          className={`border-t border-border ${
                            isLast
                              ? "bg-orange/10 text-orange font-semibold"
                              : i % 2 === 0
                              ? "bg-surface"
                              : "bg-raised/50"
                          }`}
                        >
                          <td className="px-3 py-2">{row.loop}</td>
                          <td className="px-3 py-2 text-right">
                            {row.colTk.toFixed(4)}
                          </td>
                          <td className="px-3 py-2 text-right">
                            {row.debtTk.toFixed(4)}
                          </td>
                          <td className="px-3 py-2 text-right">
                            {fmt(row.colUsd)}
                          </td>
                          <td className="px-3 py-2 text-right">
                            {fmt(row.debtUsd)}
                          </td>
                          <td
                            className={`px-3 py-2 text-right ${
                              row.ltv > 90
                                ? "text-red"
                                : row.ltv > 80
                                ? "text-amber"
                                : ""
                            }`}
                          >
                            {row.ltv.toFixed(2)}%
                          </td>
                          <td className="px-3 py-2 text-right">
                            {row.leverage.toFixed(2)}x
                          </td>
                          <td
                            className={`px-3 py-2 text-right ${
                              row.lltvMargin < 5
                                ? "text-red"
                                : row.lltvMargin < 10
                                ? "text-amber"
                                : "text-green"
                            }`}
                          >
                            {row.lltvMargin.toFixed(2)}%
                          </td>
                          <td
                            className={`px-3 py-2 text-right ${
                              row.hf > 100
                                ? ""
                                : row.hf > 1.5
                                ? "text-green"
                                : row.hf > 1.15
                                ? "text-amber"
                                : "text-red"
                            }`}
                          >
                            {row.hf > 100 ? ">100" : row.hf.toFixed(3)}
                          </td>
                          <td className="px-3 py-2 text-right">
                            ${row.liqPrice.toFixed(2)}
                          </td>
                          <td className="px-3 py-2 text-right">
                            {fmt(row.remaining)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
