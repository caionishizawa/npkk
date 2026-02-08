import { create } from 'zustand';
import type {
  Network,
  Protocol,
  Market,
  ProInputs,
  StrategyResult,
  StressTestResult,
  CompareStrategy,
  CompareSortKey,
  PointsInputs,
  PointsResult,
} from './types';
import {
  calculateStrategy,
  stressTest,
  calculateUnwindPlan,
  calculateBreakevenAnalysis,
  calculateRoeVsLtvCurve,
  calculatePointsValue,
  calculateRar,
  getSafetyScore,
} from './engine';
import { getProtocolsForNetwork, getMarketsForProtocol, getCurrentPrice } from './data';
import type { UnwindPlan, BreakevenAnalysis, RoeVsLtvPoint } from './types';

// ========================
// Strategy Store
// ========================
interface StrategyState {
  // Inputs
  network: Network;
  protocol: Protocol;
  marketId: string;
  capital: number;
  riskTolerance: number;
  showProMode: boolean;
  pro: ProInputs;

  // Results
  result: StrategyResult | null;

  // Actions
  setNetwork: (n: Network) => void;
  setProtocol: (p: Protocol) => void;
  setMarketId: (id: string) => void;
  setCapital: (c: number) => void;
  setRiskTolerance: (r: number) => void;
  toggleProMode: () => void;
  setProField: <K extends keyof ProInputs>(key: K, val: ProInputs[K]) => void;
  calculate: (market: Market) => void;
}

export const useStrategyStore = create<StrategyState>((set, get) => ({
  network: 'arbitrum',
  protocol: 'aave-v3',
  marketId: 'aave-v3-weth-usdc',
  capital: 10000,
  riskTolerance: 25,
  showProMode: false,
  pro: {
    targetLtv: 0.70,
    minHealthFactor: 1.25,
    borrowSpikeBuffer: 0.05,
    slippageFees: 0.003,
    liquidationBonus: 0.05,
    depegHaircut: 0.02,
    loopStopThreshold: 1.15,
    oracleConfidence: 'high',
  },
  result: null,

  setNetwork: (network) => {
    const protocols = getProtocolsForNetwork(network);
    const protocol = protocols[0]?.id ?? 'aave-v3';
    const markets = getMarketsForProtocol(network, protocol);
    const marketId = markets[0]?.id ?? '';
    set({ network, protocol, marketId, result: null });
  },
  setProtocol: (protocol) => {
    const { network } = get();
    const markets = getMarketsForProtocol(network, protocol);
    const marketId = markets[0]?.id ?? '';
    set({ protocol, marketId, result: null });
  },
  setMarketId: (marketId) => set({ marketId, result: null }),
  setCapital: (capital) => set({ capital }),
  setRiskTolerance: (riskTolerance) => {
    // Map risk tolerance to target LTV
    const ltvMap: Record<number, number> = { 15: 0.60, 20: 0.65, 25: 0.70, 30: 0.75, 35: 0.80 };
    const targetLtv = ltvMap[riskTolerance] ?? 0.70;
    set((s) => ({
      riskTolerance,
      pro: { ...s.pro, targetLtv },
    }));
  },
  toggleProMode: () => set((s) => ({ showProMode: !s.showProMode })),
  setProField: (key, val) =>
    set((s) => ({ pro: { ...s.pro, [key]: val } })),
  calculate: (market) => {
    const { capital, pro, showProMode } = get();
    const price = getCurrentPrice(market.collateralToken);
    const result = calculateStrategy(
      market,
      capital,
      price,
      showProMode ? pro : { ...pro }
    );
    set({ result });
  },
}));

// ========================
// Risk Lab Store
// ========================
interface RiskLabState {
  priceDrop: number;
  borrowSpike: number;
  depeg: number;
  stressResult: StressTestResult | null;
  unwindPlan: UnwindPlan | null;
  breakeven: BreakevenAnalysis | null;
  roeLtvCurve: RoeVsLtvPoint[];

  setPriceDrop: (v: number) => void;
  setBorrowSpike: (v: number) => void;
  setDepeg: (v: number) => void;
  runStressTest: (result: StrategyResult) => void;
  runUnwindPlan: (result: StrategyResult) => void;
  runBreakeven: (result: StrategyResult, market: Market) => void;
  runRoeLtvCurve: (market: Market, capital: number) => void;
}

export const useRiskLabStore = create<RiskLabState>((set, get) => ({
  priceDrop: 0.2,
  borrowSpike: 0.05,
  depeg: 0,
  stressResult: null,
  unwindPlan: null,
  breakeven: null,
  roeLtvCurve: [],

  setPriceDrop: (priceDrop) => set({ priceDrop }),
  setBorrowSpike: (borrowSpike) => set({ borrowSpike }),
  setDepeg: (depeg) => set({ depeg }),
  runStressTest: (result) => {
    const { priceDrop, borrowSpike, depeg } = get();
    const sr = stressTest(result, priceDrop, borrowSpike, depeg);
    set({ stressResult: sr });
  },
  runUnwindPlan: (result) => {
    const { stressResult } = get();
    const currentHf = stressResult?.newHealthFactor ?? result.healthFactor;
    const plan = calculateUnwindPlan(result, currentHf);
    set({ unwindPlan: plan });
  },
  runBreakeven: (result, market) => {
    const mult = result.effectiveLeverage;
    const be = calculateBreakevenAnalysis(result, market, mult);
    set({ breakeven: be });
  },
  runRoeLtvCurve: (market, capital) => {
    const price = getCurrentPrice(market.collateralToken);
    const curve = calculateRoeVsLtvCurve(market, capital, price);
    set({ roeLtvCurve: curve });
  },
}));

// ========================
// Compare Store
// ========================
interface CompareState {
  strategies: CompareStrategy[];
  sortKey: CompareSortKey;

  addStrategy: (name: string, inputs: CompareStrategy['inputs'], result: StrategyResult) => void;
  removeStrategy: (id: string) => void;
  clearAll: () => void;
  setSortKey: (key: CompareSortKey) => void;
}

export const useCompareStore = create<CompareState>((set) => ({
  strategies: [],
  sortKey: 'rar',

  addStrategy: (name, inputs, result) => {
    const rar = calculateRar(result.netRoeOrganic * 100, result.distanceToLiquidation * 100);
    const stressHf = stressTest(result, 0.25).newHealthFactor;
    const safetyScore = getSafetyScore(stressHf);
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    set((s) => ({
      strategies: [...s.strategies, { id, name, inputs, result, rar, safetyScore }],
    }));
  },
  removeStrategy: (id) =>
    set((s) => ({ strategies: s.strategies.filter((st) => st.id !== id) })),
  clearAll: () => set({ strategies: [] }),
  setSortKey: (sortKey) => set({ sortKey }),
}));

// ========================
// Points Store
// ========================
interface PointsState {
  inputs: PointsInputs;
  result: PointsResult | null;

  setField: <K extends keyof PointsInputs>(key: K, val: PointsInputs[K]) => void;
  calculate: () => void;
}

export const usePointsStore = create<PointsState>((set, get) => ({
  inputs: {
    protocol: 'morpho-blue',
    campaignName: 'Q1 2025 Points',
    pointsPerDay: 1250,
    duration: 90,
    multiplier: 1.5,
    totalPointsMin: 50_000_000,
    totalPointsMax: 200_000_000,
    fdvConservative: 100_000_000,
    fdvBase: 250_000_000,
    fdvBull: 625_000_000,
    airdropPercent: 0.15,
    sybilDiscount: 0,
    perWalletCap: null,
    tgeUnlockPercent: 0.20,
    vestingMonths: 12,
  },
  result: null,

  setField: (key, val) =>
    set((s) => ({ inputs: { ...s.inputs, [key]: val } })),
  calculate: () => {
    const { inputs } = get();
    const result = calculatePointsValue(inputs);
    set({ result });
  },
}));

// ========================
// UI Store
// ========================
interface UIState {
  activeTab: 'strategy' | 'risk' | 'compare' | 'points';
  setActiveTab: (tab: UIState['activeTab']) => void;
}

export const useUIStore = create<UIState>((set) => ({
  activeTab: 'strategy',
  setActiveTab: (activeTab) => set({ activeTab }),
}));
