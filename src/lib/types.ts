export interface Project {
  id: string;
  name: string;
  season: string;
  status: "active" | "ended" | "upcoming";
  network: string;
  nc: string;
  desc: string;
  totalSupplyTokens: number;
  fdv: number;
  airdropPercent: number;
  tvl: number;
  tokenTicker: string;
  tokenValue: number;
  currentPoints: number;
  ppd: number;
  seasonEnd: string;
  updatedOn: string;
  notice: string;
  projDesc: string;
  cat: number;
}

export interface ProjectMetrics {
  as: number;
  av: number;
  d: number;
  tc: number;
  ta: number;
  vc: number;
  va: number;
  ptc: number;
  pta: number;
  dc: number;
  da: number;
}

export interface LiqResult {
  sv: number;
  bv: number;
  ltv: number;
  hf: number;
  lp: number;
  sp: number;
  dist: number;
  maxB: number;
  avail: number;
  net: number;
  badge: "SAFE" | "WATCH" | "DANGER";
}

export interface LoopRow {
  loop: number;
  colTk: number;
  debtTk: number;
  colUsd: number;
  debtUsd: number;
  ltv: number;
  leverage: number;
  lltvMargin: number;
  hf: number;
  liqPrice: number;
  remaining: number;
}

export interface LoopResult {
  loops: LoopRow[];
  maxLoops: number;
  maxLeverage: number;
  finalCol: number;
  finalDebt: number;
  finalHf: number;
  finalLiqPrice: number;
  liqPct: number;
  aprValueUsd: number;
  interestValueUsd: number;
  profitLoss: number;
  roi: number;
}

export interface LoopParams {
  investmentUsd: number;
  collateralToken: string;
  debtToken: string;
  maxLtvPct: number;
  lltvPct: number;
  collateralApr: number;
  debtInterest: number;
  exposureDays: number;
  minLoopValue: number;
  safetyMargin: number;
}
