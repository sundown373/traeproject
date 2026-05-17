import React from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/useGameStore';
import { CheckCircle2, XCircle } from 'lucide-react';

export const ResultScene: React.FC = () => {
  const result = useGameStore(state => state.lastResult);
  const currentOrder = useGameStore(state => state.currentOrder);
  const continueAfterResult = useGameStore(state => state.continueAfterResult);
  const setScene = useGameStore(state => state.setScene);

  if (!result) return null;

  const handleContinue = () => {
    if (result.proceedAction === 'retry') {
      setScene('workshop');
      continueAfterResult();
      return;
    }
    continueAfterResult();
  };

  const buttonLabel =
    result.proceedAction === 'skip'
      ? '跳过该历史节点'
      : result.proceedAction === 'advance'
        ? '继续推进时间'
        : '返回车间修改';

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-slate-900/90 z-50 p-4 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`max-w-xl w-full p-8 shadow-2xl blueprint-border bg-slate-800 ${result.success ? 'border-sky-500' : (currentOrder.kind === 'special' ? 'border-amber-500' : 'border-red-500')}`}
      >
        <div className="flex items-center gap-4 mb-6 border-b border-slate-700 pb-4">
          {result.success ? (
            <CheckCircle2 className="text-emerald-400" size={40} />
          ) : (
            <XCircle className={currentOrder.kind === 'special' ? 'text-amber-400' : 'text-red-400'} size={40} />
          )}
          <h2 className="text-3xl font-mono font-bold text-white">
            {result.success ? '试飞成功' : (currentOrder.kind === 'special' ? '节点未达成' : '试飞失败')}
          </h2>
        </div>

        <p className="text-lg text-slate-300 mb-8 font-mono">
          {result.message}
        </p>

        <div className="mt-8 flex justify-end">
          <button
            onClick={handleContinue}
            className={`px-6 py-3 font-mono font-bold transition-colors ${
              result.proceedAction === 'skip'
                ? 'bg-amber-700 hover:bg-amber-600 text-white'
                : result.success 
                  ? 'bg-sky-600 hover:bg-sky-500 text-white' 
                  : 'bg-slate-700 hover:bg-slate-600 text-white'
            }`}
          >
            {buttonLabel}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
