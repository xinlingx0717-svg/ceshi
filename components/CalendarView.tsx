import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, Clock } from 'lucide-react';
import { CalendarEvent, Country } from '../types';
import TimezoneSelector from './TimezoneSelector';

interface CalendarViewProps {
  currentDate: Date;
  onMonthChange: (date: Date) => void;
  events: CalendarEvent[];
  selectedCountry: Country;
  onAddEvent: (dateStr: string) => void;
  selectedTimezone: string;
}

const CalendarView: React.FC<CalendarViewProps> = ({
  currentDate,
  onMonthChange,
  events,
  selectedCountry,
  onAddEvent,
  selectedTimezone
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [localTime, setLocalTime] = useState<string>('');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Update current time every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();

      // Local time
      setLocalTime(now.toLocaleTimeString('zh-CN', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit'
      }));

      // Selected timezone time
      try {
        if (selectedTimezone && selectedTimezone !== 'local') {
          const options: Intl.DateTimeFormatOptions = {
            timeZone: selectedTimezone,
            hour12: false,
            hour: '2-digit',
            minute: '2-digit'
          };
          setCurrentTime(now.toLocaleTimeString('zh-CN', options));
        } else {
          setCurrentTime(localTime);
        }
      } catch (error) {
        console.error('Error getting timezone time:', error);
        setCurrentTime(localTime);
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [selectedTimezone, localTime]);

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 is Sunday

  // Adjust for different week starts if necessary (e.g. Middle East starts Sunday/Saturday)
  // For simplicity, we stick to Sunday start but label visually
  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

  const handlePrevMonth = () => {
    onMonthChange(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    onMonthChange(new Date(year, month + 1, 1));
  };

  const renderDays = () => {
    const days = [];
    // Padding for previous month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`pad-${i}`} className="h-24 sm:h-32 bg-app-surface/30 border-r border-b border-app-border" />);
    }

    // Actual days
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const dayEvents = events.filter(e => e.date === dateStr);
      const isToday = new Date().toDateString() === new Date(year, month, d).toDateString();

      // Check for weekends (Middle East Fri/Sat vs Others Sat/Sun)
      let isWeekend = false;
      const dayOfWeek = (firstDayOfMonth + d - 1) % 7;
      
      if (['SA', 'JO', 'AE', 'EG', 'TR'].includes(selectedCountry.code)) {
         // Middle East mostly Fri/Sat weekend (varies, but generalized for visual aid)
         if (dayOfWeek === 5 || dayOfWeek === 6) isWeekend = true;
      } else {
         if (dayOfWeek === 0 || dayOfWeek === 6) isWeekend = true;
      }

      days.push(
        <div
          key={d}
          onClick={() => onAddEvent(dateStr)}
          className={`h-24 sm:h-32 border-r border-b border-app-border p-2 relative group hover:bg-app-highlight transition-colors cursor-pointer ${isWeekend ? 'bg-app-surface/50' : ''}`}
        >
          <div className="flex justify-between items-start">
            <span className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full ${isToday ? 'bg-primary-600 text-white' : 'text-app-muted'}`}>
              {d}
            </span>
            <button className="opacity-0 group-hover:opacity-100 text-app-muted hover:text-app-text transition-opacity">
                <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-1 flex flex-col gap-1 overflow-y-auto max-h-[calc(100%-30px)] custom-scrollbar">
            {dayEvents.map(event => (
              <div
                key={event.id}
                className={`text-xs px-1.5 py-0.5 rounded truncate border ${
                  event.type === 'holiday' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                  event.type === 'bank_holiday' ? 'bg-gold-500/10 text-gold-400 border-gold-500/20' :
                  event.type === 'meeting' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' :
                  'bg-app-highlight text-app-subtext border-app-border'
                }`}
                title={event.title}
              >
                {event.title}
              </div>
            ))}
          </div>
        </div>
      );
    }
    return days;
  };

  return (
    <div className="bg-app-card border border-app-border rounded-xl overflow-hidden shadow-2xl flex flex-col h-full transition-colors duration-300">
      {/* Calendar Header */}
      <div className="p-4 flex flex-col gap-3 border-b border-app-border bg-app-surface/50">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-app-text flex items-center gap-2">
            {year}年 {month + 1}月
            <span className="text-sm font-normal text-app-muted bg-app-highlight px-2 py-0.5 rounded ml-2">
              {selectedCountry.flag} {selectedCountry.name}
            </span>
          </h2>
          <div className="flex gap-1">
            <button onClick={handlePrevMonth} className="p-2 hover:bg-app-highlight rounded-lg text-app-muted hover:text-app-text transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={handleNextMonth} className="p-2 hover:bg-app-highlight rounded-lg text-app-muted hover:text-app-text transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Timezone Display */}
        <div className="flex items-center justify-between bg-app-surface/30 rounded-lg p-3">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2 text-app-subtext">
              <Clock className="w-4 h-4 text-app-muted" />
              <span className="font-medium">本地时间:</span>
              <span className="font-mono text-app-text">{localTime}</span>
            </div>
            {selectedTimezone && selectedTimezone !== 'local' && (
              <div className="flex items-center gap-2 text-app-subtext">
                <div className="w-4 h-4 border-t-2 border-app-muted" />
                <span className="font-medium">目标时区:</span>
                <span className="font-mono text-app-text">{currentTime}</span>
              </div>
            )}
          </div>
          <TimezoneSelector
            selectedTimezone={selectedTimezone}
            onTimezoneChange={() => {}} // Will be handled by App component
            compact={true}
          />
        </div>
      </div>

      {/* Week Header */}
      <div className="grid grid-cols-7 border-b border-app-border bg-app-surface/30">
        {weekDays.map((day, i) => (
          <div key={i} className={`py-3 text-center text-sm font-semibold ${
            (i === 0 || i === 6) ? 'text-app-muted' : 'text-app-subtext'
          }`}>
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 flex-1 overflow-auto bg-app-surface/10">
        {renderDays()}
      </div>
    </div>
  );
};

export default CalendarView;