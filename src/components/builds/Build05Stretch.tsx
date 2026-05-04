import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MousePointer2, CheckCircle2, Target } from 'lucide-react';
import { ATOMS, Language } from '../../types';
import { UI_STRINGS } from '../../i18n';

interface BuildProps {
  onComplete: (score: number) => void;
  language: Language;
}

export default function Build05Stretch({ onComplete, language }: BuildProps) {
  const t = UI_STRINGS[language];
  const [dots, setDots] = useState<{ x: number, y: number, id: number }[]>([]);
  const [activeDot, setActiveDot] = useState(0);
  const [startTime] = useState(Date.now());
  const [errors, setErrors] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Generate 8 dots in a geometric path
  useEffect(() => {
    const newDots = [];
    const count = 8;
    const margin = 100;
    
    // Zigzag or path
    for (let i = 0; i < count; i++) {
        // Simple circular path for tracing
        const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
        const radius = 120;
        newDots.push({
            x: 50 + Math.cos(angle) * 35, // percentage
            y: 50 + Math.sin(angle) * 35, // percentage
            id: i
        });
    }
    setDots(newDots);
  }, []);

  const handleDotEnter = (id: number) => {
    if (id === activeDot) {
        if (id === dots.length - 1) {
            // Success
            const timeTaken = (Date.now() - startTime) / 1000;
            const score = Math.max(0, Math.min(100, 100 - (timeTaken - 5) * 5 - errors * 5));
            onComplete(score);
        } else {
            setActiveDot(prev => prev + 1);
        }
    } else if (id > activeDot) {
        // Wrong dot
        setErrors(e => e + 1);
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-[#F8F9FA] select-none" ref={containerRef}>
      <div className="text-center mb-12">
        <h3 className="text-2xl font-black bg-white px-8 py-3 rounded-2xl border border-gray-100 shadow-sm uppercase tracking-tight">
          Steady Hand Test
        </h3>
        <p className="text-xs text-gray-400 font-bold mt-4 uppercase tracking-widest">Connect dots 1 to {dots.length} precisely</p>
      </div>

      <div className="relative w-full max-w-lg aspect-square bg-white rounded-[3rem] border border-gray-100 shadow-xl overflow-hidden">
         {/* Background Path Hint */}
         <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-5">
            <path 
              d={`M ${dots.map(d => `${d.x}% ${d.y}%`).join(' L ')} Z`}
              fill="none" 
              stroke="black" 
              strokeWidth="5" 
              strokeDasharray="10 10"
            />
         </svg>

         {dots.map((dot, idx) => {
            const isCompleted = idx < activeDot;
            const isActive = idx === activeDot;
            const isTarget = idx === activeDot;

            return (
              <motion.div
                key={dot.id}
                className="absolute"
                style={{ 
                    left: `${dot.x}%`, 
                    top: `${dot.y}%`,
                    transform: 'translate(-50%, -50%)'
                }}
              >
                <div 
                  onMouseEnter={() => handleDotEnter(idx)}
                  className={`
                    w-12 h-12 rounded-full flex items-center justify-center font-black transition-all cursor-crosshair
                    ${isCompleted ? 'bg-cyan-500 text-white' : isActive ? 'bg-gray-900 text-white scale-110 shadow-xl ring-4 ring-cyan-500/20' : 'bg-gray-100 text-gray-300'}
                  `}
                >
                  {isCompleted ? <CheckCircle2 size={24} /> : idx + 1}
                </div>
              </motion.div>
            );
         })}
      </div>

      <div className="mt-12 flex gap-4 items-center">
         <div className="flex gap-1">
            {dots.map((_, i) => (
                <div 
                  key={i} 
                  className={`w-4 h-1 rounded-full transition-all ${i < activeDot ? 'bg-cyan-500 w-8' : 'bg-gray-200'}`} 
                />
            ))}
         </div>
      </div>
    </div>
  );
}
