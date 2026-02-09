"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { Project } from "@/lib/types";
import { ProjectForm } from "./ProjectForm";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Plus, Edit2, Trash2, Settings } from "lucide-react";
import { t } from "@/lib/i18n";

export function AdminView() {
  const projects = useAppStore((s) => s.projects);
  const addProject = useAppStore((s) => s.addProject);
  const updateProject = useAppStore((s) => s.updateProject);
  const deleteProject = useAppStore((s) => s.deleteProject);
  const lang = useAppStore((s) => s.lang);

  const [mode, setMode] = useState<"list" | "add" | "edit">("list");
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const editingProject = editId ? projects.find((p) => p.id === editId) : undefined;

  const handleSave = (p: Project) => {
    if (mode === "edit" && editId) {
      updateProject(editId, p);
    } else {
      addProject(p);
    }
    setMode("list");
    setEditId(null);
  };

  if (mode === "add") {
    return (
      <div className="space-y-4">
        <SectionTitle icon={<Plus className="w-4 h-4" />}>{t("admin.addNew", lang)}</SectionTitle>
        <ProjectForm onSave={handleSave} onCancel={() => setMode("list")} />
      </div>
    );
  }

  if (mode === "edit" && editingProject) {
    return (
      <div className="space-y-4">
        <SectionTitle icon={<Edit2 className="w-4 h-4" />}>
          {t("admin.edit", lang)}: {editingProject.name}
        </SectionTitle>
        <ProjectForm
          initial={editingProject}
          onSave={handleSave}
          onCancel={() => { setMode("list"); setEditId(null); }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <SectionTitle icon={<Settings className="w-4 h-4" />}>
          {t("admin.management", lang)}
        </SectionTitle>
        <Button onClick={() => setMode("add")}>
          <Plus className="w-4 h-4" />
          {t("admin.addProject", lang)}
        </Button>
      </div>

      <Card padding={false}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-raised text-text-muted text-xs uppercase tracking-wider">
                <th className="px-4 py-3 text-left">{t("admin.project", lang)}</th>
                <th className="px-4 py-3 text-left">{t("admin.season", lang)}</th>
                <th className="px-4 py-3 text-left">{t("admin.status", lang)}</th>
                <th className="px-4 py-3 text-left">{t("form.network", lang)}</th>
                <th className="px-4 py-3 text-right">FDV</th>
                <th className="px-4 py-3 text-right">TVL</th>
                <th className="px-4 py-3 text-right">Airdrop</th>
                <th className="px-4 py-3 text-center">{t("admin.actions", lang)}</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => {
                const statusVariant = p.status === "active" ? "green" : p.status === "ended" ? "red" : "amber";
                const statusLabel = t(`status.${p.status}` as "status.active" | "status.ended" | "status.upcoming", lang);
                return (
                  <tr key={p.id} className="border-t border-border hover:bg-raised/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded bg-brand/15 text-brand flex items-center justify-center text-xs font-bold">{p.name[0]}</div>
                        <span className="font-medium text-text">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-text-soft">{p.season}</td>
                    <td className="px-4 py-3"><Badge variant={statusVariant}>{statusLabel}</Badge></td>
                    <td className="px-4 py-3 text-text-soft">{p.nc}</td>
                    <td className="px-4 py-3 text-right font-mono text-text-soft">${(p.fdv / 1e6).toFixed(0)}M</td>
                    <td className="px-4 py-3 text-right font-mono text-text-soft">${(p.tvl / 1e6).toFixed(1)}M</td>
                    <td className="px-4 py-3 text-right font-mono text-text-soft">{p.airdropPercent}%</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => { setEditId(p.id); setMode("edit"); }} className="text-text-muted hover:text-brand transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        {deleteConfirm === p.id ? (
                          <div className="flex items-center gap-1">
                            <button onClick={() => { deleteProject(p.id); setDeleteConfirm(null); }} className="text-xs text-red hover:underline">{t("admin.confirm", lang)}</button>
                            <button onClick={() => setDeleteConfirm(null)} className="text-xs text-text-muted hover:underline">{t("admin.cancel", lang)}</button>
                          </div>
                        ) : (
                          <button onClick={() => setDeleteConfirm(p.id)} className="text-text-muted hover:text-red transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {projects.length === 0 && (
        <div className="text-center py-12 text-text-muted text-sm">
          {t("admin.noProjects", lang)}
        </div>
      )}
    </div>
  );
}
