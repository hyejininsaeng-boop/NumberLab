/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, Play, RefreshCcw, Info, Globe } from 'lucide-react';
import { BuildId, BUILDS, ATOMS, Language } from './types';
import { cn } from './lib/utils';
import { UI_STRINGS } from './i18n';

// Lazy load builds for better performance or just import them
// For this single-file-intent app, we'll import them normally
import Build01Golf from './components/builds/Build01Golf';
import Build02Grid from './components/builds/Build02Grid';
import Build03Wheel from './components/builds/Build03Wheel';
import Build04Voice from './components/builds/Build04Voice';
import Build05Stretch from './components/builds/Build05Stretch';
import BuildManual from './components/BuildManual';

export default function App() {
  const [language, setLanguage] = useState<Language>('en');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [activeBuildId, setActiveBuildId] = useState<BuildId>('build-01');

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const [unlockedBuilds, setUnlockedBuilds] = useState<BuildId[]>(['build-01']);
  const [isIntro, setIsIntro] = useState(true);
  const [showLabGuide, setShowLabGuide] = useState(false);
  const [showManual, setShowManual] = useState(false);

  const activeBuild = BUILDS.find(b => b.id === activeBuildId)!;
  const t = UI_STRINGS[language];

  // Show manual whenever build changes
  useEffect(() => {
    if (!isIntro && !showLabGuide) {
      setShowManual(true);
    }
  }, [activeBuildId, isIntro, showLabGuide]);

  const handleNextBuild = () => {
    const currentIndex = BUILDS.findIndex(b => b.id === activeBuildId);
    if (currentIndex < BUILDS.length - 1) {
      const nextBuild = BUILDS[currentIndex + 1];
      if (!unlockedBuilds.includes(nextBuild.id)) {
        setUnlockedBuilds(prev => [...prev, nextBuild.id]);
      }
      setActiveBuildId(nextBuild.id);
    }
  };

  const renderBuild = () => {
    switch (activeBuildId) {
      case 'build-01': return <Build01Golf onComplete={handleNextBuild} language={language} />;
      case 'build-02': return <Build02Grid onComplete={handleNextBuild} language={language} />;
      case 'build-03': return <Build03Wheel onComplete={handleNextBuild} language={language} />;
      case 'build-04': return <Build04Voice onComplete={handleNextBuild} language={language} />;
      case 'build-05': return <Build05Stretch onComplete={() => {}} language={language} />;
      default: return null;
    }
  };

  if (isIntro) {
    return (
      <div className="fixed inset-0 bg-white flex flex-col items-center justify-center p-8 text-center text-[#202124] font-sans selection:bg-[#4285F4] selection:text-white overflow-y-auto">
        <AnimatePresence mode="wait">
          {!showLabGuide ? (
            <motion.div
              key="landing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-xl py-12"
            >
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="w-4 h-4 rounded-full bg-[#4285F4] animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-4 h-4 rounded-full bg-[#EA4335] animate-bounce" style={{ animationDelay: '100ms' }} />
                <div className="w-4 h-4 rounded-full bg-[#FBBC04] animate-bounce" style={{ animationDelay: '200ms' }} />
                <div className="w-4 h-4 rounded-full bg-[#34A853] animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              
              {/* Language Selection */}
              <div className="flex justify-center gap-4 mb-8">
                 <button 
                  onClick={() => setLanguage('en')}
                  className={cn("px-4 py-2 rounded-full text-sm font-bold border transition-all", language === 'en' ? "bg-black text-white border-black" : "bg-white text-gray-400 border-gray-100 hover:border-gray-300")}
                 >
                   ENGLISH
                 </button>
                 <button 
                  onClick={() => setLanguage('ko')}
                  className={cn("px-4 py-2 rounded-full text-sm font-bold border transition-all", language === 'ko' ? "bg-black text-white border-black" : "bg-white text-gray-400 border-gray-100 hover:border-gray-300")}
                 >
                   한국어
                 </button>
                 <button 
                  onClick={() => setLanguage('ja')}
                  className={cn("px-4 py-2 rounded-full text-sm font-bold border transition-all", language === 'ja' ? "bg-black text-white border-black" : "bg-white text-gray-400 border-gray-100 hover:border-gray-300")}
                 >
                   日本語
                 </button>
              </div>

              <h1 className="text-7xl md:text-9xl font-bold tracking-tighter mb-4">{t.title}</h1>
              <p className="text-xl text-gray-400 mb-12 font-medium max-w-sm md:max-w-md mx-auto leading-relaxed whitespace-pre-line">
                {t.tagline}
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowLabGuide(true)}
                className="px-10 py-5 bg-black text-white rounded-full font-bold text-xl flex items-center gap-3 mx-auto hover:bg-[#202124] transition-all shadow-2xl shadow-black/10 group"
              >
                {t.viewGuide} <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="guide"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-5xl w-full py-12 px-4"
            >
              <header className="mb-12 text-center">
                <h2 className="text-4xl md:text-5xl font-black mb-3">{t.guideTitle}</h2>
                <p className="text-gray-500 font-medium italic">{t.guideSubtitle}</p>
              </header>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-16">
                 {BUILDS.map((build, idx) => (
                   <div key={build.id} className="bg-gray-50 p-6 rounded-[2.5rem] text-left border border-gray-100 flex flex-col items-start hover:bg-white hover:shadow-xl transition-all group">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-black mb-6 shadow-sm group-hover:scale-110 transition-transform" style={{ backgroundColor: build.color }}>
                        {idx + 1}
                      </div>
                      <h4 className="font-black text-gray-900 mb-3 text-lg">{build.title}</h4>
                      <p className="text-xs text-gray-500 leading-relaxed font-medium">
                        {build.manual[language].objective.includes(':') ? build.manual[language].objective.split(':')[1].trim() : build.manual[language].objective}
                      </p>
                      <div className="mt-4 pt-4 border-t border-gray-200 w-full">
                         <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{t.clearCondition}</p>
                         <p className="text-[11px] font-bold text-gray-700 italic">
                            {idx === 0 && t.mission01}
                            {idx === 1 && t.mission02}
                            {idx === 2 && t.mission03}
                            {idx === 3 && t.mission04}
                            {idx === 4 && t.mission05}
                         </p>
                      </div>
                   </div>
                 ))}
              </div>

              <div className="bg-[#F8F9FA] p-8 md:p-12 rounded-[3.5rem] text-left border border-gray-200 mb-12 flex flex-col lg:flex-row gap-10 items-center">
                 <div className="flex-1">
                    <h3 className="text-2xl font-black mb-6 flex items-center gap-3">
                       <Play size={24} className="fill-[#4285F4] text-[#4285F4]" /> 
                       {t.globalMissionTitle}
                    </h3>
                    <div className="space-y-4">
                        <div className="flex gap-4">
                            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold shrink-0">1</div>
                            <p className="text-gray-600 font-medium">{t.mission1}</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold shrink-0">2</div>
                            <p className="text-gray-600 font-medium">{t.mission2}</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold shrink-0">3</div>
                            <p className="text-gray-600 font-medium">{t.mission3}</p>
                        </div>
                    </div>
                 </div>
                 <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                        setIsIntro(false);
                        setShowLabGuide(false);
                        setShowManual(true);
                    }}
                    className="px-12 py-6 bg-black text-white rounded-full font-black text-2xl shadow-2xl shadow-black/20 whitespace-nowrap"
                  >
                    {t.startExperiment}
                  </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-[#F8F9FA] flex flex-col items-stretch overflow-hidden select-none">
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-gray-100 bg-white/80 backdrop-blur-md z-50">
        <div className="flex items-center gap-3">
          <div className="font-bold text-xl tracking-tighter flex items-center gap-2">
             <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-[#4285F4]" />
                <div className="w-2 h-2 rounded-full bg-[#EA4335]" />
             </div>
             {t.title}
          </div>
          <span className="text-gray-300 mx-2">/</span>
          <div className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: activeBuild.color }}></span>
            {activeBuild.title}
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-1 bg-gray-100/50 p-1 rounded-full border border-gray-100">
          {BUILDS.map((build, idx) => {
            const isUnlocked = unlockedBuilds.includes(build.id);
            const isActive = activeBuildId === build.id;
            return (
              <button
                key={build.id}
                disabled={!isUnlocked}
                onClick={() => setActiveBuildId(build.id)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-xs font-bold transition-all uppercase tracking-wider",
                  isActive ? "bg-white text-black shadow-sm" : isUnlocked ? "text-gray-400 hover:text-black" : "text-gray-200 cursor-not-allowed"
                )}
              >
                Build {String(idx + 1).padStart(2, '0')}
              </button>
            )
          })}
        </nav>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 mr-4 bg-gray-50 px-3 py-1 rounded-full text-[10px] font-black text-gray-400 border border-gray-100 shadow-inner">
             <Globe size={10} />
             {language.toUpperCase()}
          </div>
          <button 
            onClick={() => setShowManual(true)}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors"
          >
            <Info size={18} />
          </button>
          <button
            onClick={() => window.location.reload()}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors"
          >
            <RefreshCcw size={18} />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-hidden bg-white">
        <AnimatePresence mode="wait">
          {!showManual && (
            <motion.div
              key={activeBuildId}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0"
            >
              {renderBuild()}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showManual && (
            <BuildManual 
              build={activeBuild} 
              onStart={() => setShowManual(false)} 
              language={language}
            />
          )}
        </AnimatePresence>
      </main>

      {/* Mobile Nav */}
      <div className="md:hidden p-4 bg-white border-t border-gray-100 flex justify-center gap-4">
         {/* Simple build dots for mobile */}
         {BUILDS.map((build, idx) => (
           <div
            key={build.id}
            className={cn(
              "w-3 h-3 rounded-full transition-all",
              activeBuildId === build.id ? "scale-125 shadow-md" : "bg-gray-200"
            )}
            style={{ backgroundColor: activeBuildId === build.id ? activeBuild.color : undefined }}
           />
         ))}
      </div>
      <div 
        className="custom-cursor-dot"
        style={{ left: mousePos.x, top: mousePos.y, transform: 'translate(-50%, -50%)' }}
      />
      <div 
        className="custom-cursor-ring"
        style={{ left: mousePos.x, top: mousePos.y, transform: 'translate(-50%, -50%)' }}
      />
    </div>
  );
}
