import React from 'react';
import { motion } from 'motion/react';
import { Play, Sparkles, BookOpen, Target } from 'lucide-react';
import { BuildInfo, Language } from '../types';
import { UI_STRINGS } from '../i18n';

interface BuildManualProps {
  build: BuildInfo;
  onStart: () => void;
  language: Language;
}

export default function BuildManual({ build, onStart, language }: BuildManualProps) {
  const t = UI_STRINGS[language];
  const content = build.manual[language];
  const localizedTitle = t.buildTitles[build.id];
  const localizedDescription = t.buildDescriptions[build.id];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-[100] bg-white/95 backdrop-blur-xl flex items-center justify-center p-6"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="max-w-2xl w-full bg-white shadow-2xl rounded-[2.5rem] border border-gray-100 overflow-hidden flex flex-col md:flex-row"
      >
        {/* Left Visual Area */}
        <div className="md:w-1/3 p-10 flex flex-col items-center justify-center text-white" style={{ backgroundColor: build.color }}>
           <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mb-4">
              <BookOpen size={40} />
           </div>
           <h3 className="text-xl font-bold uppercase tracking-tighter text-center">{localizedTitle}</h3>
           <p className="text-white/60 text-xs font-bold mt-2">SENSORY DIAGNOSIS</p>
        </div>

        {/* Right Info Area */}
        <div className="md:w-2/3 p-10 md:p-12">
            <header className="mb-8">
                <div className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: build.color }}>
                    {localizedDescription}
                </div>
                <h2 className="text-4xl font-black text-gray-900 tracking-tight">{localizedTitle}</h2>
            </header>

            <div className="space-y-6 mb-10">
                <section className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex-shrink-0 flex items-center justify-center text-gray-400">
                        <Target size={20} />
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 text-sm">{t.objective}</h4>
                        <p className="text-gray-500 text-sm leading-relaxed">{content.objective}</p>
                    </div>
                </section>

                <section className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex-shrink-0 flex items-center justify-center text-gray-400">
                        <Play size={20} className="fill-current" />
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 text-sm">{t.action}</h4>
                        <p className="text-gray-500 text-sm leading-relaxed">{content.action}</p>
                    </div>
                </section>
            </div>

            <button
                onClick={onStart}
                style={{ backgroundColor: build.color }}
                className="w-full py-4 rounded-2xl text-white font-bold text-lg shadow-lg hover:brightness-95 transition-all flex items-center justify-center gap-2 group"
            >
                {t.start} <Play size={18} className="fill-white transition-transform group-hover:translate-x-1" />
            </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
