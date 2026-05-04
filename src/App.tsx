/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, LayoutGroup } from 'motion/react';
import { ChevronRight, Play, RefreshCcw, Info, Globe, RotateCcw, Zap, Printer, CheckCircle2 } from 'lucide-react';
import { BuildId, BUILDS, ATOMS, Language } from './types';
import { cn } from './lib/utils';
import { UI_STRINGS } from './i18n';

// Lazy load builds
import Build01Golf from './components/builds/Build01Golf';
import Build02Grid from './components/builds/Build02Grid';
import Build03Wheel from './components/builds/Build03Wheel';
import Build04Voice from './components/builds/Build04Voice';
import Build05Stretch from './components/builds/Build05Stretch';
import Build06Visual from './components/builds/Build06Visual';
import Build07Vision from './components/builds/Build07Vision';
import Build08Stroop from './components/builds/Build08Stroop';
import Build09Multi from './components/builds/Build09Multi';
import Build10Space from './components/builds/Build10Space';
import BuildManual from './components/BuildManual';

export default function App() {
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('number-lab-lang') as Language) || 'en';
  });

  // Track performance scores for the final report
  const [diagnosisData, setDiagnosisData] = useState<Record<string, number>>({
    reaction: 0, memory: 0, timing: 0, breath: 0, motor: 0,
    visual: 0, peripheral: 0, cognitive: 0, focus: 0, space: 0
  });

  // Optimized cursor using Framer Motion values (no re-renders on move)
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  
  const springConfig = { damping: 25, stiffness: 250 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [cursorX, cursorY]);

  // Handle Touch for Mobile
  useEffect(() => {
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) {
        cursorX.set(e.touches[0].clientX);
        cursorY.set(e.touches[0].clientY);
      }
    };
    window.addEventListener('touchmove', handleTouchMove);
    return () => window.removeEventListener('touchmove', handleTouchMove);
  }, [cursorX, cursorY]);

  const [activeBuildId, setActiveBuildId] = useState<BuildId>('build-01');
  
  const [unlockedBuilds, setUnlockedBuilds] = useState<BuildId[]>(() => {
    const saved = localStorage.getItem('number-lab-progress');
    return saved ? JSON.parse(saved) : ['build-01'];
  });

  const [isIntro, setIsIntro] = useState(true);
  const [isFinished, setIsFinished] = useState(false);
  const [showLabGuide, setShowLabGuide] = useState(false);
  const [showManual, setShowManual] = useState(false);
  const [showSkip, setShowSkip] = useState(false);
  const skipTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (activeBuildId && !isIntro && !isFinished) {
      setShowSkip(false);
      if (skipTimerRef.current) clearTimeout(skipTimerRef.current);
      skipTimerRef.current = setTimeout(() => {
        setShowSkip(true);
      }, 30000);
    }
    return () => {
      if (skipTimerRef.current) clearTimeout(skipTimerRef.current);
    };
  }, [activeBuildId, isIntro, isFinished]);

  const activeBuild = BUILDS.find(b => b.id === activeBuildId)!;
  const t = UI_STRINGS[language];

  // Persist language
  useEffect(() => {
    localStorage.setItem('number-lab-lang', language);
  }, [language]);

  // Persist progress
  useEffect(() => {
    localStorage.setItem('number-lab-progress', JSON.stringify(unlockedBuilds));
  }, [unlockedBuilds]);

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
    } else {
      setIsFinished(true);
    }
  };

  const handleResetProgress = () => {
    if (confirm(language === 'ko' ? '모든 진행 상황을 초기화할까요?' : 'Reset all progress?')) {
      setUnlockedBuilds(['build-01']);
      setActiveBuildId('build-01');
      setIsIntro(true);
      setShowLabGuide(false);
      localStorage.removeItem('number-lab-progress');
    }
  };

  const handleBuildComplete = (score: number) => {
    setShowSkip(false);
    if (skipTimerRef.current) clearTimeout(skipTimerRef.current);

    const categories: Record<BuildId, string> = {
      'build-01': 'reaction',
      'build-02': 'memory',
      'build-03': 'timing',
      'build-04': 'breath',
      'build-05': 'motor',
      'build-06': 'visual',
      'build-07': 'peripheral',
      'build-08': 'cognitive',
      'build-09': 'focus',
      'build-10': 'space',
    };
    
    setDiagnosisData(prev => ({
      ...prev,
      [categories[activeBuildId]]: Math.round(score)
    }));
    
    handleNextBuild();
  };

  const renderBuild = () => {
    switch (activeBuildId) {
      case 'build-01': return <Build01Golf onComplete={handleBuildComplete} language={language} />;
      case 'build-02': return <Build02Grid onComplete={handleBuildComplete} language={language} />;
      case 'build-03': return <Build03Wheel onComplete={handleBuildComplete} language={language} />;
      case 'build-04': return <Build04Voice onComplete={handleBuildComplete} language={language} />;
      case 'build-05': return <Build05Stretch onComplete={handleBuildComplete} language={language} />;
      case 'build-06': return <Build06Visual onComplete={handleBuildComplete} language={language} />;
      case 'build-07': return <Build07Vision onComplete={handleBuildComplete} language={language} />;
      case 'build-08': return <Build08Stroop onComplete={handleBuildComplete} language={language} />;
      case 'build-09': return <Build09Multi onComplete={handleBuildComplete} language={language} />;
      case 'build-10': return <Build10Space onComplete={handleBuildComplete} language={language} />;
      default: return null;
    }
  };


  return (
    <div className="fixed inset-0 select-none isolate">
      <AnimatePresence mode="wait">
        {isIntro ? (
          <div key="intro" className="absolute inset-0 bg-white flex flex-col items-center justify-start p-8 text-center text-[#202124] font-sans selection:bg-[#4285F4] selection:text-white overflow-y-auto">
            <AnimatePresence mode="wait">
              {!showLabGuide ? (
                <motion.div
                  key="landing"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="max-w-xl pt-24 pb-16"
                >
                  <div className="flex items-center justify-center gap-3 mb-6">
                    <div className="w-4 h-4 rounded-full bg-[#4285F4] animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-4 h-4 rounded-full bg-[#EA4335] animate-bounce" style={{ animationDelay: '100ms' }} />
                    <div className="w-4 h-4 rounded-full bg-[#FBBC04] animate-bounce" style={{ animationDelay: '200ms' }} />
                    <div className="w-4 h-4 rounded-full bg-[#34A853] animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  
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
                  className="max-w-5xl w-full pt-28 pb-16 px-4"
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
                          <h4 className="font-black text-gray-900 mb-3 text-lg">{t.buildTitles[build.id]}</h4>
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
                                {idx === 5 && t.mission06}
                                {idx === 6 && t.mission07}
                                {idx === 7 && t.mission08}
                                {idx === 8 && t.mission09}
                                {idx === 9 && t.mission10}
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
        ) : (
          <div key="lab" className="absolute inset-0 bg-[#F8F9FA] flex flex-col items-stretch overflow-hidden select-none">
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
                  {t.buildTitles[activeBuild.id]}
                </div>
              </div>

              <nav className="hidden lg:flex items-center gap-1 bg-gray-100/50 p-1 rounded-full border border-gray-100">
                {BUILDS.map((build, idx) => {
                  const isUnlocked = unlockedBuilds.includes(build.id);
                  const isActive = activeBuildId === build.id;
                  return (
                    <button
                      key={build.id}
                      disabled={!isUnlocked}
                      onClick={() => setActiveBuildId(build.id)}
                      className={cn(
                        "px-3 py-1.5 rounded-full text-[10px] font-black transition-all uppercase tracking-tighter whitespace-nowrap",
                        isActive ? "bg-white text-black shadow-sm" : isUnlocked ? "text-gray-400 hover:text-black" : "text-gray-200 cursor-not-allowed"
                      )}
                    >
                      {String(idx + 1).padStart(2, '0')}. {t.buildTitles[build.id].split(' ')[0]}
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
                  onClick={handleResetProgress}
                  className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors"
                  title="Reset Lab"
                >
                  <RefreshCcw size={18} />
                </button>
              </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 relative overflow-hidden bg-white flex flex-col md:flex-row">
              <div className="flex-1 relative overflow-hidden">
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
              </div>

              {/* Information Panel - Hidden on Mobile, Sidebar on Desktop */}
              {!showManual && !isFinished && (
                <div className="hidden xl:flex w-80 border-l border-gray-100 bg-gray-50/50 flex-col p-8 z-40 overflow-y-auto shrink-0">
                   <div className="mb-10">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">{t.guideTitle}</p>
                      <h4 className="text-sm font-black text-gray-900 uppercase tracking-tight mb-2 flex items-center gap-2">
                        <span className="w-1.5 h-6 bg-black rounded-full" /> {t.objective}
                      </h4>
                      <p className="text-sm text-gray-500 leading-relaxed font-medium">
                        {activeBuild.manual[language].objective}
                      </p>
                   </div>

                   <div>
                      <h4 className="text-sm font-black text-gray-900 uppercase tracking-tight mb-2 flex items-center gap-2">
                        <span className="w-1.5 h-6 bg-gray-300 rounded-full" /> {t.action}
                      </h4>
                      <p className="text-sm text-gray-500 leading-relaxed font-medium">
                        {activeBuild.manual[language].action}
                      </p>
                   </div>

                   <div className="mt-auto bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 lowercase">{t.ready}</p>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gray-900 flex items-center justify-center text-white">
                           <Zap size={20} fill="white" />
                        </div>
                        <div className="flex-1">
                           <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                              <motion.div 
                                className="h-full bg-blue-500"
                                initial={{ width: "0%" }}
                                animate={{ width: "100%" }}
                                transition={{ duration: 2, repeat: Infinity }}
                              />
                           </div>
                        </div>
                      </div>
                   </div>
                </div>
              )}
            </main>

            {/* Performance HUD - Top Left */}
            <div className="absolute top-20 left-6 z-40 flex flex-col gap-2 pointer-events-none">
               <div className="bg-black/90 backdrop-blur-xl px-5 py-3 rounded-2xl border border-white/10 shadow-2xl pointer-events-auto">
                  <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-0.5">{t.buildStatus}</p>
                  <p className="text-base font-bold text-white flex items-center gap-2">
                     <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shadow-[0_0_10px_rgba(66,133,244,0.6)]" />
                     {t.buildTitles[activeBuild.id]}
                  </p>
               </div>

               <AnimatePresence>
                 {showSkip && (
                   <motion.button
                     initial={{ opacity: 0, x: -20 }}
                     animate={{ opacity: 1, x: 0 }}
                     exit={{ opacity: 0, x: -20 }}
                     onClick={() => handleBuildComplete(0)}
                     className="bg-red-500/20 backdrop-blur px-5 py-2.5 rounded-2xl border border-red-500/30 text-red-400 font-black text-[9px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all flex items-center gap-2 shadow-xl pointer-events-auto"
                   >
                     <Zap size={12} className="animate-pulse" /> {t.skipTest}
                   </motion.button>
                 )}
               </AnimatePresence>
            </div>

            {/* Mobile Nav */}
            <div className="md:hidden p-4 bg-white border-t border-gray-100 flex justify-center gap-4">
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

            {/* Final Report Overlay */}
            <AnimatePresence>
              {isFinished && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="fixed inset-0 z-[200] bg-white flex flex-col pt-24 md:pt-32 p-8 md:p-16 overflow-y-auto"
                >
                    {/* Actions Panel - Hidden for Print */}
                    <div className="flex justify-end gap-3 mb-8 print:hidden">
                        <button 
                            onClick={() => window.print()}
                            className="bg-gray-900 text-white px-8 py-3 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center gap-2 hover:shadow-xl transition-all"
                        >
                            <Printer size={18} /> {t.printReport}
                        </button>
                        <button 
                            onClick={() => window.location.reload()}
                            className="bg-gray-100 text-gray-900 px-8 py-3 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center gap-2 hover:bg-gray-200 transition-all"
                        >
                            <RotateCcw size={18} /> {t.startOver}
                        </button>
                    </div>

                    <div className="max-w-5xl w-full mx-auto">
                        <header className="mb-12 border-b-4 border-gray-900 pb-12">
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                                <div>
                                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none mb-4">{t.reportTitle}</h1>
                                    <p className="text-xl text-gray-500 max-w-lg font-medium leading-relaxed">
                                        {t.completeMsg}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Diagnosis ID</p>
                                    <p className="font-mono text-sm uppercase">LAB-{Date.now().toString(36).toUpperCase()}</p>
                                </div>
                            </div>
                        </header>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
                            {/* Stats Grid */}
                            <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-5 gap-3">
                                {[
                                  { label: t.reactionScore, key: 'reaction', color: ATOMS.blue },
                                  { label: t.memoryScore, key: 'memory', color: ATOMS.red },
                                  { label: t.timingScore, key: 'timing', color: ATOMS.yellow },
                                  { label: t.breathScore, key: 'breath', color: ATOMS.green },
                                  { label: t.motorScore, key: 'motor', color: ATOMS.cyan },
                                  { label: t.visualScore, key: 'visual', color: ATOMS.purple },
                                  { label: t.peripheralScore, key: 'peripheral', color: ATOMS.orange },
                                  { label: t.cognitiveScore, key: 'cognitive', color: ATOMS.red },
                                  { label: t.focusScore, key: 'focus', color: ATOMS.pink },
                                  { label: t.spaceScore, key: 'space', color: ATOMS.green }
                                ].map((item) => (
                                <div key={item.key} className="bg-gray-50 border border-gray-100 p-4 rounded-3xl flex flex-col items-center">
                                    <p className="text-[9px] font-black text-gray-400 uppercase mb-3 tracking-widest leading-none text-center h-8 flex items-center">{item.label}</p>
                                    <div className="relative w-16 h-16 flex items-center justify-center">
                                        <svg className="absolute inset-0 w-full h-full -rotate-90">
                                            <circle cx="32" cy="32" r="28" fill="transparent" stroke="rgba(0,0,0,0.05)" strokeWidth="3" />
                                            <motion.circle 
                                                cx="32" cy="32" r="28" 
                                                fill="transparent" 
                                                stroke={item.color} 
                                                strokeWidth="3" 
                                                strokeDasharray="175.9"
                                                initial={{ strokeDashoffset: 175.9 }}
                                                animate={{ strokeDashoffset: 175.9 - (175.9 * (diagnosisData[item.key] || 0) / 100) }}
                                                transition={{ duration: 2, delay: 0.5 }}
                                            />
                                        </svg>
                                        <span className="text-xl font-black text-gray-900">{Math.round(diagnosisData[item.key] || 0)}</span>
                                    </div>
                                </div>
                                ))}
                            </div>

                            {/* Summary View */}
                            <div className="lg:col-span-4 flex flex-col gap-6">
                                <div className="bg-gray-900 text-white p-8 rounded-[2.5rem] shadow-2xl flex-1 flex flex-col justify-between">
                                    <div>
                                        <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-2 flex items-center gap-2">
                                            <CheckCircle2 size={12} /> {t.overallRank}
                                        </p>
                                        <h3 className="text-4xl font-black leading-tight mb-6">
                                            {(Object.values(diagnosisData).reduce((a: number, b: number) => a + b, 0) as number) / 10 > 80 ? t.rankHigh : 
                                             (Object.values(diagnosisData).reduce((a: number, b: number) => a + b, 0) as number) / 10 > 50 ? t.rankMid : t.rankLow}
                                        </h3>
                                    </div>
                                    <div className="h-px bg-white/10 w-full mb-6" />
                                    <p className="text-white/60 font-medium italic leading-relaxed">
                                        {(Object.values(diagnosisData).reduce((a: number, b: number) => a + b, 0) as number) / 10 > 80 ? t.reportNarratives.high :
                                         (Object.values(diagnosisData).reduce((a: number, b: number) => a + b, 0) as number) / 10 > 50 ? t.reportNarratives.mid : t.reportNarratives.low}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 bg-gray-50 rounded-3xl border border-gray-100 mb-12">
                            <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Info size={16} /> {t.indexTitle}
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-500 text-sm leading-relaxed">
                                <p>{t.indexDesc1}</p>
                                <p>{t.indexDesc2}</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </AnimatePresence>

      {/* Optimized Custom Cursor */}
      <motion.div 
        className="custom-cursor-dot"
        style={{ x: cursorX, y: cursorY, translateX: "-50%", translateY: "-50%" }}
      />
      <motion.div 
        className="custom-cursor-ring"
        style={{ x: cursorXSpring, y: cursorYSpring, translateX: "-50%", translateY: "-50%" }}
      />
    </div>
  );
}
