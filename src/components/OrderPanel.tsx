import React, { useState } from 'react';
import { useGameStore } from '../store/useGameStore';
import { Target, Coins, FlaskConical, ScrollText } from 'lucide-react';
import { SpecialOrderModal } from './SpecialOrderModal';

export const OrderPanel: React.FC = () => {
  const currentOrder = useGameStore(state => state.currentOrder);
  const money = useGameStore(state => state.money);
  const researchPoints = useGameStore(state => state.researchPoints);
  const currentYear = useGameStore(state => state.currentYear);
  const submitBlueprint = useGameStore(state => state.submitBlueprint);
  const [open, setOpen] = useState(false);

  return (
    <div className="w-80 flex flex-col gap-6">
      {/* Company Status */}
      <div className="blueprint-border bg-slate-800/50 p-6 backdrop-blur-md">
        <h2 className="text-xl font-mono text-sky-400 mb-4 border-b border-sky-400/30 pb-2">
          公司资产 [{currentYear}]
        </h2>
        <div className="space-y-3 font-mono">
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-2 text-slate-300">
              <Coins size={16} className="text-amber-400" /> 资金
            </span>
            <span className="text-amber-400 font-bold">${money}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-2 text-slate-300">
              <FlaskConical size={16} className="text-emerald-400" /> 科研点
            </span>
            <span className="text-emerald-400 font-bold">{researchPoints} pts</span>
          </div>
        </div>
      </div>

      {/* Current Order */}
      <div className="blueprint-border bg-slate-800/50 p-6 backdrop-blur-md flex-1 flex flex-col">
        <h2 className="text-xl font-mono text-sky-400 mb-4 border-b border-sky-400/30 pb-2 flex items-center gap-2">
          <Target size={20} /> 当前订单
        </h2>
        
        <div className="mb-6">
          <div className="flex items-start justify-between gap-3">
            <div>
          <h3 className="font-bold text-lg text-white mb-2">{currentOrder.title}</h3>
          <p className="text-slate-400 text-sm italic">"{currentOrder.description}"</p>
            </div>
            {currentOrder.kind === 'special' && (
              <button
                onClick={() => setOpen(true)}
                className="shrink-0 px-3 py-2 bg-amber-700 hover:bg-amber-600 text-white font-mono text-xs flex items-center gap-2 h-fit"
              >
                <ScrollText size={14} />
                节点档案
              </button>
            )}
          </div>
          <div className="mt-3">
            <span className={`inline-flex items-center px-2 py-1 text-[10px] font-mono uppercase border ${
              currentOrder.kind === 'special'
                ? 'border-amber-500/40 text-amber-300 bg-amber-900/10'
                : 'border-sky-500/40 text-sky-300 bg-sky-900/10'
            }`}>
              {currentOrder.kind === 'special' ? '历史节点任务' : '日常订单'}
            </span>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          <h4 className="text-sm font-mono text-sky-300 uppercase tracking-wider">要求性能:</h4>
          <div className="space-y-2 font-mono text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">最低速度</span>
              <span className="text-white">{currentOrder.requirements.minSpeed} km/h</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">最低升力</span>
              <span className="text-white">{currentOrder.requirements.minLift}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">最大重量</span>
              <span className="text-white">{currentOrder.requirements.maxWeight} kg</span>
            </div>
            {currentOrder.requirements.minManeuverability !== undefined && (
              <div className="flex justify-between">
                <span className="text-purple-400">最低机动性 (狗斗)</span>
                <span className="text-purple-300 font-bold">{currentOrder.requirements.minManeuverability}</span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-auto space-y-4">
          <div className="p-3 bg-slate-900/50 border border-slate-700">
            <h4 className="text-xs font-mono text-slate-500 uppercase mb-2">预估报酬</h4>
            <div className="flex justify-between text-sm font-mono">
              <span className="text-amber-400">+${currentOrder.rewards.money}</span>
              <span className="text-emerald-400">+{currentOrder.rewards.researchPoints} pts</span>
            </div>
          </div>
          
          <button 
            onClick={submitBlueprint}
            className="w-full py-3 bg-sky-600 hover:bg-sky-500 text-white font-mono font-bold transition-colors shadow-[0_0_15px_rgba(2,132,199,0.5)] hover:shadow-[0_0_25px_rgba(2,132,199,0.8)]"
          >
            提交设计并试飞
          </button>
        </div>
      </div>
      {currentOrder.kind === 'special' && (
        <SpecialOrderModal order={currentOrder} open={open} onClose={() => setOpen(false)} />
      )}
    </div>
  );
};
