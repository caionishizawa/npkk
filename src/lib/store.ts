import { create } from "zustand";
import { Project, LiqResult, LoopResult, LoopParams } from "./types";
import { DEFAULT_PROJECTS, ASSET_PRICES } from "./data";
import { calcLiquidation, simulateLoops } from "./engine";

// ========================
// App Store
// ========================
export type ViewType = "airdrops" | "lending" | "loops" | "admin";

interface AppState {
  projects: Project[];
  view: ViewType;
  selectedProjectId: string | null;

  setView: (v: ViewType) => void;
  setSelected: (id: string | null) => void;
  addProject: (p: Project) => void;
  updateProject: (id: string, p: Partial<Project>) => void;
  deleteProject: (id: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  projects: DEFAULT_PROJECTS,
  view: "airdrops",
  selectedProjectId: null,

  setView: (view) => set({ view, selectedProjectId: null }),
  setSelected: (selectedProjectId) => set({ selectedProjectId }),
  addProject: (p) => set((s) => ({ projects: [...s.projects, p] })),
  updateProject: (id, partial) =>
    set((s) => ({
      projects: s.projects.map((p) => (p.id === id ? { ...p, ...partial } : p)),
    })),
  deleteProject: (id) =>
    set((s) => ({
      projects: s.projects.filter((p) => p.id !== id),
      selectedProjectId: s.selectedProjectId === id ? null : s.selectedProjectId,
    })),
}));

// ========================
// Lending Store
// ========================
interface SavedOp {
  id: string;
  label: string;
  result: LiqResult;
  timestamp: number;
}

interface LendingState {
  protocol: string;
  network: string;
  marketIndex: number;
  supplyAsset: string;
  borrowAsset: string;
  supplyAmount: number;
  borrowAmount: number;
  maxLtv: number;
  lltv: number;
  supplyApy: number;
  borrowApy: number;
  includeApy: boolean;
  result: LiqResult | null;
  savedOps: SavedOp[];

  setProtocol: (p: string) => void;
  setNetwork: (n: string) => void;
  setMarketIndex: (i: number) => void;
  setSupplyAsset: (a: string) => void;
  setBorrowAsset: (a: string) => void;
  setSupplyAmount: (v: number) => void;
  setBorrowAmount: (v: number) => void;
  setMaxLtv: (v: number) => void;
  setLltv: (v: number) => void;
  setSupplyApy: (v: number) => void;
  setBorrowApy: (v: number) => void;
  setIncludeApy: (v: boolean) => void;
  calculate: () => void;
  saveOp: (label: string) => void;
  deleteOp: (id: string) => void;
  reset: () => void;
}

export const useLendingStore = create<LendingState>((set, get) => ({
  protocol: "custom",
  network: "ethereum",
  marketIndex: 0,
  supplyAsset: "WETH",
  borrowAsset: "USDC",
  supplyAmount: 1,
  borrowAmount: 1000,
  maxLtv: 80,
  lltv: 86,
  supplyApy: 3,
  borrowApy: 5,
  includeApy: false,
  result: null,
  savedOps: [],

  setProtocol: (protocol) => set({ protocol, result: null }),
  setNetwork: (network) => set({ network, result: null }),
  setMarketIndex: (marketIndex) => set({ marketIndex, result: null }),
  setSupplyAsset: (supplyAsset) => set({ supplyAsset, result: null }),
  setBorrowAsset: (borrowAsset) => set({ borrowAsset, result: null }),
  setSupplyAmount: (supplyAmount) => set({ supplyAmount }),
  setBorrowAmount: (borrowAmount) => set({ borrowAmount }),
  setMaxLtv: (maxLtv) => set({ maxLtv }),
  setLltv: (lltv) => set({ lltv }),
  setSupplyApy: (supplyApy) => set({ supplyApy }),
  setBorrowApy: (borrowApy) => set({ borrowApy }),
  setIncludeApy: (includeApy) => set({ includeApy }),
  calculate: () => {
    const s = get();
    const result = calcLiquidation(
      s.supplyAmount,
      s.supplyAsset,
      s.borrowAmount,
      s.borrowAsset,
      s.maxLtv,
      s.lltv,
      s.supplyApy,
      s.borrowApy,
      s.includeApy
    );
    set({ result });
  },
  saveOp: (label) => {
    const { result, savedOps } = get();
    if (!result) return;
    const op: SavedOp = {
      id: Date.now().toString(36),
      label,
      result,
      timestamp: Date.now(),
    };
    set({ savedOps: [...savedOps, op] });
  },
  deleteOp: (id) =>
    set((s) => ({ savedOps: s.savedOps.filter((o) => o.id !== id) })),
  reset: () =>
    set({
      protocol: "custom",
      network: "ethereum",
      marketIndex: 0,
      supplyAsset: "WETH",
      borrowAsset: "USDC",
      supplyAmount: 1,
      borrowAmount: 1000,
      maxLtv: 80,
      lltv: 86,
      supplyApy: 3,
      borrowApy: 5,
      includeApy: false,
      result: null,
    }),
}));

// ========================
// Loop Store
// ========================
interface LoopState {
  investmentUsd: number;
  investInToken: boolean;
  collateralToken: string;
  debtToken: string;
  maxLtvPct: number;
  lltvPct: number;
  collateralApr: number;
  debtInterest: number;
  exposureDays: number;
  minLoopValue: number;
  safetyMargin: number;
  result: LoopResult | null;

  setInvestmentUsd: (v: number) => void;
  setInvestInToken: (v: boolean) => void;
  setCollateralToken: (t: string) => void;
  setDebtToken: (t: string) => void;
  setMaxLtvPct: (v: number) => void;
  setLltvPct: (v: number) => void;
  setCollateralApr: (v: number) => void;
  setDebtInterest: (v: number) => void;
  setExposureDays: (v: number) => void;
  setMinLoopValue: (v: number) => void;
  setSafetyMargin: (v: number) => void;
  simulate: () => void;
}

export const useLoopStore = create<LoopState>((set, get) => ({
  investmentUsd: 10000,
  investInToken: false,
  collateralToken: "wstETH",
  debtToken: "WETH",
  maxLtvPct: 86,
  lltvPct: 94.5,
  collateralApr: 3.5,
  debtInterest: 2.8,
  exposureDays: 90,
  minLoopValue: 500,
  safetyMargin: 5,
  result: null,

  setInvestmentUsd: (investmentUsd) => set({ investmentUsd }),
  setInvestInToken: (investInToken) => set({ investInToken }),
  setCollateralToken: (collateralToken) => set({ collateralToken }),
  setDebtToken: (debtToken) => set({ debtToken }),
  setMaxLtvPct: (maxLtvPct) => set({ maxLtvPct }),
  setLltvPct: (lltvPct) => set({ lltvPct }),
  setCollateralApr: (collateralApr) => set({ collateralApr }),
  setDebtInterest: (debtInterest) => set({ debtInterest }),
  setExposureDays: (exposureDays) => set({ exposureDays }),
  setMinLoopValue: (minLoopValue) => set({ minLoopValue }),
  setSafetyMargin: (safetyMargin) => set({ safetyMargin }),
  simulate: () => {
    const s = get();
    let investmentUsd = s.investmentUsd;
    if (s.investInToken) {
      const price = ASSET_PRICES[s.collateralToken] || 1;
      investmentUsd = s.investmentUsd * price;
    }
    const params: LoopParams = {
      investmentUsd,
      collateralToken: s.collateralToken,
      debtToken: s.debtToken,
      maxLtvPct: s.maxLtvPct,
      lltvPct: s.lltvPct,
      collateralApr: s.collateralApr,
      debtInterest: s.debtInterest,
      exposureDays: s.exposureDays,
      minLoopValue: s.minLoopValue,
      safetyMargin: s.safetyMargin,
    };
    const result = simulateLoops(params);
    set({ result });
  },
}));
