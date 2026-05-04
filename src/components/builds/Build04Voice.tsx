import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, MicOff, Zap, Volume2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Language } from '../../types';
import { UI_STRINGS } from '../../i18n';

interface BuildProps {
  onComplete: (score: number) => void;
  language: Language;
}

export default function Build04Voice({ onComplete, language }: BuildProps) {
  const t = UI_STRINGS[language];
  const stabilityRef = useRef<number[]>([]);
  const [volume, setVolume] = useState(0);
  const [currentNumber, setCurrentNumber] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number>(0);

  const TARGET_NUMBER = 100;
  const GROWTH_FACTOR = 0.5; // [REMIX HERE] Change how fast the number grows with volume

  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      source.connect(analyserRef.current);
      
      setIsListening(true);
      setPermissionDenied(false);
      tick();
    } catch (err) {
      console.error(err);
      setPermissionDenied(true);
    }
  };

  const tick = () => {
    if (!analyserRef.current) return;
    
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);
    
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i];
    }
    const average = sum / dataArray.length;
    setVolume(average);

    // Increase current number based on volume
    if (average > 20) { // Threshold to ignore background noise
        setCurrentNumber(prev => {
            const next = prev + (average / 100) * GROWTH_FACTOR;
            return Math.min(next, TARGET_NUMBER);
        });
        stabilityRef.current.push(average);
    }

    animationRef.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    if (currentNumber >= TARGET_NUMBER && !isCompleted) {
        setIsCompleted(true);
        cancelAnimationFrame(animationRef.current);
        if (audioContextRef.current) {
            audioContextRef.current.close();
        }

        // Calculate stability score
        const data = stabilityRef.current;
        if (data.length > 50) {
            const avg = data.reduce((a, b) => a + b, 0) / data.length;
            const variance = data.reduce((a, b) => a + (b - avg) ** 2, 0) / data.length;
            const performanceScore = Math.max(0, Math.min(100, 100 - Math.sqrt(variance) * 2.5));
            setTimeout(() => onComplete(performanceScore), 2000);
        } else {
            setTimeout(() => onComplete(0), 2000);
        }
    }
  }, [currentNumber, onComplete, isCompleted]);

  useEffect(() => {
    return () => {
        cancelAnimationFrame(animationRef.current);
        if (audioContextRef.current) {
            audioContextRef.current.close();
        }
    };
  }, []);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-white relative overflow-hidden">
      {!isListening && !permissionDenied ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center z-10 p-6"
        >
          <div className="w-24 h-24 bg-[#34A853]/10 text-[#34A853] rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse shadow-inner">
             <Mic size={48} />
          </div>
          <h2 className="text-4xl font-black mb-4 uppercase tracking-tighter">{t.voiceCalibration}</h2>
          <p className="text-gray-500 mb-10 max-w-sm mx-auto leading-relaxed font-medium">
             {t.voiceDesc}
          </p>
          <button
            onClick={startListening}
            className="px-10 py-5 bg-[#34A853] text-white rounded-full font-black text-xl shadow-xl hover:bg-[#2d9648] transition-all transform hover:scale-105 active:scale-95 uppercase tracking-widest"
          >
            {t.enableSensor}
          </button>
        </motion.div>
      ) : permissionDenied ? (
        <div className="text-center z-10 px-6">
           <MicOff size={64} className="text-red-500 mx-auto mb-6" />
           <p className="text-xl font-bold text-red-500 uppercase">{t.micDenied}</p>
           <p className="text-gray-500 mt-2">{t.micEnable}</p>
        </div>
      ) : (
        <div className="flex flex-col items-center z-10 w-full max-w-2xl px-4">
            <div className="relative mb-12 flex items-center justify-center">
                 <motion.div
                    animate={{ 
                        scale: 1 + (volume / 100),
                        boxShadow: `0 0 ${volume * 2}px ${volume}px rgba(52, 168, 83, 0.2)`
                    }}
                    className="absolute w-40 h-40 bg-[#34A853]/5 rounded-full"
                 />
                 <div className="text-[12rem] font-black tabular-nums text-[#34A853] leading-none">
                    {Math.floor(currentNumber)}
                    <span className="text-3xl font-bold opacity-30">%</span>
                 </div>
            </div>

            <div className="w-full bg-gray-100 h-6 rounded-full overflow-hidden shadow-inner mb-4 border border-gray-200/50">
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${currentNumber}%` }}
                    className="h-full bg-[#34A853] transition-all duration-300"
                />
            </div>
            
            <div className="flex justify-between w-full text-[10px] font-black text-gray-400 tracking-widest uppercase">
                <span>0 {t.charge}</span>
                <div className="flex items-center gap-2 text-[#34A853]">
                   <Volume2 size={16} />
                   <span>VOLUME: {Math.floor(volume)}</span>
                </div>
                <span>100 {t.max}</span>
            </div>

            <div className="mt-16 text-center">
                <p className="text-xl font-bold text-gray-800 flex items-center justify-center gap-2">
                   <Zap size={20} className="fill-[#FBBC04] text-[#FBBC04]" /> 
                   {t.noiseMsg}
                </p>
            </div>
        </div>
      )}

      {/* Decorative background visualizer */}
      <div className="absolute inset-x-0 bottom-0 h-64 flex items-end justify-center gap-1 px-4 opacity-5 pointer-events-none">
         {[...Array(64)].map((_, i) => (
           <motion.div 
            key={i}
            animate={{ height: `${Math.random() * volume * 2}%` }}
            className="flex-1 bg-[#34A853] rounded-t-sm"
           />
         ))}
      </div>

      <AnimatePresence>
        {currentNumber >= TARGET_NUMBER && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-[#34A853] z-50 flex flex-col items-center justify-center text-white p-10 text-center"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="mb-8"
            >
              <Zap size={120} strokeWidth={3} fill="white" />
            </motion.div>
            <h2 className="text-6xl font-black mb-4 uppercase">{t.syncStatus}</h2>
            <p className="text-2xl font-medium opacity-80">{t.nextProceed}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* [ASK AI] "Prompt Gemini: Change the particle color based on frequency (red for low, blue for high)" */}
    </div>
  );
}
