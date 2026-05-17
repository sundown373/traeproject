import React, { useMemo } from 'react';
import { useGameStore } from '../store/useGameStore';
import { Wind, Zap, Box, X } from 'lucide-react';
import { AIRCRAFT_BY_ID, Part } from '../data/aviationTree';

export const WorkshopPanel: React.FC = () => {
  const { wing, engine, body } = useGameStore(state => state.assembledBlueprint);
  const unequipPart = useGameStore(state => state.unequipPart);
  const matchedAircraftId = useGameStore(state => state.matchedAircraftId);
  const selectAircraft = useGameStore(state => state.selectAircraft);
  const openAircraftModal = useGameStore(state => state.openAircraftModal);

  const totalSpeed = (wing?.stats.speed || 0) + (engine?.stats.speed || 0) + (body?.stats.speed || 0);
  const totalLift = (wing?.stats.lift || 0) + (engine?.stats.lift || 0) + (body?.stats.lift || 0);
  const totalWeight = (wing?.stats.weight || 0) + (engine?.stats.weight || 0) + (body?.stats.weight || 0);
  const totalManeuverability = (wing?.stats.maneuverability || 0) + (engine?.stats.maneuverability || 0) + (body?.stats.maneuverability || 0);

  const matched = useMemo(() => (matchedAircraftId ? AIRCRAFT_BY_ID[matchedAircraftId] : null), [matchedAircraftId]);

  const Slot = ({ type, part, label, icon: Icon }: { type: 'wing'|'engine'|'body', part: Part | null, label: string, icon: any }) => (
    <div className="relative border-2 border-dashed border-sky-500/30 bg-sky-900/10 h-32 flex flex-col items-center justify-center group transition-colors hover:border-sky-400/60">
      {part ? (
        <>
          <div className="absolute top-2 right-2">
            <button 
              onClick={() => unequipPart(type)}
              className="text-slate-400 hover:text-red-400 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
          <Icon size={32} className="text-sky-300 mb-2" />
          <span className="font-mono text-sky-100 font-bold">{part.name}</span>
          <div className="flex gap-2 text-xs font-mono mt-2 opacity-70">
            <span className="text-sky-300">S:{part.stats.speed}</span>
            <span className="text-emerald-300">L:{part.stats.lift}</span>
            <span className="text-amber-300">W:{part.stats.weight}</span>
            <span className="text-purple-300">M:{part.stats.maneuverability || 0}</span>
          </div>
        </>
      ) : (
        <>
          <Icon size={32} className="text-slate-600 mb-2 opacity-50" />
          <span className="font-mono text-slate-500 tracking-widest uppercase">[{label}]</span>
        </>
      )}
    </div>
  );

  return (
    <div className="flex-1 flex flex-col gap-6">
      {/* Stats Readout */}
      <div className="blueprint-border bg-slate-800/50 p-6 backdrop-blur-md flex justify-around items-center">
        <div className="text-center">
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-1">总速度</div>
          <div className="text-3xl font-mono text-sky-400">{totalSpeed} <span className="text-sm text-sky-400/50">km/h</span></div>
        </div>
        <div className="w-px h-12 bg-slate-700"></div>
        <div className="text-center">
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-1">总升力</div>
          <div className="text-3xl font-mono text-emerald-400">{totalLift}</div>
        </div>
        <div className="w-px h-12 bg-slate-700"></div>
        <div className="text-center">
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-1">机动性</div>
          <div className="text-3xl font-mono text-purple-400">{totalManeuverability}</div>
        </div>
        <div className="w-px h-12 bg-slate-700"></div>
        <div className="text-center">
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-1">总重量</div>
          <div className="text-3xl font-mono text-amber-400">{totalWeight} <span className="text-sm text-amber-400/50">kg</span></div>
        </div>
      </div>

      {matched && (
        <div className="blueprint-border bg-slate-800/50 p-5 backdrop-blur-md">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-xs font-mono text-amber-400 uppercase tracking-wider mb-1">历史机型匹配</div>
              <div className="text-lg font-mono font-bold text-white">{matched.name}</div>
              <div className="text-sm text-slate-300 mt-1">{matched.story.summary}</div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <button
                onClick={() => {
                  selectAircraft(matched.id);
                  openAircraftModal(matched.id);
                }}
                className="px-4 py-2 bg-amber-700 hover:bg-amber-600 text-white font-mono text-sm"
              >
                查看飞机档案
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Blueprint Area */}
      <div className="blueprint-border bg-slate-800/30 p-8 backdrop-blur-md flex-1 relative overflow-hidden flex flex-col items-center justify-center min-h-[400px]">
        {/* Decorative Grid & Lines */}
        <div className="absolute inset-0 pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <line x1="50%" y1="0" x2="50%" y2="100%" stroke="rgba(56, 189, 248, 0.1)" strokeWidth="1" />
            <line x1="0" y1="50%" x2="100%" y2="50%" stroke="rgba(56, 189, 248, 0.1)" strokeWidth="1" />
            <circle cx="50%" cy="50%" r="150" fill="none" stroke="rgba(56, 189, 248, 0.05)" strokeWidth="1" strokeDasharray="5,5" />
          </svg>
        </div>

        <div className="w-full max-w-lg space-y-4 relative z-10">
          <Slot type="wing" part={wing} label="机翼模块" icon={Wind} />
          <Slot type="body" part={body} label="机身模块" icon={Box} />
          <Slot type="engine" part={engine} label="动力模块" icon={Zap} />
        </div>
      </div>
    </div>
  );
};
