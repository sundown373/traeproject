import React, { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { X, Wind, Zap, Box } from 'lucide-react'
import { AIRCRAFT_BY_ID, MODULE_BY_ID } from '../data/aviationTree'
import { useGameStore } from '../store/useGameStore'

type Tab = 'summary' | 'materials' | 'aero' | 'business' | 'geo' | 'performance'

export const AircraftModal: React.FC = () => {
  const aircraftModalId = useGameStore(s => s.aircraftModalId)
  const closeAircraftModal = useGameStore(s => s.closeAircraftModal)
  const unlockedAircraftIds = useGameStore(s => s.unlockedAircraftIds)
  const unlockedModuleIds = useGameStore(s => s.unlockedModuleIds)
  const researchPoints = useGameStore(s => s.researchPoints)
  const money = useGameStore(s => s.money)
  const unlockAircraft = useGameStore(s => s.unlockAircraft)
  const unlockModule = useGameStore(s => s.unlockModule)

  const aircraft = useMemo(() => (aircraftModalId ? AIRCRAFT_BY_ID[aircraftModalId] : null), [aircraftModalId])
  const [tab, setTab] = useState<Tab>('summary')

  const completedTiers = useMemo(() => {
    const s = new Set<number>()
    for (const id of unlockedAircraftIds) {
      const a = AIRCRAFT_BY_ID[id]
      if (!a) continue
      const completed = a.moduleIds.every(mid => unlockedModuleIds.includes(mid))
      if (completed) s.add(a.tier)
    }
    return s
  }, [unlockedAircraftIds, unlockedModuleIds])

  if (!aircraft) return null

  const isAircraftUnlocked = unlockedAircraftIds.includes(aircraft.id)
  const isCompleted = isAircraftUnlocked && aircraft.moduleIds.every(mid => unlockedModuleIds.includes(mid))

  const prereqOk = aircraft.prerequisitesAircraft.every(id => unlockedAircraftIds.includes(id))
  const modulesOk = aircraft.unlockByModules.every(id => unlockedModuleIds.includes(id))
  const prereqReady = prereqOk && modulesOk

  const canUnlockAircraft = !isAircraftUnlocked && prereqReady && researchPoints >= aircraft.cost
  const moneyCost = Math.max(500, Math.round(aircraft.cost * 10 + aircraft.tier * 300))
  const tierMoneyUnlocked = completedTiers.has(aircraft.tier)
  const canUnlockWithMoney = !isAircraftUnlocked && prereqReady && tierMoneyUnlocked && money >= moneyCost

  return (
    <div className="fixed inset-0 z-[60] bg-slate-950/80 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="mx-auto max-w-5xl blueprint-border bg-slate-900/80 overflow-hidden"
      >
        <div className="flex items-start justify-between p-5 border-b border-sky-500/30">
          <div>
            <div className="text-xs font-mono text-slate-400">{aircraft.firstFlightYear} · Lv.{aircraft.tier} · {aircraft.country} · {aircraft.manufacturer}</div>
            <div className="text-2xl font-mono font-bold text-white mt-1">{aircraft.name}</div>
            <div className="text-sm text-slate-300 mt-2">{aircraft.story.summary}</div>
          </div>
          <div className="flex items-center gap-2">
            {!isAircraftUnlocked && (
              <>
                <button
                  onClick={() => unlockAircraft(aircraft.id, 'rp')}
                  disabled={!canUnlockAircraft}
                  className={`px-4 py-2 font-mono text-xs ${
                    canUnlockAircraft ? 'bg-emerald-600 hover:bg-emerald-500 text-white' : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  用科研点研发 ({aircraft.cost}pts)
                </button>
                <button
                  onClick={() => unlockAircraft(aircraft.id, 'money')}
                  disabled={!canUnlockWithMoney}
                  className={`px-4 py-2 font-mono text-xs ${
                    canUnlockWithMoney ? 'bg-amber-700 hover:bg-amber-600 text-white' : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                  }`}
                  title="当同级任意机型（机体+全部模块）完整研发完成后，可用资金研发同级其他机型。"
                >
                  用资金研发 (${moneyCost})
                </button>
              </>
            )}
            <button onClick={closeAircraftModal} className="p-2 text-slate-300 hover:text-white">
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="p-5 grid grid-cols-1 lg:grid-cols-5 gap-5">
          <div className="lg:col-span-3">
            <div className="flex gap-2 flex-wrap">
              <button onClick={() => setTab('summary')} className={`px-3 py-1 font-mono text-xs ${tab === 'summary' ? 'bg-sky-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}>摘要</button>
              <button onClick={() => setTab('materials')} className={`px-3 py-1 font-mono text-xs ${tab === 'materials' ? 'bg-sky-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}>材料</button>
              <button onClick={() => setTab('aero')} className={`px-3 py-1 font-mono text-xs ${tab === 'aero' ? 'bg-sky-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}>气动</button>
              <button onClick={() => setTab('business')} className={`px-3 py-1 font-mono text-xs ${tab === 'business' ? 'bg-sky-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}>商业</button>
              <button onClick={() => setTab('geo')} className={`px-3 py-1 font-mono text-xs ${tab === 'geo' ? 'bg-sky-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}>地缘</button>
              <button onClick={() => setTab('performance')} className={`px-3 py-1 font-mono text-xs ${tab === 'performance' ? 'bg-sky-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}>性能</button>
            </div>

            <div className="mt-4 text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
              {tab === 'summary' && aircraft.story.summary}
              {tab === 'materials' && aircraft.story.materials}
              {tab === 'aero' && aircraft.story.aerodynamics}
              {tab === 'business' && aircraft.story.business}
              {tab === 'geo' && aircraft.story.geopolitics}
              {tab === 'performance' && aircraft.story.performance}
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="text-xs font-mono text-slate-500 uppercase mb-2">模块研发（解锁后进入仓库）</div>
            {tierMoneyUnlocked && (
              <div className="mb-3 text-xs font-mono text-amber-300 border border-amber-500/30 bg-amber-900/10 p-2">
                同级别机型已解锁“资金研发”通道：你可以用资金研发该级其他机型（不消耗科研点）。
              </div>
            )}
            <div className="space-y-3">
              {aircraft.moduleIds.map(mid => {
                const m = MODULE_BY_ID[mid]
                if (!m) return null
                const isUnlocked = unlockedModuleIds.includes(mid)
                const canUnlock = isAircraftUnlocked && !isUnlocked && researchPoints >= m.cost
                const Icon = m.slot === 'wing' ? Wind : m.slot === 'engine' ? Zap : Box
                return (
                  <div key={mid} className="border border-slate-700 bg-slate-950/30 p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 ${m.isKey ? 'bg-amber-700/30 text-amber-300' : 'bg-slate-700/40 text-slate-300'}`}>
                          <Icon size={18} />
                        </div>
                        <div>
                          <div className="font-mono text-sm text-white">{m.part.name}</div>
                          <div className="text-[11px] font-mono text-slate-400 mt-1">
                            S:{m.part.stats.speed} L:{m.part.stats.lift} W:{m.part.stats.weight} M:{m.part.stats.maneuverability}
                          </div>
                        </div>
                      </div>
                      {isUnlocked ? (
                        <div className="text-[11px] font-mono text-sky-400">已入库</div>
                      ) : (
                        <button
                          onClick={() => unlockModule(mid)}
                          disabled={!canUnlock}
                          className={`px-3 py-2 font-mono text-[11px] ${
                            canUnlock ? 'bg-emerald-600 hover:bg-emerald-500 text-white' : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                          }`}
                        >
                          研发 ({m.cost}pts)
                        </button>
                      )}
                    </div>
                    <div className="mt-2 text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
                      {m.part.story.summary}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
