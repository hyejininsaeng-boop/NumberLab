import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Circle, Navigation, Disc } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Language } from '../../types';
import { UI_STRINGS } from '../../i18n';

interface BuildProps {
  onComplete: (score: number) => void;
  language: Language;
}

export default function Build03Wheel({ onComplete, language }: BuildProps) {
  const t = UI_STRINGS[language];
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(true);
  const [sequence, setSequence] = useState<number[]>([]);
  const [targetSequence] = useState(() => {
    // Generate 3 random numbers from 1 to 8
    return Array.from({ length: 3 }, () => Math.floor(Math.random() * 8) + 1);
  });
  const [isCompleted, setIsCompleted] = useState(false);
  const [precisionData, setPrecisionData] = useState<number[]>([]);
  const requestRef = useRef<number>(0);

  const WHEEL_NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8];
  const SPIN_SPEED = 3.5; // [REMIX HERE] Change spin speed

  const animate = (time: number) => {
    if (isSpinning) {
      setRotation(prev => (prev + SPIN_SPEED) % 360);
    }
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [isSpinning]);

  const handleStop = () => {
    if (!isSpinning) {
      setIsSpinning(true);
      return;
    }

    // Determine target number based on rotation
    // Rotation 0 is top, numbers are placed around the circle
    const anglePerNumber = 360 / WHEEL_NUMBERS.length;
    // Normalize rotation to pick the one at the very top (pointy part)
    const normalizedRotation = (360 - (rotation % 360)) % 360;
    const centerOffset = normalizedRotation % anglePerNumber;
    const precision = Math.abs(centerOffset - (anglePerNumber / 2)); // distance from center of slice
    
    const selectedIdx = Math.floor(normalizedRotation / anglePerNumber);
    const selectedNumber = WHEEL_NUMBERS[selectedIdx];

    setIsSpinning(false);
    
    // Validate sequence
    const nextIdx = sequence.length;
    if (selectedNumber === targetSequence[nextIdx]) {
      const newSeq = [...sequence, selectedNumber];
      const newPrecisionData = [...precisionData, precision];
      setSequence(newSeq);
      setPrecisionData(newPrecisionData);

      if (newSeq.length === targetSequence.length) {
        setIsCompleted(true);
        // Average precision: 22.5 is worst, 0 is best.
        const avgPrecision = newPrecisionData.reduce((a, b) => a + b, 0) / newSeq.length;
        const performanceScore = Math.max(0, Math.min(100, 100 - avgPrecision * 4));
        setTimeout(() => onComplete(performanceScore), 2000);
      } else {
        // Wait a bit then restart spin
        setTimeout(() => setIsSpinning(true), 800);
      }
    } else {
      // Wrong number, reset sequence
      setSequence([]);
      setPrecisionData([]);
      setTimeout(() => setIsSpinning(true), 800);
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-white overflow-hidden p-8">
      <div className="mb-12 text-center">
        <div className="flex gap-4 justify-center items-center mb-4">
           {targetSequence.map((num, i) => (
             <div 
               key={i} 
               className={cn(
                 "w-16 h-16 rounded-2xl flex items-center justify-center text-3xl font-black border-4 transition-all duration-500",
                 sequence.length > i ? "bg-[#FBBC04] text-white border-[#FBBC04] scale-110" : "bg-gray-50 text-gray-200 border-gray-100"
               )}
             >
               {num}
             </div>
           ))}
        </div>
        <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">{t.unlockSequence}</p>
      </div>

      <div className="relative w-80 h-80 md:w-96 md:h-96">
        {/* Pointer */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 text-[#FBBC04]">
          <Navigation size={48} className="fill-current rotate-180" />
        </div>

        <motion.div
          className="w-full h-full rounded-full border-[1.5rem] border-gray-100 relative shadow-2xl flex items-center justify-center bg-white"
          style={{ rotate: rotation }}
        >
          {WHEEL_NUMBERS.map((num, idx) => {
            const angle = (idx * (360 / WHEEL_NUMBERS.length)) * (Math.PI / 180);
            return (
              <div
                key={num}
                className="absolute text-4xl font-black text-gray-800"
                style={{
                  transform: `translate(${Math.sin(angle) * 120}px, ${-Math.cos(angle) * 120}px) rotate(${idx * (360 / WHEEL_NUMBERS.length)}deg)`
                }}
              >
                {num}
              </div>
            );
          })}
          
          <div className="w-24 h-24 rounded-full bg-gray-50 border-8 border-gray-100 flex items-center justify-center">
             <Disc size={40} className={cn("text-gray-200", isSpinning && "animate-spin-slow")} />
          </div>
        </motion.div>
      </div>

      <div className="mt-16">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleStop}
          className={cn(
            "px-12 py-5 rounded-full font-black text-xl shadow-xl transition-all uppercase tracking-widest min-w-[240px]",
            isSpinning ? "bg-black text-white" : "bg-gray-100 text-gray-400 pointer-events-none"
          )}
        >
          {isSpinning ? t.lockNumber : t.checking}
        </motion.button>
      </div>

      <AnimatePresence>
        {isCompleted && (
          <motion.div
            initial={{ opacity: 0, scale: 1.2 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 bg-[#FBBC04] z-50 flex flex-col items-center justify-center text-white p-10 text-center"
          >
            <motion.div
              animate={{ rotateY: 360 }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="mb-8"
            >
              <Circle size={120} strokeWidth={8} />
            </motion.div>
            <h2 className="text-6xl font-black mb-4 uppercase">{t.syncStatus}</h2>
            <p className="text-2xl font-medium opacity-80">{t.nextProceed}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
      
      {/* [ASK AI] "Prompt Gemini: Add sound effects (clicky tick) as the wheel rotates past numbers" */}
    </div>
  );
}
