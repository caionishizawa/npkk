// ========================
// Core Domain Types
// ========================

export type Network = 'arbitrum' | 'ethereum' | 'base' | 'optimism' | 'polygon';

export type Protocol = 'aave-v3' | 'morpho-blue' | 'compound-v3' | 'spark' | 'radiant' | 'custom';

export type SafetyBadge = 'SAFE' | 'WATCH' | 'DANGER';

export type SafetyScore = 'PASS' | 'MARGINAL' | 'FAIL';

export interface Market {
  id: string;
  collateralToken: string;
  debtToken: string;
  supplyApy: number;
  borrowApy: number;
  liquidationThreshold: number;
  maxLtv: number;
  incentivesSupply: number;
  incentivesBorrow: number;
  stakingYield: number; // for LSTs like wstETH
  hasPointsCampaign: boolean;
  pointsPerDollarPerDay: number;
}

export interface NetworkInfo {
  id: Network;
  name: string;
  avgGasCost: number; // in USD
  color: string;
}

export interface ProtocolInfo {
  id: Protocol;
  name: string;
  markets: Market[];
}

// ========================
// Strategy Builder Types
// ========================

export interface SimpleInputs {
  network: Network;
  protocol: Protocol;
  marketId: string;
  capital: number;
  capitalInToken: boolean;
  riskTolerance: number; // 15-35%, maps to stress survival
}

export interface ProInputs {
  targetLtv: number;
  minHealthFactor: number;
  borrowSpikeBuffer: number;
  slippageFees: number;
  liquidationBonus: number;
  depegHaircut: number;
  loopStopThreshold: number;
  oracleConfidence: 'high' | 'medium' | 'low';
}

export interface StrategyInputs extends SimpleInputs {
  pro?: ProInputs;
}

export interface StrategyResult {
  // Returns
  netRoeOrganic: number;
  supplyApy: number;
  borrowCost: number;
  protocolRewards: number;
  feesSlippage: number;

  // Position Details
  effectiveLeverage: number;
  collateralValue: number;
  debtValue: number;
  netExposure: number;
  loopIterations: number;
  gasCostEstimated: number;

  // Risk Metrics
  healthFactor: number;
  distanceToLiquidation: number;
  liquidationPrice: number;
  currentPrice: number;
  safetyBadge: SafetyBadge;

  // Speculative
  speculative?: SpeculativeResult;
}

export interface SpeculativeResult {
  pointsPerDay: number;
  campaignDuration: number;
  totalPoints: number;
  scenarios: {
    conservative: number;
    base: number;
    bull: number;
  };
  tgeUnlockPercent: number;
  vestingMonths: number;
}

// ========================
// Risk Lab Types
// ========================

export interface StressTestResult {
  newHealthFactor: number;
  newDistanceToLiq: number;
  newSafetyBadge: SafetyBadge;
  previousHealthFactor: number;
  previousDistanceToLiq: number;
}

export interface UnwindOption {
  type: 'repay_debt' | 'add_collateral' | 'partial_deleverage';
  label: string;
  description: string;
  amount: number;
  unit: string;
  resultingHf: number;
  gasCost: number;
}

export interface UnwindPlan {
  currentHf: number;
  targetHf: number;
  options: UnwindOption[];
}

export interface BreakevenAnalysis {
  breakevenBorrowRate: number;
  currentBorrowRate: number;
  safetyMargin: number;
}

export interface RoeVsLtvPoint {
  ltv: number;
  roe: number;
  hf: number;
  distance: number;
  leverage: number;
}

// ========================
// Compare Types
// ========================

export interface CompareStrategy {
  id: string;
  name: string;
  inputs: StrategyInputs;
  result: StrategyResult;
  rar: number;
  safetyScore: SafetyScore;
}

export type CompareSortKey = 'rar' | 'roe' | 'safety' | 'speculative';

// ========================
// Points Calculator Types
// ========================

export interface PointsInputs {
  protocol: Protocol;
  campaignName: string;
  pointsPerDay: number;
  duration: number;
  multiplier: number;
  totalPointsMin: number;
  totalPointsMax: number;
  fdvConservative: number;
  fdvBase: number;
  fdvBull: number;
  airdropPercent: number;
  sybilDiscount: number;
  perWalletCap: number | null;
  tgeUnlockPercent: number;
  vestingMonths: number;
}

export interface PointsScenarioResult {
  label: string;
  fdv: number;
  poolUsd: number;
  vppMin: number;
  vppMax: number;
  valueMin: number;
  valueMax: number;
  tgeUnlockMin: number;
  tgeUnlockMax: number;
}

export interface PointsResult {
  totalPoints: number;
  scenarios: PointsScenarioResult[];
}
