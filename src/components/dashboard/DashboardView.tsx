"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { ProjectCard } from "./ProjectCard";
import { WarningBanner } from "@/components/ui/WarningBanner";
import { DetailsView } from "@/components/details/DetailsView";
import { Search } from "lucide-react";
import { t } from "@/lib/i18n";

export function DashboardView() {
  const projects = useAppStore((s) => s.projects);
  const selectedId = useAppStore((s) => s.selectedProjectId);
  const setSelected = useAppStore((s) => s.setSelected);
  const lang = useAppStore((s) => s.lang);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "ended" | "upcoming">("all");

  if (selectedId) {
    const proj = projects.find((p) => p.id === selectedId);
    if (proj) return <DetailsView project={proj} />;
  }

  const filtered = projects.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.network.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || p.status === filter;
    return matchSearch && matchFilter;
  });

  const filterLabels = {
    all: t("dash.all", lang),
    active: t("dash.active", lang),
    ended: t("dash.ended", lang),
    upcoming: t("dash.upcoming", lang),
  };

  return (
    <div className="space-y-6">
      <WarningBanner>{t("dash.warning", lang)}</WarningBanner>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("dash.search", lang)}
            className="w-full bg-surface border border-border rounded-lg pl-9 pr-3 py-2 text-sm text-text
              placeholder:text-text-muted focus:outline-none focus:border-border-focus transition-colors"
          />
        </div>
        <div className="flex gap-1">
          {(["all", "active", "ended", "upcoming"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-2 text-xs font-medium rounded-lg transition-colors capitalize ${
                filter === f
                  ? "bg-brand/15 text-brand"
                  : "text-text-muted hover:text-text-soft hover:bg-raised"
              }`}
            >
              {filterLabels[f]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((p) => (
          <ProjectCard
            key={p.id}
            project={p}
            onClick={() => setSelected(p.id)}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-text-muted text-sm">
          {t("dash.noProjects", lang)}
        </div>
      )}
    </div>
  );
}
