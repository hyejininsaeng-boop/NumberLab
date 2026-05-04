import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { MousePointer2, Smile, Sparkles, RotateCcw } from 'lucide-react';
import { cn } from '../../lib/utils';
import { ATOMS, Language } from '../../types';
import { UI_STRINGS } from '../../i18n';

interface BuildProps {
  onComplete: () => void;
  language: Language;
}

export default function Build05Stretch({ onComplete, language }: BuildProps) {
  const t = UI_STRINGS[language];
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [completeProgress, setCompleteProgress] = useState(0);

  // [REMIX HERE] Change simulation parameters
  const BLOB_COLOR = ATOMS.blue;
  const ATTRACTION_STRENGTH = 0.15;
  const FRICTION = 0.96;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d')!;
    let animationId: number;

    const width = canvas.width = canvas.parentElement!.clientWidth;
    const height = canvas.height = canvas.parentElement!.clientHeight;

    const mouse = { x: width / 2, y: height / 2, active: false };

    // Create points for a circle that we can deform
    const points: { x: number, y: number, ox: number, oy: number, vx: number, vy: number }[] = [];
    const numPoints = 80;
    const radius = 120;

    for (let i = 0; i < numPoints; i++) {
        const angle = (i / numPoints) * Math.PI * 2;
        const x = width / 2 + Math.cos(angle) * radius;
        const y = height / 2 + Math.sin(angle) * radius;
        points.push({ x, y, ox: x, oy: y, vx: 0, vy: 0 });
    }

    const onMouseMove = (e: MouseEvent) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY - 64; // Adjusted for header
        mouse.active = true;
        setIsHovering(true);
    };

    const render = () => {
        ctx.clearRect(0, 0, width, height);

        // Update logic
        points.forEach(p => {
            const dx = mouse.x - p.x;
            const dy = mouse.y - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 200 && mouse.active) {
                const force = (200 - dist) / 200;
                p.vx += dx * force * ATTRACTION_STRENGTH;
                p.vy += dy * force * ATTRACTION_STRENGTH;
            }

            // Return to original position
            const rdx = p.ox - p.x;
            const rdy = p.oy - p.y;
            p.vx += rdx * 0.05;
            p.vy += rdy * 0.05;

            p.vx *= FRICTION;
            p.vy *= FRICTION;
            p.x += p.vx;
            p.y += p.vy;
        });

        // Draw Blob
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        
        for (let i = 0; i < points.length; i++) {
            const p1 = points[i];
            const p2 = points[(i + 1) % points.length];
            const midX = (p1.x + p2.x) / 2;
            const midY = (p1.y + p2.y) / 2;
            ctx.quadraticCurveTo(p1.x, p1.y, midX, midY);
        }
        
        ctx.closePath();
        ctx.fillStyle = BLOB_COLOR;
        ctx.fill();

        // Draw the number "5" inside the blob
        ctx.font = '900 120px Inter, sans-serif';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Slightly laggy center for the text
        const avgX = points.reduce((acc, p) => acc + p.x, 0) / points.length;
        const avgY = points.reduce((acc, p) => acc + p.y, 0) / points.length;
        ctx.fillText('5', avgX, avgY);

        setCompleteProgress(prev => {
            if (isHovering) return Math.min(prev + 0.2, 100);
            return prev;
        });

        animationId = requestAnimationFrame(render);
    };

    window.addEventListener('mousemove', onMouseMove);
    animationId = requestAnimationFrame(render);

    return () => {
        window.removeEventListener('mousemove', onMouseMove);
        cancelAnimationFrame(animationId);
    };
  }, [isHovering]);

  return (
    <div className="w-full h-full relative select-none bg-white">
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />
      
      <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-between p-12">
          <div className="text-center">
            <h2 className="text-2xl font-black text-gray-300 tracking-widest uppercase mb-2">Build 05</h2>
            <p className="text-gray-400 font-medium">{t.fluidExp}</p>
          </div>

          <div className="w-full max-w-md bg-gray-50 h-2 rounded-full overflow-hidden border border-gray-100">
             <motion.div 
               className="h-full bg-blue-500" 
               animate={{ width: `${completeProgress}%` }}
               transition={{ ease: "linear" }}
             />
          </div>
      </div>

      {!isHovering && (
         <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="flex flex-col items-center gap-4 text-gray-400"
            >
                <MousePointer2 size={48} className="fill-gray-100" />
                <p className="font-bold uppercase tracking-widest">{t.moveMouse}</p>
            </motion.div>
         </div>
      )}

      {completeProgress >= 100 && (
         <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-[#202124] backdrop-blur-xl z-50 flex flex-col items-center justify-center text-white text-center p-10"
         >
            <div className="flex gap-4 mb-8">
                <div className="w-4 h-4 rounded-full bg-[#4285F4]" />
                <div className="w-4 h-4 rounded-full bg-[#EA4335]" />
                <div className="w-4 h-4 rounded-full bg-[#FBBC04]" />
                <div className="w-4 h-4 rounded-full bg-[#34A853]" />
            </div>
            <h2 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter uppercase">{t.labComplete}</h2>
            <p className="text-2xl text-gray-400 max-w-lg font-medium mb-12">
                {t.completeMsg}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
                <div className="bg-white/5 border border-white/10 px-6 py-4 rounded-2xl flex items-center gap-3">
                   <Smile className="text-[#34A853]" />
                   <div className="text-left">
                      <p className="text-[10px] font-bold text-gray-500 uppercase">{t.buildStatus}</p>
                      <p className="font-bold uppercase">{t.verified}</p>
                   </div>
                </div>
                <div className="bg-white/5 border border-white/10 px-6 py-4 rounded-2xl flex items-center gap-3">
                   <Sparkles className="text-[#FBBC04]" />
                   <div className="text-left">
                      <p className="text-[10px] font-bold text-gray-500 uppercase">AI REMIX</p>
                      <p className="font-bold uppercase">{t.ready}</p>
                   </div>
                </div>
            </div>
            
            <button 
                onClick={() => window.location.reload()}
                className="mt-16 text-gray-500 hover:text-white transition-colors font-bold uppercase tracking-widest flex items-center gap-2"
            >
                <RotateCcw size={18} /> {t.startOver}
            </button>
         </motion.div>
      )}

      {/* [ASK AI] "Prompt Gemini: Add a shadow tail trailing behind the mouse cursor" */}
    </div>
  );
}
