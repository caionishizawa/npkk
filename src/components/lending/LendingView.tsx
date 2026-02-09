"use client";

import { useMemo, useEffect } from "react";
import { useLendingStore, useAppStore } from "@/lib/store";
import { NETWORKS, PROTOCOLS, MARKET_PAIRS, ASSETS, ASSET_PRICES } from "@/lib/data";
import { Card } from "@/components/ui/Card";
import { BigStat } from "@/components/ui/BigStat";
import { Stat } from "@/components/ui/Stat";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Toggle } from "@/components/ui/Toggle";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Badge } from "@/components/ui/Badge";
import { Shield, Trash2, Save, RotateCcw } from "lucide-react";
import { t } from "@/lib/i18n";

function fmt(n: number, d = 2): string {
  if (n >= 1e9) return "$" + (n / 1e9).toFixed(d) + "B";
  if (n >= 1e6) return "$" + (n / 1e6).toFixed(d) + "M";
  if (n >= 1e3) return "$" + (n / 1e3).toFixed(d) + "K";
  return "$" + n.toFixed(d);
}

export function LendingView() {
  const s = useLendingStore();
  const lang = useAppStore((ss) => ss.lang);
  const isCustom = s.protocol === "custom";
  const isAave = s.protocol === "aave-v3";

  const markets = useMemo(() => {
    if (isCustom) return [];
    return MARKET_PAIRS[s.protocol]?.[s.network] || [];
  }, [s.protocol, s.network, isCustom]);

  const selectedMarket = markets[s.marketIndex] || null;

  useEffect(() => {
    if (selectedMarket && !isCustom) {
      s.setSupplyAsset(selectedMarket.supply);
      s.setBorrowAsset(selectedMarket.borrow);
      s.setMaxLtv(selectedMarket.maxLtv);
      s.setLltv(selectedMarket.lltv);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [s.marketIndex, s.protocol, s.network]);

  const networkOptions = NETWORKS.map((n) => ({ value: n.id, label: n.name }));
  const assetOptions = (ASSETS[s.network] || []).map((a) => ({
    value: a,
    label: `${a} ($${ASSET_PRICES[a]?.toLocaleString() || "?"})`,
  }));
  const marketOptions = markets.map((m, i) => ({
    value: i.toString(),
    label: `${m.supply} / ${m.borrow}`,
  }));

  const badgeColor = s.result
    ? s.result.badge === "SAFE" ? "green" : s.result.badge === "WATCH" ? "amber" : "red"
    : "muted";

  const hfColor = s.result
    ? s.result.hf > 1.5 ? "text-green" : s.result.hf > 1.15 ? "text-amber" : "text-red"
    : "text-text";

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-3">
        {PROTOCOLS.map((p) => (
          <button
            key={p.id}
            onClick={() => { s.setProtocol(p.id); s.setMarketIndex(0); }}
            className={`relative bg-surface border rounded-xl p-4 text-left transition-all ${
              s.protocol === p.id ? "border-brand" : "border-border hover:border-border-focus"
            }`}
          >
            {s.protocol === p.id && (
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-brand to-purple rounded-t-xl" />
            )}
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full border-2 ${s.protocol === p.id ? "border-brand bg-brand" : "border-text-muted"}`} />
              <span className="text-sm font-medium text-text">{p.name}</span>
              {p.live && <span className="text-[10px] text-green font-mono">LIVE</span>}
            </div>
          </button>
        ))}
      </div>

      <Card>
        <div className="space-y-4">
          <Select label={t("lend.network", lang)} value={s.network} onChange={s.setNetwork} options={networkOptions} />

          {!isCustom && !isAave && markets.length > 0 && (
            <Select label={t("lend.market", lang)} value={s.marketIndex.toString()} onChange={(v) => s.setMarketIndex(parseInt(v))} options={marketOptions} />
          )}

          {(isCustom || isAave) && (
            <div className="grid grid-cols-2 gap-3">
              <Select label={t("lend.supplyAsset", lang)} value={s.supplyAsset} onChange={s.setSupplyAsset} options={assetOptions} disabled={!isCustom && !isAave} />
              <Select label={t("lend.borrowAsset", lang)} value={s.borrowAsset} onChange={s.setBorrowAsset} options={assetOptions} disabled={!isCustom && !isAave} />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <Input label={t("lend.supplyAmount", lang)} value={s.supplyAmount} onChange={(v) => s.setSupplyAmount(parseFloat(v) || 0)} type="number" suffix={`~${fmt(s.supplyAmount * (ASSET_PRICES[s.supplyAsset] || 0))}`} />
            <Input label={t("lend.borrowAmount", lang)} value={s.borrowAmount} onChange={(v) => s.setBorrowAmount(parseFloat(v) || 0)} type="number" suffix={`~${fmt(s.borrowAmount * (ASSET_PRICES[s.borrowAsset] || 0))}`} />
          </div>

          <Toggle label={t("lend.includeApy", lang)} checked={s.includeApy} onChange={s.setIncludeApy} />

          {s.includeApy && (
            <div className="grid grid-cols-2 gap-3">
              <Input label={t("lend.supplyApy", lang)} value={s.supplyApy} onChange={(v) => s.setSupplyApy(parseFloat(v) || 0)} type="number" suffix="%" />
              <Input label={t("lend.borrowApy", lang)} value={s.borrowApy} onChange={(v) => s.setBorrowApy(parseFloat(v) || 0)} type="number" suffix="%" />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <Input label="Max LTV %" value={s.maxLtv} onChange={(v) => s.setMaxLtv(parseFloat(v) || 0)} type="number" disabled={!isCustom} suffix="%" />
            <Input label="LLTV %" value={s.lltv} onChange={(v) => s.setLltv(parseFloat(v) || 0)} type="number" disabled={!isCustom} suffix="%" />
          </div>

          <div className="flex gap-2">
            <Button onClick={s.calculate} full>
              <Shield className="w-4 h-4" />
              {t("lend.calculate", lang)}
            </Button>
            <Button variant="ghost" onClick={s.reset}>
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>

      {s.result && (
        <div className="space-y-4">
          <SectionTitle icon={<Shield className="w-4 h-4" />}>{t("lend.results", lang)}</SectionTitle>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <BigStat label={t("lend.healthFactor", lang)} value={s.result.hf > 100 ? ">100" : s.result.hf.toFixed(2)} color={hfColor} sub={<Badge variant={badgeColor}>{s.result.badge}</Badge> as unknown as string} />
            <BigStat label="LTV" value={s.result.ltv.toFixed(2) + "%"} color={s.result.ltv > 80 ? "text-red" : "text-text"} />
            <BigStat label={t("lend.distToLiq", lang)} value={s.result.dist.toFixed(2) + "%"} color={s.result.dist < 20 ? "text-red" : "text-green"} />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Stat label={t("lend.supplyValue", lang)} value={fmt(s.result.sv)} color="text-green" />
            <Stat label={t("lend.borrowValue", lang)} value={fmt(s.result.bv)} color="text-red" />
            <Stat label={t("lend.netValue", lang)} value={fmt(s.result.net)} />
            <Stat label={t("lend.liqPrice", lang)} value={"$" + s.result.lp.toFixed(2)} color="text-amber" />
          </div>

          <Card>
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-text-muted">
                <span>LTV: {s.result.ltv.toFixed(1)}%</span>
                <span>LLTV: {s.lltv}%</span>
              </div>
              <div className="h-2 bg-raised rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all ${s.result.ltv > s.lltv ? "bg-red" : s.result.ltv > s.maxLtv ? "bg-amber" : "bg-green"}`} style={{ width: `${Math.min(s.result.ltv, 100)}%` }} />
              </div>
              <div className="flex justify-between text-[10px] text-text-muted">
                <span>0%</span>
                <span>Max LTV: {s.maxLtv}%</span>
                <span>100%</span>
              </div>
            </div>
          </Card>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => { const label = `${s.supplyAsset}/${s.borrowAsset} — HF ${s.result!.hf.toFixed(2)}`; s.saveOp(label); }}>
              <Save className="w-4 h-4" />
              {t("lend.saveOp", lang)}
            </Button>
          </div>
        </div>
      )}

      {s.savedOps.length > 0 && (
        <div className="space-y-3">
          <SectionTitle>{t("lend.savedOps", lang)}</SectionTitle>
          {s.savedOps.map((op) => (
            <Card key={op.id} className="flex items-center justify-between">
              <div>
                <div className="text-sm text-text font-medium">{op.label}</div>
                <div className="text-xs text-text-muted font-mono">
                  LTV: {op.result.ltv.toFixed(1)}% | HF: {op.result.hf.toFixed(2)} |{" "}
                  <Badge variant={op.result.badge === "SAFE" ? "green" : op.result.badge === "WATCH" ? "amber" : "red"}>{op.result.badge}</Badge>
                </div>
              </div>
              <button onClick={() => s.deleteOp(op.id)} className="text-text-muted hover:text-red transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
