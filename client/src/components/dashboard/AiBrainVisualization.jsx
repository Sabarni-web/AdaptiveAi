import React from 'react';
import aiBrainImg from '../../assets/ai-brain.png';

export const AiBrainVisualization = () => {
  return (
    <div className="h-full flex flex-col justify-center items-center rounded-2xl p-6 relative overflow-hidden group">

      {/* Subtle Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-1000 ease-in-out"></div>

      {/* Brain Container with Floating, Pulsing, and Tilt Animation */}
      <div className="relative w-full max-w-[280px] aspect-square mb-6 flex items-center justify-center">
        
        {/* Subtle inner pulse ring */}
        <div className="absolute inset-0 bg-primary/5 rounded-full blur-xl motion-safe:animate-ai-pulse"></div>

        <div className="brain-float w-full h-full relative z-10 flex items-center justify-center mix-blend-screen">
          <div className="brain-tilt w-full h-full flex items-center justify-center">
            <div className="brain-pulse w-full h-full flex items-center justify-center">
              <img 
                src={aiBrainImg} 
                alt="AI Brain"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>

        {/* Optional Ambient Particles */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-4 left-4 w-1 h-1 bg-primary/60 rounded-full motion-safe:animate-particle-1" />
          <div className="absolute bottom-8 right-6 w-1.5 h-1.5 bg-primary/40 rounded-full motion-safe:animate-particle-2" />
          <div className="absolute top-1/2 right-4 w-1 h-1 bg-primary/50 rounded-full motion-safe:animate-particle-3" />
        </div>
      </div>

      <div className="mt-auto text-center z-10">
        <h3 className="text-xs font-black tracking-[0.2em] text-primary/80 uppercase">
          Adaptive Intelligence
        </h3>
      </div>
    </div>
  );
};
