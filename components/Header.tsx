import React from 'react';
import { Globe2, Briefcase } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
      <div className="max-w-[1600px] mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600/20 rounded-lg border border-indigo-500/30">
            <Globe2 className="w-6 h-6 text-indigo-500" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              GlobalBiz <span className="text-xs font-mono font-normal text-slate-400 bg-slate-800 px-2 py-0.5 rounded">Calendar</span>
            </h1>
            <p className="text-xs text-slate-400 font-mono">跨国业务智能助理</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm">
           <div className="flex items-center gap-2 text-gold-400 bg-gold-400/10 px-3 py-1 rounded-full border border-gold-400/20">
              <Briefcase className="w-4 h-4" />
              <span className="hidden sm:inline font-medium">企业版</span>
           </div>
        </div>
      </div>
    </header>
  );
};

export default Header;