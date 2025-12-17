import React, { useState, useEffect } from 'react';
import { Globe, Clock, ChevronDown } from 'lucide-react';
import { TimezoneInfo, COMMON_TIMEZONES } from '../types';

interface TimezoneSelectorProps {
  selectedTimezone: string;
  onTimezoneChange: (timezoneId: string) => void;
  compact?: boolean; // Compact mode for inline display
}

const TimezoneSelector: React.FC<TimezoneSelectorProps> = ({
  selectedTimezone,
  onTimezoneChange,
  compact = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [localTime, setLocalTime] = useState<string>('');
  const [currentTimezones, setCurrentTimezones] = useState<TimezoneInfo[]>(COMMON_TIMEZONES);

  // Update current time every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();

      // Local time
      setLocalTime(now.toLocaleTimeString('zh-CN', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }));

      // Selected timezone time
      try {
        const selectedTz = COMMON_TIMEZONES.find(tz => tz.id === selectedTimezone);
        if (selectedTz && selectedTz.id !== 'local') {
          const options: Intl.DateTimeFormatOptions = {
            timeZone: selectedTz.id,
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          };
          setCurrentTime(now.toLocaleTimeString('zh-CN', options));
        } else {
          setCurrentTime(localTime);
        }
      } catch (error) {
        console.error('Error getting timezone time:', error);
        setCurrentTime(localTime);
      }

      // Update all timezone times
      const updatedTimezones = COMMON_TIMEZONES.map(tz => {
        try {
          const options: Intl.DateTimeFormatOptions = {
            timeZone: tz.id,
            hour12: false,
            hour: '2-digit',
            minute: '2-digit'
          };
          return {
            ...tz,
            currentTime: now.toLocaleTimeString('zh-CN', options)
          };
        } catch (error) {
          return { ...tz, currentTime: '--:--' };
        }
      });
      setCurrentTimezones(updatedTimezones);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [selectedTimezone, localTime]);

  const handleSelectTimezone = (timezoneId: string) => {
    onTimezoneChange(timezoneId);
    setIsOpen(false);
    // Save to localStorage
    localStorage.setItem('preferredTimezone', timezoneId);
  };

  const getSelectedTimezoneName = () => {
    const tz = COMMON_TIMEZONES.find(tz => tz.id === selectedTimezone);
    return tz ? tz.name : '本地时间';
  };

  const getTimeDifference = (offset: number) => {
    const userOffset = new Date().getTimezoneOffset() / -60; // Convert to hours
    const diff = offset - userOffset;
    if (diff === 0) return '';
    const sign = diff > 0 ? '+' : '';
    return `${sign}${diff}`;
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2 text-sm">
        <Clock className="w-4 h-4 text-app-muted" />
        <span className="text-app-subtext font-medium">{currentTime}</span>
        <span className="text-app-muted">({getSelectedTimezoneName()})</span>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-app-surface/50 hover:bg-app-surface border border-app-border rounded-lg text-sm text-app-text transition-colors duration-200"
      >
        <Globe className="w-4 h-4 text-app-muted" />
        <Clock className="w-4 h-4 text-app-muted" />
        <span className="text-app-subtext font-medium hidden sm:inline">
          {currentTime}
        </span>
        <span className="text-app-muted hidden md:inline">
          ({getSelectedTimezoneName()})
        </span>
        <ChevronDown className={`w-4 h-4 text-app-muted transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute top-full left-0 mt-2 w-80 bg-app-card border border-app-border rounded-lg shadow-lg z-20 overflow-hidden">
            <div className="p-4 bg-app-surface/30 border-b border-app-border">
              <h3 className="text-sm font-semibold text-app-text mb-3 flex items-center gap-2">
                <Globe className="w-4 h-4" />
                选择时区
              </h3>

              {/* Current selection display */}
              <div className="flex justify-between items-center text-xs text-app-muted mb-3">
                <span>本地时间: {localTime}</span>
                <span>选中时区: {currentTime}</span>
              </div>

              <button
                onClick={() => handleSelectTimezone('local')}
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                  selectedTimezone === 'local'
                    ? 'bg-primary-500/10 text-primary-400 border border-primary-500/20'
                    : 'hover:bg-app-highlight text-app-subtext'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>📍 使用本地时区</span>
                  <span className="text-xs text-app-muted">{localTime}</span>
                </div>
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto custom-scrollbar">
              {currentTimezones.map((tz) => (
                <button
                  key={tz.id}
                  onClick={() => handleSelectTimezone(tz.id)}
                  className={`w-full text-left px-4 py-3 hover:bg-app-highlight transition-colors border-b border-app-border/50 last:border-b-0 ${
                    selectedTimezone === tz.id
                      ? 'bg-primary-500/5 text-primary-400'
                      : 'text-app-subtext'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-sm">{tz.name}</div>
                      <div className="text-xs text-app-muted mt-1">
                        {tz.id} {getTimeDifference(tz.offset) && `(${getTimeDifference(tz.offset)})`}
                      </div>
                    </div>
                    <div className="text-sm font-mono text-app-muted ml-3">
                      {tz.currentTime}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="p-3 bg-app-surface/30 border-t border-app-border">
              <div className="text-xs text-app-muted text-center">
                提示：选择时区后，应用将同时显示本地时间和选中时区时间
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TimezoneSelector;