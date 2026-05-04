import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Layers, Target } from 'lucide-react';
import { ATOMS, Language } from '../../types';
import { UI_STRINGS } from '../../i18n';

interface BuildProps {
  onComplete: (score: number) => void;
  language: Language;
}

export default function Build09Multi({ onComplete, language }: BuildProps) {
  const t = UI_STRINGS[language];
  const [balance, setBalance] = useState(50); // 0 to 100, must keep near 50
  const [targets, setTargets] = useState<{ id: number, x: number, y: number }[]>([]);
  const [hits, setHits] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const GOAL = 10;
  
  const balanceRef = useRef(50);
  const hitsRef = useRef(0);

  useEffect(() => {
    const driftInterval = setInterval(() => {
      const drift = (Math.random() - 0.5) * 4;
      balanceRef.current += drift;
      setBalance(balanceRef.current);

      if (balanceRef.current < 0 || balanceRef.current > 100) {
        // Failed too much drift
        balanceRef.current = 50;
        setBalance(50);
      }
    }, 50);

    const targetInterval = setInterval(() => {
      if (targets.length < 3) {
         setTargets(prev => [...prev, {
            id: Date.now(),
            x: 10 + Math.random() * 80,
            y: 10 + Math.random() * 80
         }]);
      }
    }, 1500);

    return () => {
      clearInterval(driftInterval);
      clearInterval(targetInterval);
    };
  }, [targets.length]);

  const handleTargetClick = (id: number) => {
    setTargets(prev => prev.filter(t => t.id !== id));
    hitsRef.current += 1;
    setHits(hitsRef.current);
    
    // Clicking target also helps stabilize slightly
    balanceRef.current = 50 + (balanceRef.current - 50) * 0.8;

    if (hitsRef.current >= GOAL) {
      onComplete(85); // High fixed score for multi-tasking if completed
    }
  };

  const handleBalanceAdjust = (dir: 'left' | 'right') => {
    balanceRef.current += dir === 'left' ? -10 : 10;
    setBalance(balanceRef.current);
  };

  return (
    <div className="w-full h-full relative p-8 flex flex-col items-center justify-between bg-white text-black overflow-hidden">
        <div className="text-center z-10">
            <h3 className="text-2xl font-bold bg-white/80 backdrop-blur pb-1">{t.focusScore}</h3>
        </div>

        {/* Targets */}
        <AnimatePresence>
            {targets.map(tar => (
                <motion.button
                    key={tar.id}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 1.5, opacity: 0 }}
                    onClick={() => handleTargetClick(tar.id)}
                    className="absolute w-12 h-12 bg-[#F06292] rounded-full z-20 flex items-center justify-center shadow-lg hover:bg-[#E91E63] transition-colors"
                    style={{ left: `${tar.x}%`, top: `${tar.y}%` }}
                >
                    <Target size={20} className="text-white" />
                </motion.button>
            ))}
        </AnimatePresence>

        {/* Central Balance Meter */}
        <div className="w-full max-w-sm flex flex-col items-center gap-8 z-10">
            <div className="relative w-full h-4 bg-gray-100 rounded-full border border-gray-200 shadow-inner">
                <motion.div 
                    className="absolute top-1/2 -translate-y-1/2 w-8 h-8 bg-black rounded-lg shadow-xl flex items-center justify-center text-white font-black text-xs"
                    animate={{ left: `${balance}%` }}
                    style={{ marginLeft: '-16px' }}
                >
                    9
                </motion.div>
                {/* Safe zone indicator */}
                <div className="absolute inset-y-0 left-[40%] right-[40%] bg-blue-500/10 border-x border-blue-500/20" />
            </div>

            <div className="flex gap-4">
                <button 
                  onMouseDown={() => handleBalanceAdjust('left')}
                  className="px-8 py-4 bg-gray-50 border border-gray-200 rounded-2xl active:bg-gray-200 transition-colors font-black uppercase tracking-tighter"
                >
                  {t.left}
                </button>
                <button 
                  onMouseDown={() => handleBalanceAdjust('right')}
                  className="px-8 py-4 bg-gray-50 border border-gray-200 rounded-2xl active:bg-gray-200 transition-colors font-black uppercase tracking-tighter"
                >
                  {t.right}
                </button>
            </div>
        </div>

        <div className="w-full flex justify-center gap-2 z-10">
            {Array.from({ length: GOAL }).map((_, i) => (
                <div key={i} className={`h-2 rounded-full transition-all ${i < hits ? 'bg-[#F06292] w-6' : 'bg-gray-100 w-4'}`} />
            ))}
        </div>
    </div>
  );
}
