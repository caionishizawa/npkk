'use client';

import { useStrategyStore } from '@/lib/store';
import { getProtocolsForNetwork, getMarketsForProtocol, getMarketById, NETWORKS } from '@/lib/data';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { Slider } from '@/components/ui/Slider';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader } from '@/components/ui/Card';
import type { Network, Protocol } from '@/lib/types';

export function StrategyInputs() {
  const store = useStrategyStore();
  const protocols = getProtocolsForNetwork(store.network);
  const markets = getMarketsForProtocol(store.network, store.protocol);

  const handleCalculate = () => {
    const market = getMarketById(store.marketId);
    if (market) store.calculate(market);
  };

  return (
    <div className="space-y-4">
      <Card glow>
        <CardHeader title="Strategy Builder" subtitle="Configure your looping strategy" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Network"
            value={store.network}
            options={NETWORKS.map((n) => ({
              value: n.id,
              label: n.name,
              badge: `~$${n.avgGasCost} gas`,
            }))}
            onChange={(v) => store.setNetwork(v as Network)}
          />

          <Select
            label="Protocol"
            value={store.protocol}
            options={protocols.map((p) => ({ value: p.id, label: p.name }))}
            onChange={(v) => store.setProtocol(v as Protocol)}
          />

          <Select
            label="Market"
            value={store.marketId}
            options={markets.map((m) => ({
              value: m.id,
              label: `${m.collateralToken} / ${m.debtToken}`,
            }))}
            onChange={(v) => store.setMarketId(v)}
          />

          <Input
            label="Capital"
            value={store.capital}
            onChange={(v) => store.setCapital(Number(v) || 0)}
            type="number"
            prefix="$"
            min={100}
          />
        </div>

        <div className="mt-4">
          <Slider
            label="Risk Tolerance"
            value={store.riskTolerance}
            min={15}
            max={35}
            step={5}
            onChange={(v) => store.setRiskTolerance(v)}
            formatValue={(v) => `${v}%`}
            leftLabel="Conservative"
            rightLabel="Aggressive"
          />
        </div>

        <button
          onClick={() => store.toggleProMode()}
          className="mt-4 text-xs text-text-secondary hover:text-primary transition-colors flex items-center gap-1"
        >
          <span className="font-mono">{store.showProMode ? '[-]' : '[+]'}</span>
          Advanced Parameters
        </button>

        {store.showProMode && <ProModeInputs />}

        <Button onClick={handleCalculate} variant="primary" size="lg" className="w-full mt-6">
          Calculate Strategy
        </Button>
      </Card>
    </div>
  );
}

function ProModeInputs() {
  const { pro, setProField } = useStrategyStore();

  return (
    <div className="mt-4 pt-4 border-t border-border space-y-4">
      <p className="text-xs text-text-secondary font-mono uppercase tracking-wider">
        Advanced Parameters
      </p>
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Target LTV"
          value={pro.targetLtv}
          onChange={(v) => setProField('targetLtv', Number(v) || 0)}
          type="number"
          step={0.01}
          min={0.1}
          max={0.9}
        />
        <Input
          label="Min Health Factor"
          value={pro.minHealthFactor}
          onChange={(v) => setProField('minHealthFactor', Number(v) || 0)}
          type="number"
          step={0.05}
          min={1.0}
        />
        <Input
          label="Borrow Spike Buffer"
          value={pro.borrowSpikeBuffer}
          onChange={(v) => setProField('borrowSpikeBuffer', Number(v) || 0)}
          type="number"
          suffix="%"
          step={0.01}
        />
        <Input
          label="Slippage/Fees"
          value={pro.slippageFees}
          onChange={(v) => setProField('slippageFees', Number(v) || 0)}
          type="number"
          suffix="%"
          step={0.001}
        />
        <Input
          label="Liquidation Bonus"
          value={pro.liquidationBonus}
          onChange={(v) => setProField('liquidationBonus', Number(v) || 0)}
          type="number"
          suffix="%"
          step={0.01}
        />
        <Input
          label="Depeg Haircut (LST)"
          value={pro.depegHaircut}
          onChange={(v) => setProField('depegHaircut', Number(v) || 0)}
          type="number"
          suffix="%"
          step={0.01}
        />
      </div>
    </div>
  );
}
