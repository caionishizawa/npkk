import { Project, ProjectMetrics, LiqResult, LoopParams, LoopResult, LoopRow } from "./types";
import { ASSET_PRICES } from "./data";

export function calcMetrics(p: Project): ProjectMetrics {
  const airdropSupply = p.totalSupplyTokens * (p.airdropPercent / 100);
  const airdropValue = airdropSupply * p.tokenValue;
  const daysRemaining = Math.max(
    0,
    Math.ceil((new Date(p.seasonEnd).getTime() - Date.now()) / 86400000)
  );
  const totalConservative = p.currentPoints + p.ppd * daysRemaining;
  const totalApproximate = totalConservative * 0.8;
  const valueConservative = airdropValue / totalConservative;
  const valueApproximate = airdropValue / totalApproximate;
  const pointsPerTokenConservative = totalConservative / airdropSupply;
  const pointsPerTokenApproximate = totalApproximate / airdropSupply;
  const dailyConservative = p.ppd;
  const dailyApproximate = p.ppd * 0.667;

  return {
    as: airdropSupply,
    av: airdropValue,
    d: daysRemaining,
    tc: totalConservative,
    ta: totalApproximate,
    vc: valueConservative,
    va: valueApproximate,
    ptc: pointsPerTokenConservative,
    pta: pointsPerTokenApproximate,
    dc: dailyConservative,
    da: dailyApproximate,
  };
}

export function calcLiquidation(
  sAmt: number,
  sAsset: string,
  bAmt: number,
  bAsset: string,
  maxLtv: number,
  lltv: number,
  sApy: number,
  bApy: number,
  includeApy: boolean
): LiqResult | null {
  const sPrice = ASSET_PRICES[sAsset];
  const bPrice = ASSET_PRICES[bAsset];
  if (!sPrice || !bPrice || sAmt <= 0) return null;

  let sv = sAmt * sPrice;
  let bv = bAmt * bPrice;

  if (includeApy) {
    sv = sv * (1 + sApy / 100);
    bv = bv * (1 + bApy / 100);
  }

  const ltv = bv > 0 ? (bv / sv) * 100 : 0;
  const hf = bv > 0 ? (sv * (lltv / 100)) / bv : 999;
  const lp = bv > 0 ? bv / (sAmt * (lltv / 100)) : 0;
  const sp = sPrice;
  const dist = sp > 0 && lp > 0 ? ((sp - lp) / sp) * 100 : 100;
  const maxB = (sv * (maxLtv / 100)) / bPrice;
  const avail = maxB - bAmt;
  const net = sv - bv;

  let badge: "SAFE" | "WATCH" | "DANGER";
  if (hf > 1.5) badge = "SAFE";
  else if (hf > 1.15) badge = "WATCH";
  else badge = "DANGER";

  return { sv, bv, ltv, hf, lp, sp, dist, maxB, avail, net, badge };
}

export function simulateLoops(params: LoopParams): LoopResult {
  const {
    investmentUsd,
    collateralToken,
    debtToken,
    lltvPct,
    collateralApr,
    debtInterest,
    exposureDays,
    minLoopValue,
    safetyMargin,
  } = params;

  const colPrice = ASSET_PRICES[collateralToken] || 1;
  const debtPrice = ASSET_PRICES[debtToken] || 1;
  const effectiveLtv = lltvPct / 100 - safetyMargin / 100;

  const loops: LoopRow[] = [];
  let totalColTk = 0;
  let totalDebtTk = 0;
  let totalColUsd = 0;
  let totalDebtUsd = 0;

  const initialColTk = investmentUsd / colPrice;
  totalColTk = initialColTk;
  totalColUsd = totalColTk * colPrice;

  loops.push({
    loop: 1,
    colTk: initialColTk,
    debtTk: 0,
    colUsd: totalColUsd,
    debtUsd: 0,
    ltv: 0,
    leverage: 1,
    lltvMargin: lltvPct,
    hf: 999,
    liqPrice: 0,
    remaining: investmentUsd,
  });

  for (let i = 2; i <= 50; i++) {
    const borrowCapacityUsd = totalColUsd * effectiveLtv - totalDebtUsd;
    if (borrowCapacityUsd < minLoopValue) break;

    const borrowTk = borrowCapacityUsd / debtPrice;
    totalDebtTk += borrowTk;
    totalDebtUsd = totalDebtTk * debtPrice;

    const newColTk = borrowCapacityUsd / colPrice;
    totalColTk += newColTk;
    totalColUsd = totalColTk * colPrice;

    const ltv = (totalDebtUsd / totalColUsd) * 100;
    const leverage = totalColUsd / investmentUsd;
    const lltvMargin = lltvPct - ltv;
    const hf = totalDebtUsd > 0 ? (totalColUsd * (lltvPct / 100)) / totalDebtUsd : 999;
    const liqPrice = totalDebtUsd > 0 ? totalDebtUsd / (totalColTk * (lltvPct / 100)) : 0;
    const remaining = totalColUsd - totalDebtUsd;

    loops.push({
      loop: i,
      colTk: totalColTk,
      debtTk: totalDebtTk,
      colUsd: totalColUsd,
      debtUsd: totalDebtUsd,
      ltv,
      leverage,
      lltvMargin,
      hf,
      liqPrice,
      remaining,
    });
  }

  const lastLoop = loops[loops.length - 1];
  const finalCol = lastLoop.colUsd;
  const finalDebt = lastLoop.debtUsd;
  const finalHf = lastLoop.hf;
  const finalLiqPrice = lastLoop.liqPrice;
  const liqPct = colPrice > 0 && finalLiqPrice > 0 ? ((colPrice - finalLiqPrice) / colPrice) * 100 : 100;

  const aprValueUsd = finalCol * (collateralApr / 100) * (exposureDays / 365);
  const interestValueUsd = finalDebt * (debtInterest / 100) * (exposureDays / 365);
  const profitLoss = aprValueUsd - interestValueUsd;
  const roi = investmentUsd > 0 ? (profitLoss / investmentUsd) * 100 : 0;

  return {
    loops,
    maxLoops: loops.length,
    maxLeverage: lastLoop.leverage,
    finalCol,
    finalDebt,
    finalHf,
    finalLiqPrice,
    liqPct,
    aprValueUsd,
    interestValueUsd,
    profitLoss,
    roi,
  };
}
