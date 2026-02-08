"use client";

import { useState } from "react";
import { Project } from "@/lib/types";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Card } from "@/components/ui/Card";

const statusOptions = [
  { value: "active", label: "Active" },
  { value: "ended", label: "Ended" },
  { value: "upcoming", label: "Upcoming" },
];

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
  const [form, setForm] = useState<Project>(initial || { ...defaultProject, id: Date.now().toString(36) });

  const set = <K extends keyof Project>(key: K, val: Project[K]) =>
    setForm((f) => ({ ...f, [key]: val }));

  const setNum = (key: keyof Project, val: string) =>
    set(key, (parseFloat(val) || 0) as never);

  return (
    <div className="space-y-6">
      <SectionTitle>Basic Information</SectionTitle>
      <Card>
        <div className="grid grid-cols-2 gap-3">
          <Input label="Name" value={form.name} onChange={(v) => set("name", v)} />
          <Input label="Season" value={form.season} onChange={(v) => set("season", v)} />
          <Select
            label="Status"
            value={form.status}
            onChange={(v) => set("status", v as Project["status"])}
            options={statusOptions}
          />
          <Input label="Network" value={form.network} onChange={(v) => set("network", v)} />
          <Input label="Network Category" value={form.nc} onChange={(v) => set("nc", v)} />
          <Input label="Token Ticker" value={form.tokenTicker} onChange={(v) => set("tokenTicker", v)} />
          <Input label="Description" value={form.desc} onChange={(v) => set("desc", v)} className="col-span-2" />
        </div>
      </Card>

      <SectionTitle>Tokenomics</SectionTitle>
      <Card>
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Total Supply Tokens"
            value={form.totalSupplyTokens}
            onChange={(v) => setNum("totalSupplyTokens", v)}
            type="number"
          />
          <Input
            label="FDV"
            value={form.fdv}
            onChange={(v) => setNum("fdv", v)}
            type="number"
            suffix="USD"
          />
          <Input
            label="Airdrop %"
            value={form.airdropPercent}
            onChange={(v) => setNum("airdropPercent", v)}
            type="number"
            suffix="%"
          />
          <Input
            label="TVL"
            value={form.tvl}
            onChange={(v) => setNum("tvl", v)}
            type="number"
            suffix="USD"
          />
          <Input
            label="Token Value"
            value={form.tokenValue}
            onChange={(v) => setNum("tokenValue", v)}
            type="number"
            suffix="USD"
          />
          <Input
            label="Category"
            value={form.cat}
            onChange={(v) => setNum("cat", v)}
            type="number"
          />
        </div>
      </Card>

      <SectionTitle>Points</SectionTitle>
      <Card>
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Current Points"
            value={form.currentPoints}
            onChange={(v) => setNum("currentPoints", v)}
            type="number"
          />
          <Input
            label="Points Per Day"
            value={form.ppd}
            onChange={(v) => setNum("ppd", v)}
            type="number"
          />
          <Input
            label="Season End"
            value={form.seasonEnd}
            onChange={(v) => set("seasonEnd", v)}
            type="date"
          />
          <Input
            label="Updated On"
            value={form.updatedOn}
            onChange={(v) => set("updatedOn", v)}
            type="date"
          />
        </div>
      </Card>

      <SectionTitle>Descriptions</SectionTitle>
      <Card>
        <div className="space-y-3">
          <Input label="Notice" value={form.notice} onChange={(v) => set("notice", v)} />
          <Input label="Project Description" value={form.projDesc} onChange={(v) => set("projDesc", v)} />
        </div>
      </Card>

      <div className="flex gap-2">
        <Button onClick={() => onSave(form)}>
          {initial ? "Update Project" : "Add Project"}
        </Button>
        <Button variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
