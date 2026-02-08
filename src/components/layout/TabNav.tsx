'use client';

import { useUIStore } from '@/lib/store';
import { cn } from '@/lib/utils';

const tabs = [
  { id: 'strategy' as const, label: 'Strategy Builder', icon: 'S' },
  { id: 'risk' as const, label: 'Risk Lab', icon: 'R' },
  { id: 'compare' as const, label: 'Compare', icon: 'C' },
  { id: 'points' as const, label: 'Points Calculator', icon: 'P' },
];

export function TabNav() {
  const { activeTab, setActiveTab } = useUIStore();

  return (
    <nav className="border-b border-border bg-background">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex gap-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'px-4 py-3 text-sm font-medium whitespace-nowrap transition-all duration-200',
                'border-b-2 -mb-px',
                activeTab === tab.id
                  ? 'text-primary border-primary'
                  : 'text-text-secondary border-transparent hover:text-text-primary hover:border-border'
              )}
            >
              <span className="sm:hidden font-mono text-xs">{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
