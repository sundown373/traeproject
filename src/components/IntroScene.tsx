import React from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/useGameStore';
import { PenTool } from 'lucide-react';

export const IntroScene: React.FC = () => {
  const startGame = useGameStore(state => state.startGame);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-slate-900/80 z-50 p-4">
      <motion.div 
        initial={{ opacity: 0, y: 50, rotateX: 20 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="paper-texture max-w-2xl w-full p-8 md:p-12 shadow-2xl relative"
        style={{ transformPerspective: 1000 }}
      >
        <div className="absolute top-4 right-4 text-slate-400 opacity-50">
          <PenTool size={32} />
        </div>
        
        <div className="border-b-2 border-slate-300 pb-4 mb-6">
          <p className="font-mono text-sm text-slate-500 mb-2">DATE: DEC 14, 1903</p>
          <h1 className="text-3xl font-bold text-slate-800">尊敬的投资人：</h1>
        </div>

        <div className="space-y-4 text-lg leading-relaxed text-slate-700">
          <p>
            我们是奥维尔和威尔伯·莱特。我们写信给您，是想分享一个或许会改变人类历史的计划。
          </p>
          <p>
            几个月来，我们在基蒂霍克的沙丘上进行了一次又一次的滑翔测试。我们坚信，比空气重的机器是能够飞上蓝天的。现在，我们只缺最后一块拼图——一笔用于购买优质云杉木材和定制一台12马力轻型内燃机的资金。
          </p>
          <p>
            如果您愿意资助我们 <strong>$500</strong>，我们将为您提供我们的图纸仓库。不仅如此，您将成为第一家“航空制造工厂”的幕后老板。
          </p>
          <p className="italic mt-6">
            时代的风向变了，先生。天空不再是鸟类的专属。
          </p>
        </div>

        <div className="mt-12 flex justify-between items-end">
          <div className="font-mono text-xl font-bold text-slate-800 signature" style={{ fontFamily: "'Brush Script MT', cursive" }}>
            Orville & Wilbur Wright
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startGame}
            className="bg-amber-700 hover:bg-amber-800 text-white px-8 py-3 rounded-sm font-mono font-bold shadow-lg transition-colors border-2 border-amber-900"
          >
            签署投资支票 ($500)
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};
