import type { NetworkInfo, ProtocolInfo, Market, Network, Protocol } from './types';

// ========================
// Mock Data (would be API-driven in production)
// ========================

export const NETWORKS: NetworkInfo[] = [
  { id: 'arbitrum', name: 'Arbitrum', avgGasCost: 0.15, color: '#28A0F0' },
  { id: 'ethereum', name: 'Ethereum', avgGasCost: 8.0, color: '#627EEA' },
  { id: 'base', name: 'Base', avgGasCost: 0.05, color: '#0052FF' },
  { id: 'optimism', name: 'Optimism', avgGasCost: 0.12, color: '#FF0420' },
  { id: 'polygon', name: 'Polygon', avgGasCost: 0.02, color: '#8247E5' },
];

export const MARKETS: Record<string, Market> = {
  'aave-v3-weth-usdc': {
    id: 'aave-v3-weth-usdc',
    collateralToken: 'WETH',
    debtToken: 'USDC',
    supplyApy: 0.023,
    borrowApy: 0.038,
    liquidationThreshold: 0.825,
    maxLtv: 0.80,
    incentivesSupply: 0.012,
    incentivesBorrow: 0.005,
    stakingYield: 0,
    hasPointsCampaign: false,
    pointsPerDollarPerDay: 0,
  },
  'aave-v3-wsteth-usdc': {
    id: 'aave-v3-wsteth-usdc',
    collateralToken: 'wstETH',
    debtToken: 'USDC',
    supplyApy: 0.015,
    borrowApy: 0.035,
    liquidationThreshold: 0.80,
    maxLtv: 0.75,
    incentivesSupply: 0.01,
    incentivesBorrow: 0.003,
    stakingYield: 0.035,
    hasPointsCampaign: false,
    pointsPerDollarPerDay: 0,
  },
  'aave-v3-wsteth-weth': {
    id: 'aave-v3-wsteth-weth',
    collateralToken: 'wstETH',
    debtToken: 'WETH',
    supplyApy: 0.005,
    borrowApy: 0.025,
    liquidationThreshold: 0.93,
    maxLtv: 0.90,
    incentivesSupply: 0.008,
    incentivesBorrow: 0.002,
    stakingYield: 0.035,
    hasPointsCampaign: false,
    pointsPerDollarPerDay: 0,
  },
  'morpho-weth-usdc': {
    id: 'morpho-weth-usdc',
    collateralToken: 'WETH',
    debtToken: 'USDC',
    supplyApy: 0.035,
    borrowApy: 0.042,
    liquidationThreshold: 0.86,
    maxLtv: 0.80,
    incentivesSupply: 0.015,
    incentivesBorrow: 0.008,
    stakingYield: 0,
    hasPointsCampaign: true,
    pointsPerDollarPerDay: 0.05,
  },
  'morpho-wsteth-usdc': {
    id: 'morpho-wsteth-usdc',
    collateralToken: 'wstETH',
    debtToken: 'USDC',
    supplyApy: 0.018,
    borrowApy: 0.038,
    liquidationThreshold: 0.82,
    maxLtv: 0.77,
    incentivesSupply: 0.012,
    incentivesBorrow: 0.006,
    stakingYield: 0.035,
    hasPointsCampaign: true,
    pointsPerDollarPerDay: 0.04,
  },
  'compound-v3-weth-usdc': {
    id: 'compound-v3-weth-usdc',
    collateralToken: 'WETH',
    debtToken: 'USDC',
    supplyApy: 0.02,
    borrowApy: 0.045,
    liquidationThreshold: 0.83,
    maxLtv: 0.78,
    incentivesSupply: 0.018,
    incentivesBorrow: 0.01,
    stakingYield: 0,
    hasPointsCampaign: false,
    pointsPerDollarPerDay: 0,
  },
  'compound-v3-reth-dai': {
    id: 'compound-v3-reth-dai',
    collateralToken: 'rETH',
    debtToken: 'DAI',
    supplyApy: 0.012,
    borrowApy: 0.04,
    liquidationThreshold: 0.80,
    maxLtv: 0.75,
    incentivesSupply: 0.015,
    incentivesBorrow: 0.008,
    stakingYield: 0.032,
    hasPointsCampaign: false,
    pointsPerDollarPerDay: 0,
  },
  'spark-weth-dai': {
    id: 'spark-weth-dai',
    collateralToken: 'WETH',
    debtToken: 'DAI',
    supplyApy: 0.025,
    borrowApy: 0.035,
    liquidationThreshold: 0.83,
    maxLtv: 0.80,
    incentivesSupply: 0.02,
    incentivesBorrow: 0.01,
    stakingYield: 0,
    hasPointsCampaign: true,
    pointsPerDollarPerDay: 0.03,
  },
};

export const PROTOCOLS: Record<Network, ProtocolInfo[]> = {
  arbitrum: [
    { id: 'aave-v3', name: 'Aave V3', markets: [MARKETS['aave-v3-weth-usdc'], MARKETS['aave-v3-wsteth-usdc'], MARKETS['aave-v3-wsteth-weth']] },
    { id: 'radiant', name: 'Radiant', markets: [MARKETS['aave-v3-weth-usdc']] },
  ],
  ethereum: [
    { id: 'aave-v3', name: 'Aave V3', markets: [MARKETS['aave-v3-weth-usdc'], MARKETS['aave-v3-wsteth-usdc']] },
    { id: 'morpho-blue', name: 'Morpho Blue', markets: [MARKETS['morpho-weth-usdc'], MARKETS['morpho-wsteth-usdc']] },
    { id: 'compound-v3', name: 'Compound V3', markets: [MARKETS['compound-v3-weth-usdc'], MARKETS['compound-v3-reth-dai']] },
    { id: 'spark', name: 'Spark', markets: [MARKETS['spark-weth-dai']] },
  ],
  base: [
    { id: 'aave-v3', name: 'Aave V3', markets: [MARKETS['aave-v3-weth-usdc']] },
    { id: 'compound-v3', name: 'Compound V3', markets: [MARKETS['compound-v3-weth-usdc']] },
  ],
  optimism: [
    { id: 'aave-v3', name: 'Aave V3', markets: [MARKETS['aave-v3-weth-usdc'], MARKETS['aave-v3-wsteth-usdc']] },
  ],
  polygon: [
    { id: 'aave-v3', name: 'Aave V3', markets: [MARKETS['aave-v3-weth-usdc']] },
  ],
};

export const CURRENT_PRICES: Record<string, number> = {
  WETH: 3000,
  wstETH: 3450,
  rETH: 3300,
  USDC: 1,
  USDT: 1,
  DAI: 1,
};

export function getProtocolsForNetwork(network: Network): ProtocolInfo[] {
  return PROTOCOLS[network] || [];
}

export function getMarketsForProtocol(network: Network, protocol: Protocol): Market[] {
  const protocols = PROTOCOLS[network] || [];
  const found = protocols.find((p) => p.id === protocol);
  return found?.markets || [];
}

export function getMarketById(id: string): Market | undefined {
  return MARKETS[id];
}

export function getCurrentPrice(token: string): number {
  return CURRENT_PRICES[token] || 1;
}
