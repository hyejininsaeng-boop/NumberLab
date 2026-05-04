import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Target, CheckCircle2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { ATOMS, Language } from '../../types';
import { UI_STRINGS } from '../../i18n';

interface BuildProps {
  onComplete: () => void;
  language: Language;
}

export default function Build02Grid({ onComplete, language }: BuildProps) {
  const t = UI_STRINGS[language];
  const [grid, setGrid] = useState<number[]>([]);
  const [targetSum, setTargetSum] = useState(10);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const GOAL_SCORE = 3;

  // [REMIX HERE] Change grid size or allowed numbers
  const GRID_SIZE = 9; // 3x3
  const MAX_NUMBER = 9;

  useEffect(() => {
    generateGrid();
  }, []);

  const generateGrid = () => {
    const newGrid = Array.from({ length: GRID_SIZE }, () => Math.floor(Math.random() * MAX_NUMBER) + 1);
    setGrid(newGrid);
    setTargetSum(Math.floor(Math.random() * 10) + 10); // Target between 10 and 20
    setSelectedIndices([]);
  };

  const handleCellClick = (index: number) => {
    if (selectedIndices.includes(index)) {
      setSelectedIndices(prev => prev.filter(i => i !== index));
      return;
    }

    const newIndices = [...selectedIndices, index];
    const currentSum = newIndices.reduce((acc, idx) => acc + grid[idx], 0);

    if (currentSum === targetSum) {
      // Success!
      setScore(s => s + 1);
      if (score + 1 < GOAL_SCORE) {
        generateGrid();
      }
    } else if (currentSum > targetSum) {
      // Failed, reset selection
      setSelectedIndices([]);
    } else {
      setSelectedIndices(newIndices);
    }
  };

  useEffect(() => {
    if (score >= GOAL_SCORE) {
      setTimeout(onComplete, 1500);
    }
  }, [score, onComplete]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-[#F8F9FA]">
      <div className="mb-12 text-center">
         <motion.div 
          key={targetSum}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-7xl font-black text-[#EA4335] mb-2"
         >
           {targetSum}
         </motion.div>
         <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">{t.targetSum}</p>
      </div>

      <div className="grid grid-cols-3 gap-4 max-w-sm w-full">
        {grid.map((val, idx) => {
          const isSelected = selectedIndices.includes(idx);
          return (
            <motion.button
              key={`${idx}-${val}-${score}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleCellClick(idx)}
              className={cn(
                "aspect-square rounded-2xl text-4xl font-black transition-all flex items-center justify-center shadow-lg border-2",
                isSelected 
                  ? "bg-[#EA4335] text-white border-[#EA4335]" 
                  : "bg-white text-gray-800 border-gray-100 hover:border-[#EA4335]/30"
              )}
            >
              {val}
            </motion.button>
          )
        })}
      </div>

      <div className="mt-12 flex gap-4">
        {[...Array(GOAL_SCORE)].map((_, i) => (
           <div 
            key={i}
            className={cn(
              "w-12 h-2 rounded-full transition-all",
              i < score ? "bg-[#EA4335]" : "bg-gray-200"
            )}
           />
        ))}
      </div>

      <AnimatePresence>
        {score >= GOAL_SCORE && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute inset-0 bg-[#EA4335] z-50 flex flex-col items-center justify-center text-white p-10 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="mb-8"
            >
              <CheckCircle2 size={120} strokeWidth={3} />
            </motion.div>
            <h2 className="text-6xl font-black mb-4 uppercase">{t.syncStatus}</h2>
            <p className="text-2xl font-medium opacity-80">{language === 'ko' ? "다음: 패턴 분석 중..." : language === 'ja' ? "次へ：パターン分析中..." : "Next: Pattern Analysis..."}</p>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* [ASK AI] "Prompt Gemini: Make the grid wobble or shake when an incorrect sum is reached" */}
    </div>
  );
}
