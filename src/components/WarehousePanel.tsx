import React from 'react';
import { useGameStore } from '../store/useGameStore';
import { Wind, Zap, Box } from 'lucide-react';
import { Part } from '../data/aviationTree';

const getIcon = (type: string) => {
  switch (type) {
    case 'wind': return Wind;
    case 'zap': return Zap;
    case 'box': return Box;
    default: return Box;
  }
};

export const WarehousePanel: React.FC = () => {
  const unlockedParts = useGameStore(state => state.unlockedParts);
  const equipPart = useGameStore(state => state.equipPart);

  const handleEquip = (part: Part) => {
    equipPart(part);
  };

  return (
    <div className="h-[260px] blueprint-border bg-slate-800/50 backdrop-blur-md flex flex-col mt-6">
      <div className="flex border-b border-sky-500/30 px-6 py-3">
        <div className="font-mono font-bold text-sky-300">组件仓库</div>
      </div>
      <div className="flex-1 p-4 overflow-y-auto overflow-x-auto relative">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {unlockedParts.map(part => {
            const Icon = getIcon(part.iconType);
            return (
              <button 
                key={part.id} 
                onClick={() => handleEquip(part)}
                className="p-3 border border-slate-600 bg-slate-800 hover:bg-slate-700 hover:border-sky-400 cursor-pointer transition-all group text-left flex flex-col"
                title={part.story.summary}
              >
                <div className="flex justify-between items-start mb-2 w-full">
                  <Icon size={20} className="text-sky-400 group-hover:text-sky-300" />
                  <span className="text-xs font-mono text-slate-500">Lv.{part.tier}</span>
                </div>
                <div className="font-mono text-sm text-slate-200 mb-2 truncate w-full">{part.name}</div>
                <div className="grid grid-cols-2 gap-1 text-[10px] font-mono w-full">
                  <span className="text-sky-300">S:{part.stats.speed}</span>
                  <span className="text-emerald-300">L:{part.stats.lift}</span>
                  <span className="text-amber-300">W:{part.stats.weight}</span>
                  <span className="text-purple-300">M:{part.stats.maneuverability || 0}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
