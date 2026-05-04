import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Eye, Target } from 'lucide-react';
import { Language } from '../../types';
import { UI_STRINGS } from '../../i18n';

interface BuildProps {
  onComplete: (score: number) => void;
  language: Language;
}

export default function Build07Vision({ onComplete, language }: BuildProps) {
  const t = UI_STRINGS[language];
  const [target, setTarget] = useState<{ x: number, y: number, value: number } | null>(null);
  const [hits, setHits] = useState(0);
  const [startTime] = useState(Date.now());
  const GOAL = 5;

  const spawnTarget = () => {
    // Top, Bottom, Left, Right edges
    const positions = [
        { x: 10, y: 10 }, { x: 90, y: 10 },
        { x: 10, y: 90 }, { x: 90, y: 90 },
        { x: 50, y: 5 }, { x: 50, y: 95 },
        { x: 5, y: 50 }, { x: 95, y: 50 }
    ];
    const pos = positions[Math.floor(Math.random() * positions.length)];
    const val = Math.floor(Math.random() * 9) + 1;
    setTarget({ ...pos, value: val });
  };

  useEffect(() => {
    spawnTarget();
  }, []);

  const handleHit = () => {
    if (hits + 1 >= GOAL) {
      const timeTaken = (Date.now() - startTime) / 1000;
      const score = Math.max(0, Math.min(100, 100 - (timeTaken - 8) * 4));
      onComplete(score);
    } else {
      setHits(h => h + 1);
      setTarget(null);
      setTimeout(spawnTarget, 400);
    }
  };

  return (
    <div className="w-full h-full relative overflow-hidden bg-white flex items-center justify-center">
      {/* Fixed Center Point */}
      <div className="flex flex-col items-center gap-4 z-10 pointer-events-none">
          <div className="w-4 h-4 rounded-full bg-red-500 animate-ping" />
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">{t.focusCenter}</p>
      </div>

      <div className="absolute inset-x-0 top-12 text-center pointer-events-none">
        <h3 className="text-2xl font-bold text-gray-300">{t.peripheralScore}</h3>
      </div>

      <AnimatePresence>
        {target && (
            <motion.button
                key={`${target.x}-${target.y}`}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                onClick={handleHit}
                className="absolute w-16 h-16 bg-[#E67C19] text-white text-3xl font-black rounded-3xl shadow-xl flex items-center justify-center z-20"
                style={{ left: `${target.x}%`, top: `${target.y}%`, transform: 'translate(-50%, -50%)' }}
            >
                {target.value}
            </motion.button>
        )}
      </AnimatePresence>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-2">
        {Array.from({ length: GOAL }).map((_, i) => (
          <div 
            key={i} 
            className={`w-10 h-2 rounded-full transition-all ${i < hits ? 'bg-[#E67C19]' : 'bg-gray-100'}`}
          />
        ))}
      </div>
    </div>
  );
}
