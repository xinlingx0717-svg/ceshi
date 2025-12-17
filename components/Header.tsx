import React, { useState, useEffect } from 'react';
import { Globe2, Briefcase } from 'lucide-react';
import TimezoneSelector from './TimezoneSelector';

interface HeaderProps {
  selectedTimezone: string;
  onTimezoneChange: (timezoneId: string) => void;
}

const Header: React.FC<HeaderProps> = ({ selectedTimezone, onTimezoneChange }) => {
  const [showCompactTimezone, setShowCompactTimezone] = useState(false);

  // Show compact timezone on smaller screens
  useEffect(() => {
    const handleResize = () => {
      setShowCompactTimezone(window.innerWidth < 1024); // lg breakpoint
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <header className="border-b border-app-border bg-app-card/90 backdrop-blur-md sticky top-0 z-10 transition-colors duration-300">
      <div className="max-w-[1600px] mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-500/20 rounded-lg border border-primary-500/30">
            <Globe2 className="w-6 h-6 text-primary-500" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-app-text tracking-tight flex items-center gap-2">
              GlobalBiz <span className="text-xs font-mono font-normal text-app-muted bg-app-surface px-2 py-0.5 rounded">Calendar</span>
            </h1>
            <p className="text-xs text-app-muted font-mono">跨国业务智能助理</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm">
          {/* Timezone Selector - Full on desktop, compact on mobile */}
          <TimezoneSelector
            selectedTimezone={selectedTimezone}
            onTimezoneChange={onTimezoneChange}
            compact={showCompactTimezone}
          />

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