import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { X, ScrollText } from 'lucide-react'
import { SpecialOrder } from '../data/orders'

type Tab = 'background' | 'geopolitics' | 'frontierTech' | 'frontierAircraft' | 'performance' | 'mission'

export const SpecialOrderModal: React.FC<{ order: SpecialOrder; open: boolean; onClose: () => void }> = ({ order, open, onClose }) => {
  const [tab, setTab] = useState<Tab>('background')
  if (!open) return null

  const dossier = order.dossier

  return (
    <div className="fixed inset-0 z-[70] bg-slate-950/80 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="mx-auto max-w-4xl blueprint-border bg-slate-900/85 overflow-hidden"
      >
        <div className="flex items-start justify-between p-5 border-b border-sky-500/30">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
              <ScrollText size={14} />
              HISTORICAL_NODE · {order.year}
            </div>
            <div className="text-2xl font-mono font-bold text-white mt-1">{order.title}</div>
            <div className="text-sm text-slate-300 mt-2">{order.description}</div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-300 hover:text-white">
            <X size={18} />
          </button>
        </div>

        <div className="p-5">
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => setTab('background')} className={`px-3 py-1 font-mono text-xs ${tab === 'background' ? 'bg-sky-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}>背景</button>
            <button onClick={() => setTab('geopolitics')} className={`px-3 py-1 font-mono text-xs ${tab === 'geopolitics' ? 'bg-sky-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}>地缘</button>
            <button onClick={() => setTab('frontierTech')} className={`px-3 py-1 font-mono text-xs ${tab === 'frontierTech' ? 'bg-sky-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}>前沿科技</button>
            <button onClick={() => setTab('frontierAircraft')} className={`px-3 py-1 font-mono text-xs ${tab === 'frontierAircraft' ? 'bg-sky-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}>前沿机型</button>
            <button onClick={() => setTab('performance')} className={`px-3 py-1 font-mono text-xs ${tab === 'performance' ? 'bg-sky-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}>参数说明</button>
            <button onClick={() => setTab('mission')} className={`px-3 py-1 font-mono text-xs ${tab === 'mission' ? 'bg-sky-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}>任务胜任</button>
          </div>

          <div className="mt-4 text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
            {tab === 'background' && dossier.background}
            {tab === 'geopolitics' && dossier.geopolitics}
            {tab === 'frontierTech' && dossier.frontierTech}
            {tab === 'frontierAircraft' && dossier.frontierAircraft}
            {tab === 'performance' && dossier.performance}
            {tab === 'mission' && dossier.missionFit}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
