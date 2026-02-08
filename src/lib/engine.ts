import type {
  SafetyBadge,
  SafetyScore,
  StrategyResult,
  StressTestResult,
  UnwindPlan,
  UnwindOption,
  BreakevenAnalysis,
  RoeVsLtvPoint,
  PointsInputs,
  PointsResult,
  PointsScenarioResult,
  Market,
  ProInputs,
} from './types';

// ========================
// A) Exposure Multiplier
// ========================
export function calculateMultiplier(ltvUsed: number): number {
  if (ltvUsed >= 1) return Infinity;
  if (ltvUsed <= 0) return 1;
  return 1 / (1 - ltvUsed);
}

// ========================
// B) Net ROE (Organic)
// ========================
export function calculateNetRoe(
  supplyApy: number,
  borrowApy: number,
  multiplier: number,
  incentivesSupply: number = 0,
  incentivesBorrow: number = 0,
  fees: number = 0
): number {
  return (
    supplyApy * multiplier -
    borrowApy * (multiplier - 1) +
    incentivesSupply +
    incentivesBorrow -
    fees
  );
}

// ========================
// C) Health Factor
// ========================
export function calculateHealthFactor(
  collateralValue: number,
  debtValue: number,
  liquidationThreshold: number
): number {
  if (debtValue === 0) return Infinity;
  return (collateralValue * liquidationThreshold) / debtValue;
}

// ========================
// D) Liquidation Price
// ========================
export function calculateLiquidationPrice(
  debtValue: number,
  collateralAmount: number,
  liquidationThreshold: number
): number {
  if (collateralAmount * liquidationThreshold === 0) return 0;
  return debtValue / (collateralAmount * liquidationThreshold);
}

// ========================
// E) Distance to Liquidation
// ========================
export function calculateDistanceToLiquidation(
  currentPrice: number,
  liquidationPrice: number
): number {
  if (currentPrice <= 0) return 0;
  return (currentPrice - liquidationPrice) / currentPrice;
}

// ========================
// F) Break-even Borrow Rate
// ========================
export function calculateBreakevenBorrowRate(
  supplyApy: number,
  multiplier: number,
  incentivesSupply: number = 0,
  incentivesBorrow: number = 0,
  fees: number = 0
): number {
  const denominator = multiplier - 1;
  if (denominator <= 0) return Infinity;
  const numerator =
    supplyApy * multiplier + incentivesSupply + incentivesBorrow - fees;
  return numerator / denominator;
}

// ========================
// G) Risk-Adjusted Return
// ========================
export function calculateRar(
  netRoe: number,
  distanceToLiqPercent: number
): number {
  if (distanceToLiqPercent <= 0) return netRoe > 0 ? Infinity : 0;
  return netRoe / distanceToLiqPercent;
}

// ========================
// H) Points Valuation
// ========================
export function calculatePointsValue(inputs: PointsInputs): PointsResult {
  let totalPoints = inputs.pointsPerDay * inputs.duration * inputs.multiplier;

  if (inputs.sybilDiscount > 0) {
    totalPoints *= 1 - inputs.sybilDiscount;
  }
  if (inputs.perWalletCap && totalPoints > inputs.perWalletCap) {
    totalPoints = inputs.perWalletCap;
  }

  const fdvScenarios = [
    { label: 'Conservative', fdv: inputs.fdvConservative },
    { label: 'Base', fdv: inputs.fdvBase },
    { label: 'Bull', fdv: inputs.fdvBull },
  ];

  const scenarios: PointsScenarioResult[] = fdvScenarios.map(({ label, fdv }) => {
    const poolUsd = fdv * inputs.airdropPercent;
    const vppMin = poolUsd / inputs.totalPointsMax;
    const vppMax = poolUsd / inputs.totalPointsMin;
    const valueMin = totalPoints * vppMin;
    const valueMax = totalPoints * vppMax;

    return {
      label,
      fdv,
      poolUsd,
      vppMin,
      vppMax,
      valueMin,
      valueMax,
      tgeUnlockMin: valueMin * inputs.tgeUnlockPercent,
      tgeUnlockMax: valueMax * inputs.tgeUnlockPercent,
    };
  });

  return { totalPoints, scenarios };
}

// ========================
// Safety Badge Logic
// ========================
export function getSafetyBadge(hf: number, distance: number): SafetyBadge {
  if (hf > 1.4 && distance > 0.3) return 'SAFE';
  if (hf < 1.15 || distance < 0.15) return 'DANGER';
  return 'WATCH';
}

// ========================
// Safety Score (for Compare)
// ========================
export function getSafetyScore(hfAfterStress: number): SafetyScore {
  if (hfAfterStress >= 1.15) return 'PASS';
  if (hfAfterStress >= 1.10) return 'MARGINAL';
  return 'FAIL';
}

// ========================
// Full Strategy Calculation
// ========================
export function calculateStrategy(
  market: Market,
  capital: number,
  currentPrice: number,
  pro?: ProInputs
): StrategyResult {
  const targetLtv = pro?.targetLtv ?? 0.7;
  const slippageFees = pro?.slippageFees ?? 0.003;

  const multiplier = calculateMultiplier(targetLtv);
  const collateralValue = capital * multiplier;
  const debtValue = collateralValue - capital;
  const collateralAmount = collateralValue / currentPrice;

  const supplyApy = market.supplyApy + market.stakingYield;
  const netRoe = calculateNetRoe(
    supplyApy,
    market.borrowApy,
    multiplier,
    market.incentivesSupply,
    market.incentivesBorrow,
    slippageFees
  );

  const hf = calculateHealthFactor(
    collateralValue,
    debtValue,
    market.liquidationThreshold
  );

  const liqPrice = calculateLiquidationPrice(
    debtValue,
    collateralAmount,
    market.liquidationThreshold
  );

  const distance = calculateDistanceToLiquidation(currentPrice, liqPrice);
  const badge = getSafetyBadge(hf, distance);

  // Estimate loop iterations: log(minAmount/capital) / log(ltv)
  const minLoopAmount = 10; // $10 minimum worthwhile loop
  const loopIterations = Math.ceil(
    Math.log(minLoopAmount / capital) / Math.log(targetLtv)
  );

  const gasCostEstimated = loopIterations * 2; // rough $2 per loop on Arbitrum

  const result: StrategyResult = {
    netRoeOrganic: netRoe,
    supplyApy,
    borrowCost: market.borrowApy,
    protocolRewards: market.incentivesSupply + market.incentivesBorrow,
    feesSlippage: slippageFees,
    effectiveLeverage: multiplier,
    collateralValue,
    debtValue,
    netExposure: capital,
    loopIterations,
    gasCostEstimated,
    healthFactor: hf,
    distanceToLiquidation: distance,
    liquidationPrice: liqPrice,
    currentPrice,
    safetyBadge: badge,
  };

  if (market.hasPointsCampaign) {
    const pointsPerDay = market.pointsPerDollarPerDay * collateralValue;
    const campaignDuration = 90;
    const totalPoints = pointsPerDay * campaignDuration;
    result.speculative = {
      pointsPerDay,
      campaignDuration,
      totalPoints,
      scenarios: {
        conservative: totalPoints * 0.004,
        base: totalPoints * 0.01,
        bull: totalPoints * 0.025,
      },
      tgeUnlockPercent: 0.2,
      vestingMonths: 12,
    };
  }

  return result;
}

// ========================
// Stress Testing
// ========================
export function stressTest(
  result: StrategyResult,
  priceDrop: number = 0,
  borrowSpike: number = 0,
  depeg: number = 0
): StressTestResult {
  const newPrice = result.currentPrice * (1 - priceDrop);
  const newCollateralValue = result.collateralValue * (1 - priceDrop) * (1 - depeg);
  // Borrow spike increases debt slightly due to accrued interest
  const newDebt = result.debtValue * (1 + borrowSpike * 0.1);

  const lt = result.debtValue > 0
    ? (result.healthFactor * result.debtValue) / result.collateralValue
    : 0.8;

  const newHf = calculateHealthFactor(newCollateralValue, newDebt, lt);

  const collateralAmount = result.collateralValue / result.currentPrice;
  const newLiqPrice = calculateLiquidationPrice(newDebt, collateralAmount * (1 - depeg), lt);
  const newDistance = calculateDistanceToLiquidation(newPrice, newLiqPrice);

  return {
    newHealthFactor: newHf,
    newDistanceToLiq: newDistance,
    newSafetyBadge: getSafetyBadge(newHf, newDistance),
    previousHealthFactor: result.healthFactor,
    previousDistanceToLiq: result.distanceToLiquidation,
  };
}

// ========================
// Unwind Planner
// ========================
export function calculateUnwindPlan(
  result: StrategyResult,
  currentHf: number,
  targetHf: number = 1.4
): UnwindPlan {
  const lt = result.debtValue > 0
    ? (result.healthFactor * result.debtValue) / result.collateralValue
    : 0.8;

  const options: UnwindOption[] = [];

  // Option 1: Repay debt
  // targetHf = (C * LT) / (D - repay) => repay = D - (C * LT / targetHf)
  const repayAmount = result.debtValue - (result.collateralValue * lt) / targetHf;
  if (repayAmount > 0) {
    options.push({
      type: 'repay_debt',
      label: 'Repay Debt',
      description: `Repay $${formatNum(repayAmount)} to reach HF ${targetHf.toFixed(2)}`,
      amount: repayAmount,
      unit: 'USD',
      resultingHf: targetHf,
      gasCost: 8,
    });
  }

  // Option 2: Add collateral
  // targetHf = ((C + add) * LT) / D => add = (targetHf * D / LT) - C
  const addAmount = (targetHf * result.debtValue) / lt - result.collateralValue;
  if (addAmount > 0) {
    options.push({
      type: 'add_collateral',
      label: 'Add Collateral',
      description: `Add $${formatNum(addAmount)} collateral to reach HF ${targetHf.toFixed(2)}`,
      amount: addAmount,
      unit: 'USD',
      resultingHf: targetHf,
      gasCost: 6,
    });
  }

  // Option 3: Partial deleverage (close 2 loop cycles)
  const loopCloseAmount = result.debtValue * 0.15; // ~15% of debt
  const newDebt = result.debtValue - loopCloseAmount;
  const newCollateral = result.collateralValue - loopCloseAmount;
  const newHf = calculateHealthFactor(newCollateral, newDebt, lt);
  options.push({
    type: 'partial_deleverage',
    label: 'Partial Deleverage',
    description: `Close 2 loop cycles, repay $${formatNum(loopCloseAmount)}`,
    amount: loopCloseAmount,
    unit: 'USD',
    resultingHf: newHf,
    gasCost: 18,
  });

  return { currentHf, targetHf, options };
}

// ========================
// Break-even Analysis
// ========================
export function calculateBreakevenAnalysis(
  result: StrategyResult,
  market: Market,
  multiplier: number
): BreakevenAnalysis {
  const supplyApy = market.supplyApy + market.stakingYield;
  const breakevenRate = calculateBreakevenBorrowRate(
    supplyApy,
    multiplier,
    market.incentivesSupply,
    market.incentivesBorrow,
    result.feesSlippage
  );

  return {
    breakevenBorrowRate: breakevenRate,
    currentBorrowRate: market.borrowApy,
    safetyMargin: breakevenRate - market.borrowApy,
  };
}

// ========================
// ROE vs LTV Curve
// ========================
export function calculateRoeVsLtvCurve(
  market: Market,
  capital: number,
  currentPrice: number,
  steps: number = 50
): RoeVsLtvPoint[] {
  const points: RoeVsLtvPoint[] = [];
  const supplyApy = market.supplyApy + market.stakingYield;
  const maxLtv = Math.min(market.maxLtv, 0.9);

  for (let i = 0; i <= steps; i++) {
    const ltv = (i / steps) * maxLtv;
    const mult = calculateMultiplier(ltv);
    const roe = calculateNetRoe(
      supplyApy,
      market.borrowApy,
      mult,
      market.incentivesSupply,
      market.incentivesBorrow,
      0.003
    );

    const collateralValue = capital * mult;
    const debtValue = collateralValue - capital;
    const collateralAmount = collateralValue / currentPrice;
    const hf = debtValue > 0
      ? calculateHealthFactor(collateralValue, debtValue, market.liquidationThreshold)
      : Infinity;
    const liqPrice = debtValue > 0
      ? calculateLiquidationPrice(debtValue, collateralAmount, market.liquidationThreshold)
      : 0;
    const distance = debtValue > 0
      ? calculateDistanceToLiquidation(currentPrice, liqPrice)
      : 1;

    points.push({
      ltv: ltv * 100,
      roe: roe * 100,
      hf: Math.min(hf, 20),
      distance: distance * 100,
      leverage: mult,
    });
  }

  return points;
}

// ========================
// Helper
// ========================
function formatNum(n: number): string {
  return n.toLocaleString('en-US', { maximumFractionDigits: 0 });
}
