"use client";

import { Project } from "@/lib/types";
import { calcMetrics } from "@/lib/engine";
import { Badge } from "@/components/ui/Badge";
import { Clock } from "lucide-react";

function fmt(n: number, d = 2): string {
  if (n >= 1e12) return (n / 1e12).toFixed(d) + "T";
  if (n >= 1e9) return (n / 1e9).toFixed(d) + "B";
  if (n >= 1e6) return (n / 1e6).toFixed(d) + "M";
  if (n >= 1e3) return (n / 1e3).toFixed(d) + "K";
  return n.toFixed(d);
}

function fmtUsd(n: number): string {
  return "$" + fmt(n);
}

function fmtVpp(n: number): string {
  if (n < 0.0001) return "$" + n.toExponential(2);
  if (n < 0.01) return "$" + n.toFixed(6);
  return "$" + n.toFixed(4);
}

export function ProjectCard({
  project,
  onClick,
}: {
  project: Project;
  onClick: () => void;
}) {
  const m = calcMetrics(project);

  const statusVariant =
    project.status === "active"
      ? "green"
      : project.status === "ended"
      ? "red"
      : "amber";

  return (
    <div
      onClick={onClick}
      className="bg-surface border border-border rounded-xl p-5 hover:border-border-focus cursor-pointer transition-all group"
    >
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-brand/15 text-brand flex items-center justify-center text-lg font-bold shrink-0">
          {project.name[0]}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-semibold text-text truncate">
              {project.name}
            </h3>
            <Badge variant="brand">{project.season}</Badge>
            <Badge variant={statusVariant}>{project.status}</Badge>
          </div>
          <div className="text-xs text-text-muted mt-0.5">{project.nc}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="bg-green/10 border border-green/20 rounded-lg p-3">
          <div className="text-[10px] text-green/70 uppercase tracking-wider mb-1">
            VPP Conservative
          </div>
          <div className="font-mono text-sm font-bold text-green">
            {fmtVpp(m.vc)}
          </div>
        </div>
        <div className="bg-purple/10 border border-purple/20 rounded-lg p-3">
          <div className="text-[10px] text-purple/70 uppercase tracking-wider mb-1">
            VPP Approximate
          </div>
          <div className="font-mono text-sm font-bold text-purple">
            {fmtVpp(m.va)}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs mb-3">
        <div>
          <span className="text-text-muted">FDV</span>{" "}
          <span className="text-text-soft font-mono">{fmtUsd(project.fdv)}</span>
        </div>
        <div>
          <span className="text-text-muted">TVL</span>{" "}
          <span className="text-text-soft font-mono">{fmtUsd(project.tvl)}</span>
        </div>
        <div>
          <span className="text-text-muted">Airdrop</span>{" "}
          <span className="text-text-soft font-mono">{project.airdropPercent}%</span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 text-xs text-text-muted">
        <Clock className="w-3 h-3" />
        <span className="font-mono">{m.d}</span> days remaining
      </div>
    </div>
  );
}
