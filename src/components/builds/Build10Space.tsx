import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Grid3X3, RotateCcw } from 'lucide-react';
import { ATOMS, Language } from '../../types';
import { UI_STRINGS } from '../../i18n';

interface BuildProps {
  onComplete: (score: number) => void;
  language: Language;
}

export default function Build10Space({ onComplete, language }: BuildProps) {
  const t = UI_STRINGS[language];
  const [sequence, setSequence] = useState<number[]>([]);
  const [userInput, setUserInput] = useState<number[]>([]);
  const [isShowing, setIsShowing] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [level, setLevel] = useState(3);
  const [successCount, setSuccessCount] = useState(0);
  const [startTime] = useState(Date.now());
  const GOAL = 3;

  const generateSequence = () => {
    const newSeq = [];
    for (let i = 0; i < level; i++) {
      newSeq.push(Math.floor(Math.random() * 9));
    }
    setSequence(newSeq);
    setUserInput([]);
    setIsShowing(true);
    showSequence(newSeq);
  };

  const showSequence = async (seq: number[]) => {
    for (let i = 0; i < seq.length; i++) {
        setCurrentIndex(seq[i]);
        await new Promise(r => setTimeout(r, 600));
        setCurrentIndex(-1);
        await new Promise(r => setTimeout(r, 200));
    }
    setIsShowing(false);
  };

  useEffect(() => {
    generateSequence();
  }, []);

  const handleBoxClick = (idx: number) => {
    if (isShowing) return;

    const newInput = [...userInput, idx];
    setUserInput(newInput);

    // Reversed check
    const reversedSeq = [...sequence].reverse();
    const correctIdx = reversedSeq[newInput.length - 1];

    if (idx !== correctIdx) {
      // Wrong, restart Level
      setUserInput([]);
      generateSequence();
      return;
    }

    if (newInput.length === sequence.length) {
      if (successCount + 1 >= GOAL) {
        const timeTaken = (Date.now() - startTime) / 1000;
        const score = Math.max(0, Math.min(100, 100 - (timeTaken - 15) * 3));
        onComplete(score);
      } else {
        setSuccessCount(s => s + 1);
        setTimeout(generateSequence, 800);
      }
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-[#F8F9FA]">
        <div className="text-center mb-12">
            <h3 className="text-2xl font-bold bg-white px-8 py-3 rounded-2xl border border-gray-100 shadow-sm uppercase">
               {t.spaceScore}
            </h3>
            <p className="text-xs text-gray-400 font-bold mt-4 uppercase tracking-tighter">{t.reverseOrder}</p>
        </div>

        <div className="grid grid-cols-3 gap-4 w-full max-w-sm mb-12">
            {Array.from({ length: 9 }).map((_, i) => {
                const isActive = currentIndex === i;
                return (
                    <motion.button
                        key={i}
                        whileHover={!isShowing ? { scale: 1.05 } : {}}
                        whileTap={!isShowing ? { scale: 0.95 } : {}}
                        onClick={() => handleBoxClick(i)}
                        className={`aspect-square rounded-3xl transition-all duration-300 border-2 ${
                            isActive ? 'bg-[#34A853] border-[#34A853] shadow-lg shadow-[#34A853]/40' : 'bg-white border-gray-100 shadow-sm'
                        }`}
                        disabled={isShowing}
                    >
                        <div className="flex items-center justify-center text-3xl font-black text-gray-100 italic">
                            {i + 1}
                        </div>
                    </motion.button>
                );
            })}
        </div>

        <div className="flex gap-2">
            {Array.from({ length: GOAL }).map((_, i) => (
                <div key={i} className={`h-3 rounded-full transition-all ${i < successCount ? 'bg-[#34A853] w-12' : 'bg-gray-200 w-4'}`} />
            ))}
        </div>
    </div>
  );
}
