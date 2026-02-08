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

  // Point scenario cards
  const scenarioConservative = {
    totalPts: m.tc,
    vpp: m.vc,
    dailyPts: m.dc,
    ppt: m.ptc,
  };
  const scenarioApprox = {
    totalPts: m.ta,
    vpp: m.va,
    dailyPts: m.da,
    ppt: m.pta,
  };

  return (
    <div className="space-y-6">
      {/* Back button */}
      <button
        onClick={() => setSelected(null)}
        className="flex items-center gap-1.5 text-sm text-text-muted hover:text-text transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </button>

      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-brand/15 text-brand flex items-center justify-center text-xl font-bold shrink-0">
          {project.name[0]}
        </div>
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h1 className="text-xl font-bold text-text">{project.name}</h1>
            <Badge variant="brand">{project.season}</Badge>
            <Badge variant={statusVariant}>{project.status}</Badge>
            <Badge variant="muted">{project.nc}</Badge>
          </div>
          <p className="text-sm text-text-muted">{project.desc}</p>
        </div>
      </div>

      {/* Notice & Description */}
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

      {/* Big VPP Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-green/10 border border-green/20 rounded-xl p-5">
          <div className="text-xs text-green/70 uppercase tracking-wider mb-2">
            Value Per Point — Conservative
          </div>
          <div className="font-mono text-2xl font-bold text-green mb-1">
            {fmtVpp(m.vc)}
          </div>
          <div className="text-xs text-green/60">
            Based on {fmt(m.tc)} total projected points
          </div>
        </div>
        <div className="bg-purple/10 border border-purple/20 rounded-xl p-5">
          <div className="text-xs text-purple/70 uppercase tracking-wider mb-2">
            Value Per Point — Approximate
          </div>
          <div className="font-mono text-2xl font-bold text-purple mb-1">
            {fmtVpp(m.va)}
          </div>
          <div className="text-xs text-purple/60">
            Based on {fmt(m.ta)} total estimated points (80%)
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <SectionTitle icon={<TrendingUp className="w-4 h-4" />}>Metrics</SectionTitle>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat label="Airdrop Supply" value={fmt(m.as)} />
        <Stat label="Airdrop Value" value={"$" + fmt(m.av)} color="text-green" />
        <Stat label="Days Remaining" value={m.d.toString()} color="text-amber" />
        <Stat label="FDV" value={"$" + fmt(project.fdv)} />
        <Stat label="TVL" value={"$" + fmt(project.tvl)} />
        <Stat label="Token Value" value={"$" + project.tokenValue.toFixed(2)} />
        <Stat label="Airdrop %" value={project.airdropPercent + "%"} color="text-brand" />
        <Stat label="Current Points" value={fmt(project.currentPoints)} />
      </div>

      {/* ROI Simulator */}
      <SectionTitle icon={<Calculator className="w-4 h-4" />}>
        ROI Simulator
      </SectionTitle>
      <Card>
        <div className="space-y-4">
          <Toggle
            label={useApprox ? "Using Approximate Scenario" : "Using Conservative Scenario"}
            checked={useApprox}
            onChange={setUseApprox}
          />
          <div className="flex gap-3 items-end">
            <Input
              label="Your Points"
              value={userPoints}
              onChange={setUserPoints}
              type="number"
              className="flex-1"
            />
            <Button onClick={handleCalcRoi}>Calculate</Button>
          </div>
          {roiResult && (
            <div className="grid grid-cols-2 gap-3 mt-3">
              <Stat
                label="Estimated Value"
                value={"$" + roiResult.value.toFixed(2)}
                color="text-green"
              />
              <Stat
                label="TGE Unlock (20%)"
                value={"$" + roiResult.tge.toFixed(2)}
                color="text-amber"
              />
            </div>
          )}
        </div>
      </Card>

      {/* Point Scenarios */}
      <SectionTitle icon={<Target className="w-4 h-4" />}>
        Point Scenarios
      </SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-green/20">
          <h3 className="text-xs text-green font-semibold uppercase tracking-wider mb-3">
            Conservative
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <Stat label="Total Points" value={fmt(scenarioConservative.totalPts)} />
            <Stat label="VPP" value={fmtVpp(scenarioConservative.vpp)} color="text-green" />
            <Stat label="Daily Points" value={fmt(scenarioConservative.dailyPts)} />
            <Stat label="Points/Token" value={fmt(scenarioConservative.ppt)} />
          </div>
        </Card>
        <Card className="border-purple/20">
          <h3 className="text-xs text-purple font-semibold uppercase tracking-wider mb-3">
            Approximate
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <Stat label="Total Points" value={fmt(scenarioApprox.totalPts)} />
            <Stat label="VPP" value={fmtVpp(scenarioApprox.vpp)} color="text-purple" />
            <Stat label="Daily Points" value={fmt(scenarioApprox.dailyPts)} />
            <Stat label="Points/Token" value={fmt(scenarioApprox.ppt)} />
          </div>
        </Card>
      </div>

      {/* Scoring Status */}
      <Card>
        <SectionTitle className="mb-3">Scoring Status</SectionTitle>
        <div className="grid grid-cols-3 gap-3">
          <Stat
            label="Category"
            value={project.cat === 1 ? "DeFi Protocol" : project.cat === 2 ? "Exchange" : "Other"}
          />
          <Stat label="Updated" value={project.updatedOn} />
          <Stat label="Season End" value={project.seasonEnd} color="text-amber" />
        </div>
      </Card>
    </div>
  );
}
