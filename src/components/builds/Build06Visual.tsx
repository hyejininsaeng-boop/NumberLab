import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Target, Zap } from 'lucide-react';
import { ATOMS, Language } from '../../types';
import { UI_STRINGS } from '../../i18n';

interface BuildProps {
  onComplete: (score: number) => void;
  language: Language;
}

export default function Build06Visual({ onComplete, language }: BuildProps) {
  const t = UI_STRINGS[language];
  const [targetNumber, setTargetNumber] = useState(0);
  const [grid, setGrid] = useState<number[]>([]);
  const [diffIdx, setDiffIdx] = useState(-1);
  const [successCount, setSuccessCount] = useState(0);
  const [startTime] = useState(Date.now());
  const GOAL = 3;

  const generateLevel = () => {
    const num = Math.floor(Math.random() * 9) + 1;
    const newGrid = Array(16).fill(num);
    const randomIdx = Math.floor(Math.random() * 16);
    setGrid(newGrid);
    setDiffIdx(randomIdx);
    setTargetNumber(num);
  };

  useEffect(() => {
    generateLevel();
  }, []);

  const handleClick = (idx: number) => {
    if (idx === diffIdx) {
      if (successCount + 1 >= GOAL) {
        const timeTaken = (Date.now() - startTime) / 1000;
        const score = Math.max(0, Math.min(100, 100 - (timeTaken - 5) * 5));
        onComplete(score);
      } else {
        setSuccessCount(s => s + 1);
        generateLevel();
      }
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-[#F8F9FA]">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold bg-white px-6 py-2 rounded-full border border-gray-100 shadow-sm">
          {t.visualScore}
        </h3>
      </div>

      <div className="grid grid-cols-4 gap-4 max-w-sm w-full mb-8">
        {grid.map((val, idx) => {
          const isDiff = idx === diffIdx;
          // Subtly different color. 
          // [REMIX HERE] Decrease the saturation difference to make it harder
          const baseColor = "rgba(66, 133, 244, 0.45)";
          const diffColor = "rgba(66, 133, 244, 0.65)"; 
          
          return (
            <motion.button
              key={`${idx}-${successCount}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleClick(idx)}
              className="aspect-square flex items-center justify-center rounded-2xl text-2xl font-black transition-colors"
              style={{ backgroundColor: isDiff ? diffColor : baseColor, color: 'white' }}
            >
              {val}
            </motion.button>
          );
        })}
      </div>

      <div className="flex gap-2">
        {Array.from({ length: GOAL }).map((_, i) => (
          <div 
            key={i} 
            className={`w-12 h-2 rounded-full transition-all ${i < successCount ? 'bg-[#A142F4]' : 'bg-gray-200'}`}
          />
        ))}
      </div>
    </div>
  );
}
