import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import CalendarView from './components/CalendarView';
import BizAssistant from './components/BizAssistant';
import { SUPPORTED_COUNTRIES, Country, CalendarEvent, HolidayData } from './types';
import { fetchMonthHolidays } from './services/gemini';
import { Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedCountry, setSelectedCountry] = useState<Country>(SUPPORTED_COUNTRIES[0]); // Default HK
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loadingHolidays, setLoadingHolidays] = useState(false);

  // Load holidays when month or country changes
  useEffect(() => {
    const loadHolidays = async () => {
      setLoadingHolidays(true);
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      
      // Check if we already have holiday events for this month/country to avoid spamming API
      // (Simple check: do we have any 'holiday' type events for this YYYY-MM and country in our list?)
      // For this demo, we'll just fetch fresh to ensure accuracy or we could implement a cache map.
      // We will clear old holidays for the view to avoid duplicates if we re-fetch.
      
      const newHolidays = await fetchMonthHolidays(selectedCountry, year, month);
      
      // Transform into events
      const holidayEvents: CalendarEvent[] = newHolidays.map(h => ({
        id: `h-${selectedCountry.code}-${h.date}-${h.name}`,
        date: h.date,
        title: h.name,
        type: h.isBankHoliday ? 'bank_holiday' : 'holiday',
        description: h.isBankHoliday ? '银行休息' : '公众假期'
      }));

      setEvents(prev => {
        // Keep user personal events, remove old auto-fetched holidays for this month to avoid dups
        const personalEvents = prev.filter(e => e.type === 'personal' || e.type === 'meeting');
        // Also keep holidays from OTHER months or OTHER countries if we want to cache? 
        // For simplicity, let's just keep personal + new holidays. 
        // In a real app, we'd store holidays in a separate state map.
        return [...personalEvents, ...holidayEvents];
      });

      setLoadingHolidays(false);
    };

    loadHolidays();
  }, [currentDate.getFullYear(), currentDate.getMonth(), selectedCountry.code]);

  const handleAddEvent = (dateStr: string) => {
    const title = prompt("请输入事项标题 (会议/备忘):");
    if (title) {
      const newEvent: CalendarEvent = {
        id: `u-${Date.now()}`,
        date: dateStr,
        title,
        type: 'personal',
      };
      setEvents(prev => [...prev, newEvent]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-primary-500/30">
      <Header />
      
      <main className="max-w-[1600px] mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-120px)] min-h-[800px]">
          
          {/* Main Calendar Area (8 cols) */}
          <section className="lg:col-span-8 h-full flex flex-col relative">
            {loadingHolidays && (
              <div className="absolute top-4 right-4 z-20 flex items-center gap-2 px-3 py-1 bg-slate-800/80 backdrop-blur rounded-full text-xs text-primary-400 border border-slate-700">
                <Loader2 className="w-3 h-3 animate-spin" />
                正在同步{selectedCountry.name}假期...
              </div>
            )}
            <CalendarView 
              currentDate={currentDate}
              onMonthChange={setCurrentDate}
              events={events}
              selectedCountry={selectedCountry}
              onAddEvent={handleAddEvent}
            />
          </section>

          {/* Sidebar Assistant (4 cols) */}
          <section className="lg:col-span-4 h-full">
            <BizAssistant 
              selectedCountry={selectedCountry}
              onSelectCountry={setSelectedCountry}
              events={events}
            />
          </section>

        </div>
      </main>
    </div>
  );
};

export default App;