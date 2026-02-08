import { Project } from "./types";

export const ASSET_PRICES: Record<string, number> = {
  WETH: 3000,
  wstETH: 3450,
  cbETH: 3100,
  rETH: 3300,
  WBTC: 95000,
  USDC: 1,
  USDT: 1,
  DAI: 1,
  WMATIC: 0.4,
};

export const DEFAULT_PROJECTS: Project[] = [
  {
    id: "strata-s1",
    name: "Strata",
    season: "S1",
    status: "active",
    network: "ethereum",
    nc: "Ethereum",
    desc: "Strata Season 1 — Ethereum Mainnet",
    totalSupplyTokens: 1_000_000_000,
    fdv: 200_000_000,
    airdropPercent: 2,
    tvl: 141_300_000,
    tokenTicker: "STRT",
    tokenValue: 0.2,
    currentPoints: 1_146_688_677_807,
    ppd: 21_733_607_494,
    seasonEnd: "2026-04-30",
    updatedOn: "2026-02-01",
    notice: "Points are based on TVL contribution and activity.",
    projDesc:
      "Strata is a decentralized lending and borrowing protocol built on Ethereum. Earn points by providing liquidity and interacting with the protocol.",
    cat: 1,
  },
  {
    id: "backpack-s4",
    name: "Backpack",
    season: "S4 End",
    status: "active",
    network: "cex",
    nc: "CEX",
    desc: "Backpack Season 4 End — Centralized Exchange",
    totalSupplyTokens: 1_000_000_000,
    fdv: 1_000_000_000,
    airdropPercent: 24,
    tvl: 317_600_000,
    tokenTicker: "BPK",
    tokenValue: 1,
    currentPoints: 411_400_000,
    ppd: 2_571_429,
    seasonEnd: "2026-02-25",
    updatedOn: "2026-02-01",
    notice: "Season 4 ending soon. Final snapshot approaching.",
    projDesc:
      "Backpack is a crypto exchange with integrated wallet. Season 4 rewards are based on trading volume and liquidity provision.",
    cat: 2,
  },
  {
    id: "symbiotic-s1",
    name: "Symbiotic",
    season: "S1",
    status: "active",
    network: "ethereum",
    nc: "Ethereum",
    desc: "Symbiotic Season 1 — Ethereum Mainnet",
    totalSupplyTokens: 1_000_000_000,
    fdv: 200_000_000,
    airdropPercent: 3.5,
    tvl: 301_200_000,
    tokenTicker: "SYM",
    tokenValue: 0.2,
    currentPoints: 168_852_351_415,
    ppd: 1_322_654_227,
    seasonEnd: "2026-03-31",
    updatedOn: "2026-02-01",
    notice: "Restaking protocol. Points earned via deposits.",
    projDesc:
      "Symbiotic is a shared security protocol enabling restaking across multiple networks. Provide security and earn points toward the airdrop.",
    cat: 1,
  },
];

export const NETWORKS = [
  { id: "ethereum", name: "Ethereum Mainnet" },
  { id: "arbitrum", name: "Arbitrum" },
  { id: "base", name: "Base" },
  { id: "optimism", name: "Optimism" },
  { id: "polygon", name: "Polygon" },
];

export const PROTOCOLS = [
  { id: "custom", name: "Custom", live: false },
  { id: "morpho", name: "Morpho", live: true },
  { id: "aave-v3", name: "Aave V3", live: true },
];

export const MARKET_PAIRS: Record<string, Record<string, { supply: string; borrow: string; maxLtv: number; lltv: number }[]>> = {
  morpho: {
    ethereum: [
      { supply: "wstETH", borrow: "WETH", maxLtv: 86, lltv: 94.5 },
      { supply: "wstETH", borrow: "USDC", maxLtv: 77, lltv: 86 },
      { supply: "cbETH", borrow: "WETH", maxLtv: 86, lltv: 94.5 },
      { supply: "WETH", borrow: "USDC", maxLtv: 77, lltv: 86 },
      { supply: "WBTC", borrow: "USDC", maxLtv: 77, lltv: 86 },
      { supply: "WBTC", borrow: "USDT", maxLtv: 77, lltv: 86 },
    ],
    base: [
      { supply: "cbETH", borrow: "WETH", maxLtv: 86, lltv: 94.5 },
      { supply: "WETH", borrow: "USDC", maxLtv: 77, lltv: 86 },
    ],
    arbitrum: [
      { supply: "wstETH", borrow: "WETH", maxLtv: 86, lltv: 94.5 },
      { supply: "WETH", borrow: "USDC", maxLtv: 77, lltv: 86 },
    ],
    optimism: [
      { supply: "wstETH", borrow: "WETH", maxLtv: 86, lltv: 94.5 },
      { supply: "WETH", borrow: "USDC", maxLtv: 77, lltv: 86 },
    ],
    polygon: [
      { supply: "WMATIC", borrow: "USDC", maxLtv: 65, lltv: 77 },
      { supply: "WETH", borrow: "USDC", maxLtv: 77, lltv: 86 },
    ],
  },
  "aave-v3": {
    ethereum: [
      { supply: "WETH", borrow: "USDC", maxLtv: 80, lltv: 82.5 },
      { supply: "WETH", borrow: "USDT", maxLtv: 80, lltv: 82.5 },
      { supply: "WETH", borrow: "DAI", maxLtv: 80, lltv: 82.5 },
      { supply: "wstETH", borrow: "WETH", maxLtv: 80, lltv: 82.5 },
      { supply: "WBTC", borrow: "USDC", maxLtv: 70, lltv: 75 },
      { supply: "WBTC", borrow: "USDT", maxLtv: 70, lltv: 75 },
    ],
    arbitrum: [
      { supply: "WETH", borrow: "USDC", maxLtv: 80, lltv: 82.5 },
      { supply: "WETH", borrow: "USDT", maxLtv: 80, lltv: 82.5 },
    ],
    base: [
      { supply: "WETH", borrow: "USDC", maxLtv: 80, lltv: 82.5 },
      { supply: "cbETH", borrow: "WETH", maxLtv: 80, lltv: 82.5 },
    ],
    optimism: [
      { supply: "WETH", borrow: "USDC", maxLtv: 80, lltv: 82.5 },
      { supply: "WETH", borrow: "USDT", maxLtv: 80, lltv: 82.5 },
    ],
    polygon: [
      { supply: "WMATIC", borrow: "USDC", maxLtv: 65, lltv: 70 },
      { supply: "WETH", borrow: "USDC", maxLtv: 80, lltv: 82.5 },
    ],
  },
};

export const ASSETS: Record<string, string[]> = {
  ethereum: ["WETH", "wstETH", "cbETH", "rETH", "WBTC", "USDC", "USDT", "DAI"],
  arbitrum: ["WETH", "wstETH", "WBTC", "USDC", "USDT"],
  base: ["WETH", "cbETH", "USDC"],
  optimism: ["WETH", "wstETH", "USDC", "USDT"],
  polygon: ["WETH", "WMATIC", "WBTC", "USDC", "USDT"],
};
