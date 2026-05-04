import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Target, CheckCircle2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { ATOMS, Language } from '../../types';
import { UI_STRINGS } from '../../i18n';

interface BuildProps {
  onComplete: (score: number) => void;
  language: Language;
}

export default function Build02Grid({ onComplete, language }: BuildProps) {
  const t = UI_STRINGS[language];
  const startTimeRef = useRef<number>(Date.now());
  const [grid, setGrid] = useState<number[]>([]);
  const [targetSum, setTargetSum] = useState(10);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [successCount, setSuccessCount] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
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
    // Ensure target sum is achievable with 2-3 numbers
    const numToSum = Math.floor(Math.random() * 2) + 2; // 2 or 3
    const indices = Array.from({ length: GRID_SIZE }, (_, i) => i).sort(() => Math.random() - 0.5);
    const sum = indices.slice(0, numToSum).reduce((acc, idx) => acc + newGrid[idx], 0);
    setTargetSum(sum);
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
      // Success! Clear selection immediately for visual feedback
      setSelectedIndices([]);
      
      // Brief delay before the next round for clear transition
      setTimeout(() => {
        setSuccessCount(s => s + 1);
        if (successCount + 1 < GOAL_SCORE) {
          generateGrid();
        }
      }, 400);
    } else if (currentSum > targetSum) {
      // Failed, reset selection
      setSelectedIndices([]);
    } else {
      setSelectedIndices(newIndices);
    }
  };

  useEffect(() => {
    if (successCount >= GOAL_SCORE && !isCompleted) {
      setIsCompleted(true);
      const timeTaken = (Date.now() - startTimeRef.current) / 1000;
      // Score: Quick summation, average 10-15s
      const performanceScore = Math.max(0, Math.min(100, 100 - (timeTaken - 13) * 3));
      setTimeout(() => onComplete(performanceScore), 1500);
    }
  }, [successCount, onComplete, isCompleted]);

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
              key={`${idx}-${val}-${successCount}`}
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
              i < successCount ? "bg-[#EA4335]" : "bg-gray-200"
            )}
           />
        ))}
      </div>

      <AnimatePresence>
        {successCount >= GOAL_SCORE && (
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
            <p className="text-2xl font-medium opacity-80">{t.nextProceed}</p>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* [ASK AI] "Prompt Gemini: Make the grid wobble or shake when an incorrect sum is reached" */}
    </div>
  );
}
