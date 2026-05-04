import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, AlertTriangle } from 'lucide-react';
import { Language } from '../../types';
import { UI_STRINGS } from '../../i18n';

interface BuildProps {
  onComplete: (score: number) => void;
  language: Language;
}

export default function Build08Stroop({ onComplete, language }: BuildProps) {
  const t = UI_STRINGS[language];
  const [currentTask, setCurrentTask] = useState<{ text: string, color: string, colorKey: string } | null>(null);
  const [score, setScore] = useState(0);
  const [startTime] = useState(Date.now());
  const GOAL = 5;

  const COLORS = {
    red: { name: t.colorNames.red, hex: '#EA4335' },
    blue: { name: t.colorNames.blue, hex: '#4285F4' },
    green: { name: t.colorNames.green, hex: '#34A853' },
    yellow: { name: t.colorNames.yellow, hex: '#FBBC04' }
  };

  const generateTask = () => {
    const colorKeys = Object.keys(COLORS);
    const textKey = colorKeys[Math.floor(Math.random() * colorKeys.length)];
    let colorKey = colorKeys[Math.floor(Math.random() * colorKeys.length)];
    
    // Ensure interference most of the time
    if (Math.random() > 0.2) {
       while(colorKey === textKey) {
          colorKey = colorKeys[Math.floor(Math.random() * colorKeys.length)];
       }
    }
    
    setCurrentTask({
        text: (COLORS as any)[textKey].name,
        color: (COLORS as any)[colorKey].hex,
        colorKey: colorKey
    });
  };

  useEffect(() => {
    generateTask();
  }, []);

  const handleAnswer = (key: string) => {
    if (currentTask && key === currentTask.colorKey) {
      if (score + 1 >= GOAL) {
        const timeTaken = (Date.now() - startTime) / 1000;
        const performanceScore = Math.max(0, Math.min(100, 100 - (timeTaken - 6) * 5));
        onComplete(performanceScore);
      } else {
        setScore(s => s + 1);
        generateTask();
      }
    } else {
      // Penalty or just shake? 
      // Reset progress to make it harder
      setScore(0);
      generateTask();
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-white">
      <div className="text-center mb-16">
        <h3 className="text-2xl font-bold bg-gray-50 px-8 py-3 rounded-2xl border border-gray-100 uppercase tracking-tighter">
          {t.selectColor}
        </h3>
      </div>

      <AnimatePresence mode="wait">
        {currentTask && (
          <motion.div
            key={currentTask.text + currentTask.color}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="text-7xl md:text-9xl font-black mb-20 tracking-tighter"
            style={{ color: currentTask.color }}
          >
            {currentTask.text}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
        {Object.entries(COLORS).map(([key, info]) => (
          <motion.button
            key={key}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleAnswer(key)}
            className="flex items-center justify-center p-6 border-2 rounded-[2rem] font-black text-lg transition-all"
            style={{ borderColor: info.hex, color: info.hex }}
          >
            {info.name}
          </motion.button>
        ))}
      </div>

      <div className="mt-12 flex gap-2">
        {Array.from({ length: GOAL }).map((_, i) => (
          <div 
            key={i} 
            className={`w-10 h-2 rounded-full transition-all ${i < score ? 'bg-black' : 'bg-gray-100'}`}
          />
        ))}
      </div>
    </div>
  );
}
