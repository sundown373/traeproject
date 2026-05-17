import React, { useState } from 'react';
import { useGameStore } from './store/useGameStore';
import { IntroScene } from './components/IntroScene';
import { ResultScene } from './components/ResultScene';
import { OrderPanel } from './components/OrderPanel';
import { WorkshopPanel } from './components/WorkshopPanel';
import { WarehousePanel } from './components/WarehousePanel';
import { TechTreeModal } from './components/TechTreeModal';
import { AircraftModal } from './components/AircraftModal';

function App() {
  const scene = useGameStore(state => state.scene);
  const resetGame = useGameStore(state => state.resetGame);
  const [techOpen, setTechOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col relative overflow-y-auto">
      {/* Global decorative elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sky-500/0 via-sky-500/50 to-sky-500/0"></div>
      
      {/* Scene Management */}
      {scene === 'intro' && <IntroScene />}
      {scene === 'result' && <ResultScene />}
      
      {/* Main Game UI */}
      <main className={`flex-1 flex flex-col p-6 transition-opacity duration-1000 ${scene === 'intro' ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <header className="mb-6 flex justify-between items-end border-b-2 border-slate-700 pb-4">
          <div>
            <h1 className="text-3xl font-mono font-bold text-slate-100 tracking-widest">CLOUD DREAMERS</h1>
            <p className="text-sm font-mono text-sky-400">Aviation Blueprint Workshop v1.0</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTechOpen(true)}
              className="px-4 py-2 bg-sky-700 hover:bg-sky-600 text-white font-mono text-xs"
            >
              打开科技树
            </button>
            <button
              onClick={resetGame}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-mono text-xs"
            >
              从头开始
            </button>
          </div>
        </header>

        <div className="flex-1 flex flex-col lg:flex-row gap-6">
          <OrderPanel />
          <div className="flex-1 flex flex-col">
            <WorkshopPanel />
            <WarehousePanel />
          </div>
        </div>
      </main>

      <TechTreeModal open={techOpen} onClose={() => setTechOpen(false)} />
      <AircraftModal />
    </div>
  );
}

export default App;
