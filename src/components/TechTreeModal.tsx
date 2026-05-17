import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import { X, Lock, Unlock } from 'lucide-react'
import { AIRCRAFT_BY_ID, AIRCRAFT_NODES } from '../data/aviationTree'
import { useGameStore } from '../store/useGameStore'

export const TechTreeModal: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  const researchPoints = useGameStore(s => s.researchPoints)
  const unlockedAircraftIds = useGameStore(s => s.unlockedAircraftIds)
  const unlockedModuleIds = useGameStore(s => s.unlockedModuleIds)
  const selectAircraft = useGameStore(s => s.selectAircraft)
  const openAircraftModal = useGameStore(s => s.openAircraftModal)

  const bounds = useMemo(() => {
    const maxX = Math.max(...AIRCRAFT_NODES.map(a => a.x))
    const maxY = Math.max(...AIRCRAFT_NODES.map(a => a.y))
    return { maxX, maxY }
  }, [])

  const CELL_WIDTH = 240
  const CELL_HEIGHT = 140
  const NODE_W = 220
  const NODE_H = 110

  const isAircraftAvailable = (aircraftId: string) => {
    const a = AIRCRAFT_BY_ID[aircraftId]
    if (!a) return false
    if (unlockedAircraftIds.includes(aircraftId)) return true
    const prereqOk = a.prerequisitesAircraft.every(id => unlockedAircraftIds.includes(id))
    const modulesOk = a.unlockByModules.every(id => unlockedModuleIds.includes(id))
    return prereqOk && modulesOk
  }

  const pathFor = (fromId: string, toId: string) => {
    const from = AIRCRAFT_BY_ID[fromId]
    const to = AIRCRAFT_BY_ID[toId]
    if (!from || !to) return ''
    const fx = (from.x - 1) * CELL_WIDTH + NODE_W
    const fy = (from.y - 1) * CELL_HEIGHT + NODE_H / 2
    const tx = (to.x - 1) * CELL_WIDTH
    const ty = (to.y - 1) * CELL_HEIGHT + NODE_H / 2
    const midX = fx + (tx - fx) * 0.5
    const r = 10
    const s1 = `M ${fx} ${fy}`
    const s2 = `L ${midX - r} ${fy}`
    const s3 = `Q ${midX} ${fy} ${midX} ${fy + (ty > fy ? r : -r)}`
    const s4 = `L ${midX} ${ty - (ty > fy ? r : -r)}`
    const s5 = `Q ${midX} ${ty} ${midX + r} ${ty}`
    const s6 = `L ${tx} ${ty}`
    return `${s1} ${s2} ${s3} ${s4} ${s5} ${s6}`
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="absolute inset-6 blueprint-border bg-slate-900/80 overflow-hidden"
      >
        <div className="flex items-center justify-between border-b border-sky-500/30 p-4">
          <div>
            <div className="text-xs font-mono text-slate-400">TECH_TREE</div>
            <div className="text-xl font-mono font-bold text-white">航空机型科技树</div>
            <div className="text-xs font-mono text-emerald-400 mt-1">当前科研点：{researchPoints} pts</div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-300 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="absolute inset-x-0 top-[76px] bottom-0 overflow-auto">
          <div
            className="relative"
            style={{ width: `${bounds.maxX * CELL_WIDTH}px`, height: `${bounds.maxY * CELL_HEIGHT}px` }}
          >
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {AIRCRAFT_NODES.flatMap(a =>
                a.successors.map(sid => {
                  const unlocked = unlockedAircraftIds.includes(sid)
                  const partial = unlockedAircraftIds.includes(a.id)
                  const stroke = unlocked ? 'rgba(56, 189, 248, 0.85)' : partial ? 'rgba(56, 189, 248, 0.35)' : 'rgba(71, 85, 105, 0.25)'
                  return (
                    <path
                      key={`${a.id}-${sid}`}
                      d={pathFor(a.id, sid)}
                      fill="none"
                      stroke={stroke}
                      strokeWidth={unlocked ? 3 : 2}
                      strokeDasharray={unlocked ? 'none' : '6 6'}
                    />
                  )
                })
              )}
            </svg>

            {AIRCRAFT_NODES.map(a => {
              const isUnlocked = unlockedAircraftIds.includes(a.id)
              const available = isAircraftAvailable(a.id)
              const left = (a.x - 1) * CELL_WIDTH
              const top = (a.y - 1) * CELL_HEIGHT
              return (
                <button
                  key={a.id}
                  onClick={() => {
                    selectAircraft(a.id)
                    openAircraftModal(a.id)
                  }}
                  className={`absolute p-3 border shadow-lg flex flex-col justify-between text-left ${
                    isUnlocked
                      ? 'border-sky-500 bg-slate-800'
                      : available
                        ? 'border-sky-500/50 bg-slate-800/80'
                        : 'border-slate-700 bg-slate-900/80 opacity-60'
                  }`}
                  style={{ left: `${left}px`, top: `${top}px`, width: `${NODE_W}px`, height: `${NODE_H}px` }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-xs font-mono text-slate-400">{a.firstFlightYear} · Lv.{a.tier}</div>
                      <div className="font-mono font-bold text-slate-100 leading-tight line-clamp-2">{a.name}</div>
                    </div>
                    {isUnlocked ? <Unlock size={16} className="text-sky-400" /> : <Lock size={16} className="text-slate-500" />}
                  </div>
                  <div className="mt-auto flex items-center justify-between gap-2">
                    <div className="text-[10px] font-mono text-slate-500">{a.era}</div>
                    {available && !isUnlocked && <div className="text-[10px] font-mono text-emerald-300">可研发</div>}
                    {!available && !isUnlocked && <div className="text-[10px] font-mono text-slate-600">未开放</div>}
                    {isUnlocked && <div className="text-[10px] font-mono text-sky-400">已研发</div>}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

