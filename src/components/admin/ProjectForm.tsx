"use client";

import { useState } from "react";
import { Project } from "@/lib/types";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Card } from "@/components/ui/Card";
import { useAppStore } from "@/lib/store";
import { t } from "@/lib/i18n";

const defaultProject: Project = {
  id: "",
  name: "",
  season: "S1",
  status: "active",
  network: "ethereum",
  nc: "Ethereum",
  desc: "",
  totalSupplyTokens: 1_000_000_000,
  fdv: 100_000_000,
  airdropPercent: 5,
  tvl: 0,
  tokenTicker: "",
  tokenValue: 0.1,
  currentPoints: 0,
  ppd: 0,
  seasonEnd: "2026-12-31",
  updatedOn: new Date().toISOString().split("T")[0],
  notice: "",
  projDesc: "",
  cat: 1,
};

export function ProjectForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: Project;
  onSave: (p: Project) => void;
  onCancel: () => void;
}) {
  const lang = useAppStore((s) => s.lang);
  const [form, setForm] = useState<Project>(initial || { ...defaultProject, id: Date.now().toString(36) });

  const set = <K extends keyof Project>(key: K, val: Project[K]) =>
    setForm((f) => ({ ...f, [key]: val }));

  const setNum = (key: keyof Project, val: string) =>
    set(key, (parseFloat(val) || 0) as never);

  const statusOptions = [
    { value: "active", label: t("status.active", lang) },
    { value: "ended", label: t("status.ended", lang) },
    { value: "upcoming", label: t("status.upcoming", lang) },
  ];

  return (
    <div className="space-y-6">
      <SectionTitle>{t("form.basicInfo", lang)}</SectionTitle>
      <Card>
        <div className="grid grid-cols-2 gap-3">
          <Input label={t("form.name", lang)} value={form.name} onChange={(v) => set("name", v)} />
          <Input label={t("form.season", lang)} value={form.season} onChange={(v) => set("season", v)} />
          <Select label={t("form.status", lang)} value={form.status} onChange={(v) => set("status", v as Project["status"])} options={statusOptions} />
          <Input label={t("form.network", lang)} value={form.network} onChange={(v) => set("network", v)} />
          <Input label={t("form.networkCat", lang)} value={form.nc} onChange={(v) => set("nc", v)} />
          <Input label={t("form.tokenTicker", lang)} value={form.tokenTicker} onChange={(v) => set("tokenTicker", v)} />
          <Input label={t("form.description", lang)} value={form.desc} onChange={(v) => set("desc", v)} className="col-span-2" />
        </div>
      </Card>

      <SectionTitle>{t("form.tokenomics", lang)}</SectionTitle>
      <Card>
        <div className="grid grid-cols-2 gap-3">
          <Input label={t("form.totalSupply", lang)} value={form.totalSupplyTokens} onChange={(v) => setNum("totalSupplyTokens", v)} type="number" />
          <Input label="FDV" value={form.fdv} onChange={(v) => setNum("fdv", v)} type="number" suffix="USD" />
          <Input label="Airdrop %" value={form.airdropPercent} onChange={(v) => setNum("airdropPercent", v)} type="number" suffix="%" />
          <Input label={t("form.tvl", lang)} value={form.tvl} onChange={(v) => setNum("tvl", v)} type="number" suffix="USD" />
          <Input label={t("form.tokenValue", lang)} value={form.tokenValue} onChange={(v) => setNum("tokenValue", v)} type="number" suffix="USD" />
          <Input label={t("form.category", lang)} value={form.cat} onChange={(v) => setNum("cat", v)} type="number" />
        </div>
      </Card>

      <SectionTitle>{t("form.points", lang)}</SectionTitle>
      <Card>
        <div className="grid grid-cols-2 gap-3">
          <Input label={t("form.currentPoints", lang)} value={form.currentPoints} onChange={(v) => setNum("currentPoints", v)} type="number" />
          <Input label={t("form.ppd", lang)} value={form.ppd} onChange={(v) => setNum("ppd", v)} type="number" />
          <Input label={t("form.seasonEnd", lang)} value={form.seasonEnd} onChange={(v) => set("seasonEnd", v)} type="date" />
          <Input label={t("form.updatedOn", lang)} value={form.updatedOn} onChange={(v) => set("updatedOn", v)} type="date" />
        </div>
      </Card>

      <SectionTitle>{t("form.descriptions", lang)}</SectionTitle>
      <Card>
        <div className="space-y-3">
          <Input label={t("form.notice", lang)} value={form.notice} onChange={(v) => set("notice", v)} />
          <Input label={t("form.projDesc", lang)} value={form.projDesc} onChange={(v) => set("projDesc", v)} />
        </div>
      </Card>

      <div className="flex gap-2">
        <Button onClick={() => onSave(form)}>
          {initial ? t("form.update", lang) : t("form.add", lang)}
        </Button>
        <Button variant="ghost" onClick={onCancel}>
          {t("form.cancel", lang)}
        </Button>
      </div>
    </div>
  );
}
