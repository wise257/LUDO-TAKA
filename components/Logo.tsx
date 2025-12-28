
import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  withText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ size = 'md', withText = false }) => {
  const sizeClasses = {
    sm: 'w-10 h-10 border-2',
    md: 'w-20 h-20 border-4',
    lg: 'w-44 h-44 border-6',
    xl: 'w-60 h-60 border-8',
  };

  const textClasses = {
    sm: 'text-sm',
    md: 'text-xl',
    lg: 'text-4xl',
    xl: 'text-5xl',
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className={`relative rounded-full ${sizeClasses[size]} border-amber-400 shadow-2xl overflow-hidden bg-slate-900 flex items-center justify-center ring-2 ring-slate-800`}>
        {/* Ludo Quadrants Background */}
        <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 opacity-100">
          <div className="bg-[#3b82f6]"></div> {/* Blue */}
          <div className="bg-[#ef4444]"></div> {/* Red */}
          <div className="bg-[#eab308]"></div> {/* Yellow */}
          <div className="bg-[#22c55e]"></div> {/* Green */}
        </div>
        
        {/* Inner Circle for contrast */}
        <div className="absolute inset-1.5 rounded-full bg-slate-950/20 backdrop-blur-[1px]"></div>
        
        {/* Tiger/Cat Icon (Hero) */}
        <div className="relative z-10 flex flex-col items-center">
          <i className={`fa-solid fa-shield-cat text-amber-400 ${
            size === 'sm' ? 'text-xl' : 
            size === 'md' ? 'text-4xl' : 
            size === 'lg' ? 'text-8xl' : 'text-9xl'
          } drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]`}></i>
        </div>
      </div>
      
      {withText && (
        <div className="text-center">
          <h1 className={`${textClasses[size]} font-black tracking-tighter text-white uppercase italic`}>
            LUDO <span className="text-amber-400">TAKA</span>
          </h1>
        </div>
      )}
    </div>
  );
};

export default Logo;
