import React, { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';
import { motion, AnimatePresence } from 'motion/react';
import { Target } from 'lucide-react';
import { ATOMS, Language } from '../../types';
import { cn } from '../../lib/utils';
import { UI_STRINGS } from '../../i18n';

interface BuildProps {
  onComplete: () => void;
  language: Language;
}

export default function Build01Golf({ onComplete, language }: BuildProps) {
  const t = UI_STRINGS[language];
  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const [currentNumber, setCurrentNumber] = useState(7);
  const [hits, setHits] = useState(0);

  // [REMIX HERE] Change these values to modify the ball's physics
  const BALL_RESTITUTION = 0.8; 
  const GRAVITY_SCALE = 0.5;

  useEffect(() => {
    if (!sceneRef.current) return;

    const { Engine, Render, Runner, World, Bodies, Mouse, MouseConstraint, Events } = Matter;
    
    const engine = Engine.create();
    engineRef.current = engine;
    engine.gravity.y = GRAVITY_SCALE;

    const render = Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width: sceneRef.current.clientWidth,
        height: sceneRef.current.clientHeight,
        wireframes: false,
        background: 'transparent',
      },
    });

    const width = sceneRef.current.clientWidth;
    const height = sceneRef.current.clientHeight;

    // Boundaries
    const ground = Bodies.rectangle(width / 2, height + 10, width, 40, { isStatic: true, render: { fillStyle: '#eee' } });
    const wallL = Bodies.rectangle(-10, height / 2, 40, height, { isStatic: true });
    const wallR = Bodies.rectangle(width + 10, height / 2, 40, height, { isStatic: true });
    const ceiling = Bodies.rectangle(width / 2, -10, width, 40, { isStatic: true });

    // The Central Number (A circle representing it)
    const centralCircle = Bodies.circle(width / 2, height / 2, 100, {
      label: 'target',
      restitution: 0.9,
      render: { fillStyle: ATOMS.blue }
    });

    // The Ball
    const ball = Bodies.circle(100, 100, 20, {
      label: 'ball',
      restitution: BALL_RESTITUTION,
      render: { fillStyle: ATOMS.dark }
    });

    World.add(engine.world, [ground, wallL, wallR, ceiling, centralCircle, ball]);

    // Mouse control
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false }
      }
    });

    World.add(engine.world, mouseConstraint);

    // Collision Event
    Events.on(engine, 'collisionStart', (event) => {
      event.pairs.forEach((pair) => {
        if ((pair.bodyA.label === 'target' && pair.bodyB.label === 'ball') ||
            (pair.bodyB.label === 'target' && pair.bodyA.label === 'ball')) {
            
            // [ASK AI] "Prompt Gemini: Add a radial explosion effect when the ball hits the number"
            setCurrentNumber(prev => {
              if (prev <= 1) return 0;
              return prev - 1;
            });
            setHits(h => h + 1);
        }
      });
    });

    const runner = Runner.create();
    Runner.run(runner, engine);
    Render.run(render);

    return () => {
      Render.stop(render);
      World.clear(engine.world, false);
      Engine.clear(engine);
      render.canvas.remove();
      render.textures = {};
    };
  }, []);

  useEffect(() => {
    if (currentNumber === 0) {
      setTimeout(onComplete, 1500);
    }
  }, [currentNumber, onComplete]);

  return (
    <div className="w-full h-full relative overflow-hidden flex items-center justify-center">
      <div ref={sceneRef} className="absolute inset-0 z-0" />
      
      <div className="z-10 pointer-events-none flex flex-col items-center">
        <motion.div
          key={currentNumber}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-[12rem] font-black text-white drop-shadow-2xl select-none"
          style={{ textShadow: `0 10px 40px rgba(66, 133, 244, 0.4)` }}
        >
          {currentNumber}
        </motion.div>
        
        <div className="mt-8 text-center bg-white/80 backdrop-blur px-6 py-4 rounded-2xl shadow-xl border border-gray-100">
           <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{t.buildStatus}</p>
           <p className="text-xl font-bold flex items-center gap-2">
             {t.dragToHit}
           </p>
           <div className="flex gap-2 justify-center mt-3">
              {[...Array(7)].map((_, i) => (
                <div 
                  key={i} 
                  className={cn(
                    "w-8 h-1.5 rounded-full transition-all",
                    i < (7 - currentNumber) ? "bg-[#4285F4]" : "bg-gray-100"
                  )} 
                />
              ))}
           </div>
        </div>
      </div>

      <div className="absolute top-10 left-10 flex gap-4 pointer-events-none">
        <div className="bg-white/90 p-4 rounded-xl shadow-lg border border-gray-100">
           <p className="text-[10px] font-bold text-gray-400 uppercase">{t.gravity}</p>
           <p className="text-lg font-black">{GRAVITY_SCALE}</p>
        </div>
        <div className="bg-white/90 p-4 rounded-xl shadow-lg border border-gray-100">
           <p className="text-[10px] font-bold text-gray-400 uppercase">{t.bounce}</p>
           <p className="text-lg font-black">{BALL_RESTITUTION}</p>
        </div>
      </div>

      <AnimatePresence>
        {currentNumber === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 bg-[#4285F4] z-50 flex flex-col items-center justify-center text-white p-10 text-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="mb-8"
            >
              <Target size={120} strokeWidth={3} />
            </motion.div>
            <h2 className="text-6xl font-black mb-4 uppercase">{t.labComplete}</h2>
            <p className="text-2xl font-medium opacity-80">{language === 'ko' ? "다음: 빌드 02로 이동 중..." : language === 'ja' ? "次へ：ビルド02へ移行中..." : "Transitioning to Build 02..."}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
