"use client";

import { useState, useMemo } from "react";
import { Project } from "@/lib/types";
import { calcMetrics } from "@/lib/engine";
import { useAppStore } from "@/lib/store";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Stat } from "@/components/ui/Stat";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Toggle } from "@/components/ui/Toggle";
import { ArrowLeft, Info, FileText, Calculator, Target, TrendingUp } from "lucide-react";
import { t } from "@/lib/i18n";

function fmt(n: number, d = 2): string {
  if (n >= 1e12) return (n / 1e12).toFixed(d) + "T";
  if (n >= 1e9) return (n / 1e9).toFixed(d) + "B";
  if (n >= 1e6) return (n / 1e6).toFixed(d) + "M";
  if (n >= 1e3) return (n / 1e3).toFixed(d) + "K";
  return n.toFixed(d);
}

function fmtVpp(n: number): string {
  if (n < 0.0001) return "$" + n.toExponential(2);
  if (n < 0.01) return "$" + n.toFixed(6);
  return "$" + n.toFixed(4);
}

export function DetailsView({ project }: { project: Project }) {
  const setSelected = useAppStore((s) => s.setSelected);
  const lang = useAppStore((s) => s.lang);
  const m = useMemo(() => calcMetrics(project), [project]);

  const [useApprox, setUseApprox] = useState(false);
  const [userPoints, setUserPoints] = useState("1000000");
  const [roiResult, setRoiResult] = useState<{ value: number; tge: number } | null>(null);

  const handleCalcRoi = () => {
    const pts = parseFloat(userPoints) || 0;
    const vpp = useApprox ? m.va : m.vc;
    const value = pts * vpp;
    setRoiResult({ value, tge: value * 0.2 });
  };

  const statusVariant =
    project.status === "active" ? "green" : project.status === "ended" ? "red" : "amber";
  const statusLabel = t(`status.${project.status}` as "status.active" | "status.ended" | "status.upcoming", lang);

  const scenarioConservative = { totalPts: m.tc, vpp: m.vc, dailyPts: m.dc, ppt: m.ptc };
  const scenarioApprox = { totalPts: m.ta, vpp: m.va, dailyPts: m.da, ppt: m.pta };

  return (
    <div className="space-y-6">
      <button
        onClick={() => setSelected(null)}
        className="flex items-center gap-1.5 text-sm text-text-muted hover:text-text transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        {t("detail.back", lang)}
      </button>

      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-brand/15 text-brand flex items-center justify-center text-xl font-bold shrink-0">
          {project.name[0]}
        </div>
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h1 className="text-xl font-bold text-text">{project.name}</h1>
            <Badge variant="brand">{project.season}</Badge>
            <Badge variant={statusVariant}>{statusLabel}</Badge>
            <Badge variant="muted">{project.nc}</Badge>
          </div>
          <p className="text-sm text-text-muted">{project.desc}</p>
        </div>
      </div>

      {project.notice && (
        <Card className="border-amber/30 bg-amber/5">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-amber mt-0.5 shrink-0" />
            <p className="text-sm text-amber/90">{project.notice}</p>
          </div>
        </Card>
      )}

      {project.projDesc && (
        <Card>
          <div className="flex items-start gap-2">
            <FileText className="w-4 h-4 text-text-muted mt-0.5 shrink-0" />
            <p className="text-sm text-text-soft leading-relaxed">{project.projDesc}</p>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-green/10 border border-green/20 rounded-xl p-5">
          <div className="text-xs text-green/70 uppercase tracking-wider mb-2">
            {t("detail.vppConservativeTitle", lang)}
          </div>
          <div className="font-mono text-2xl font-bold text-green mb-1">
            {fmtVpp(m.vc)}
          </div>
          <div className="text-xs text-green/60">
            {t("detail.basedOn", lang)} {fmt(m.tc)} {t("detail.totalProjectedPts", lang)}
          </div>
        </div>
        <div className="bg-purple/10 border border-purple/20 rounded-xl p-5">
          <div className="text-xs text-purple/70 uppercase tracking-wider mb-2">
            {t("detail.vppApproxTitle", lang)}
          </div>
          <div className="font-mono text-2xl font-bold text-purple mb-1">
            {fmtVpp(m.va)}
          </div>
          <div className="text-xs text-purple/60">
            {t("detail.basedOn", lang)} {fmt(m.ta)} {t("detail.totalEstimatedPts", lang)}
          </div>
        </div>
      </div>

      <SectionTitle icon={<TrendingUp className="w-4 h-4" />}>{t("detail.metrics", lang)}</SectionTitle>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat label={t("detail.airdropSupply", lang)} value={fmt(m.as)} />
        <Stat label={t("detail.airdropValue", lang)} value={"$" + fmt(m.av)} color="text-green" />
        <Stat label={t("detail.daysRemaining", lang)} value={m.d.toString()} color="text-amber" />
        <Stat label="FDV" value={"$" + fmt(project.fdv)} />
        <Stat label="TVL" value={"$" + fmt(project.tvl)} />
        <Stat label={t("detail.tokenValue", lang)} value={"$" + project.tokenValue.toFixed(2)} />
        <Stat label="Airdrop %" value={project.airdropPercent + "%"} color="text-brand" />
        <Stat label={t("detail.currentPoints", lang)} value={fmt(project.currentPoints)} />
      </div>

      <SectionTitle icon={<Calculator className="w-4 h-4" />}>
        {t("detail.roiSimulator", lang)}
      </SectionTitle>
      <Card>
        <div className="space-y-4">
          <Toggle
            label={useApprox ? t("detail.usingApprox", lang) : t("detail.usingConservative", lang)}
            checked={useApprox}
            onChange={setUseApprox}
          />
          <div className="flex gap-3 items-end">
            <Input
              label={t("detail.yourPoints", lang)}
              value={userPoints}
              onChange={setUserPoints}
              type="number"
              className="flex-1"
            />
            <Button onClick={handleCalcRoi}>{t("detail.calculate", lang)}</Button>
          </div>
          {roiResult && (
            <div className="grid grid-cols-2 gap-3 mt-3">
              <Stat
                label={t("detail.estimatedValue", lang)}
                value={"$" + roiResult.value.toFixed(2)}
                color="text-green"
              />
              <Stat
                label={t("detail.tgeUnlock", lang)}
                value={"$" + roiResult.tge.toFixed(2)}
                color="text-amber"
              />
            </div>
          )}
        </div>
      </Card>

      <SectionTitle icon={<Target className="w-4 h-4" />}>
        {t("detail.pointScenarios", lang)}
      </SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-green/20">
          <h3 className="text-xs text-green font-semibold uppercase tracking-wider mb-3">
            {t("detail.conservative", lang)}
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <Stat label={t("detail.totalPoints", lang)} value={fmt(scenarioConservative.totalPts)} />
            <Stat label="VPP" value={fmtVpp(scenarioConservative.vpp)} color="text-green" />
            <Stat label={t("detail.dailyPoints", lang)} value={fmt(scenarioConservative.dailyPts)} />
            <Stat label={t("detail.pointsToken", lang)} value={fmt(scenarioConservative.ppt)} />
          </div>
        </Card>
        <Card className="border-purple/20">
          <h3 className="text-xs text-purple font-semibold uppercase tracking-wider mb-3">
            {t("detail.approximate", lang)}
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <Stat label={t("detail.totalPoints", lang)} value={fmt(scenarioApprox.totalPts)} />
            <Stat label="VPP" value={fmtVpp(scenarioApprox.vpp)} color="text-purple" />
            <Stat label={t("detail.dailyPoints", lang)} value={fmt(scenarioApprox.dailyPts)} />
            <Stat label={t("detail.pointsToken", lang)} value={fmt(scenarioApprox.ppt)} />
          </div>
        </Card>
      </div>

      <Card>
        <SectionTitle className="mb-3">{t("detail.scoringStatus", lang)}</SectionTitle>
        <div className="grid grid-cols-3 gap-3">
          <Stat
            label={t("detail.category", lang)}
            value={project.cat === 1 ? t("detail.defiProtocol", lang) : project.cat === 2 ? t("detail.exchange", lang) : t("detail.other", lang)}
          />
          <Stat label={t("detail.updated", lang)} value={project.updatedOn} />
          <Stat label={t("detail.seasonEnd", lang)} value={project.seasonEnd} color="text-amber" />
        </div>
      </Card>
    </div>
  );
}
