import React, { useState, useEffect } from 'react';
import { SUPPORTED_COUNTRIES, Country, CalendarEvent } from '../types';
import { askAssistant, fetchExchangeRate, ExchangeRateResult } from '../services/gemini';
import { Languages, Info, MessageSquare, Send, Calendar, Banknote, ArrowRightLeft, RefreshCw, ExternalLink } from 'lucide-react';

interface BizAssistantProps {
  selectedCountry: Country;
  onSelectCountry: (c: Country) => void;
  events: CalendarEvent[];
}

const BizAssistant: React.FC<BizAssistantProps> = ({ selectedCountry, onSelectCountry, events }) => {
  const [activeTab, setActiveTab] = useState<'info' | 'chat' | 'exchange'>('info');
  
  // Chat State
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'ai', text: string}[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [translateMode, setTranslateMode] = useState(false);

  // Exchange State
  const [amount, setAmount] = useState<string>('100');
  const [exchangeData, setExchangeData] = useState<ExchangeRateResult | null>(null);
  const [loadingRate, setLoadingRate] = useState(false);

  // Reset exchange data when country changes
  useEffect(() => {
    setExchangeData(null);
  }, [selectedCountry.code]);

  const handleAsk = async () => {
    if (!chatInput.trim()) return;
    
    const userMsg = chatInput;
    setChatInput('');
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      const response = await askAssistant(
        userMsg, 
        selectedCountry, 
        translateMode ? 'translation' : 'general'
      );
      setChatHistory(prev => [...prev, { role: 'ai', text: response }]);
    } catch (e) {
      setChatHistory(prev => [...prev, { role: 'ai', text: '网络错误，请稍后再试。' }]);
    } finally {
      setIsTyping(false);
    }
  };

  const getRate = async () => {
    setLoadingRate(true);
    const data = await fetchExchangeRate('CNY', selectedCountry.currency);
    setExchangeData(data);
    setLoadingRate(false);
  };

  // Filter upcoming events
  const upcomingEvents = events
    .filter(e => new Date(e.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  const convertedAmount = exchangeData && amount 
    ? (parseFloat(amount) * exchangeData.rate).toFixed(2) 
    : '---';

  return (
    <div className="flex flex-col h-full gap-4">
      
      {/* Country Selector */}
      <div className="bg-slate-850 border border-slate-700 rounded-xl p-4 shadow-lg">
        <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">当前业务区域</h3>
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-3 gap-2">
          {SUPPORTED_COUNTRIES.map(country => (
            <button
              key={country.code}
              onClick={() => onSelectCountry(country)}
              className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all ${
                selectedCountry.code === country.code
                  ? 'bg-primary-600/20 border-primary-500 text-white'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <span className="text-xl mb-1">{country.flag}</span>
              <span className="text-xs truncate w-full text-center">{country.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Dashboard Tabs */}
      <div className="flex-1 bg-slate-850 border border-slate-700 rounded-xl shadow-lg flex flex-col overflow-hidden">
        <div className="flex border-b border-slate-800">
          <button
            onClick={() => setActiveTab('info')}
            className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
              activeTab === 'info' ? 'text-primary-400 bg-slate-900/50' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Info className="w-4 h-4" />
            概览
          </button>
          <button
            onClick={() => setActiveTab('exchange')}
            className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
              activeTab === 'exchange' ? 'text-primary-400 bg-slate-900/50' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ArrowRightLeft className="w-4 h-4" />
            汇率
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
              activeTab === 'chat' ? 'text-primary-400 bg-slate-900/50' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            助理
          </button>
        </div>

        <div className="flex-1 overflow-hidden relative">
          
          {/* INFO TAB */}
          {activeTab === 'info' && (
            <div className="p-4 h-full overflow-y-auto space-y-6">
              {/* Basic Info */}
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg border border-slate-800">
                    <div className="flex items-center gap-2 text-slate-300">
                        <Banknote className="w-4 h-4 text-green-400" />
                        <span className="text-sm">货币</span>
                    </div>
                    <span className="font-mono text-white">{selectedCountry.currency}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg border border-slate-800">
                    <div className="flex items-center gap-2 text-slate-300">
                        <Languages className="w-4 h-4 text-purple-400" />
                        <span className="text-sm">主要语言</span>
                    </div>
                    <span className="text-sm text-white text-right">{selectedCountry.lang}</span>
                </div>
              </div>

              {/* Upcoming Events */}
              <div>
                <h4 className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Calendar className="w-3 h-3" />
                    近期事项 (Upcoming)
                </h4>
                {upcomingEvents.length === 0 ? (
                    <p className="text-slate-500 text-sm text-center py-4">无近期事项</p>
                ) : (
                    <div className="space-y-2">
                        {upcomingEvents.map(evt => (
                            <div key={evt.id} className="flex gap-3 items-start p-2 rounded hover:bg-slate-800/50 transition-colors">
                                <div className={`w-1 h-full min-h-[24px] rounded-full ${
                                    evt.type === 'holiday' ? 'bg-red-500' :
                                    evt.type === 'bank_holiday' ? 'bg-gold-500' : 'bg-primary-500'
                                }`} />
                                <div>
                                    <p className="text-sm text-slate-200 font-medium">{evt.title}</p>
                                    <p className="text-xs text-slate-500">{evt.date}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
              </div>

              {/* Quick Tips */}
              <div className="p-3 bg-blue-500/5 border border-blue-500/10 rounded-lg">
                <p className="text-xs text-blue-200/80 leading-relaxed">
                    <strong>商务贴士：</strong> 在{selectedCountry.name}，请注意当地宗教习惯。
                    {['SA', 'JO', 'AE', 'EG'].includes(selectedCountry.code) && ' 特别是斋月期间，避免在公共场合饮食。工作周通常为周日到周四。'}
                    {['TH'].includes(selectedCountry.code) && ' 头部被认为是神圣的，请勿触摸他人头部。'}
                </p>
              </div>
            </div>
          )}

          {/* EXCHANGE TAB */}
          {activeTab === 'exchange' && (
             <div className="p-6 h-full flex flex-col">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-white font-medium">汇率计算器</h3>
                    <button 
                        onClick={getRate}
                        disabled={loadingRate}
                        className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-full transition-colors"
                        title="刷新汇率"
                    >
                        <RefreshCw className={`w-4 h-4 ${loadingRate ? 'animate-spin' : ''}`} />
                    </button>
                </div>

                <div className="space-y-6">
                    {/* From CNY */}
                    <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                        <label className="text-xs text-slate-500 mb-1 block">持有货币 (CNY)</label>
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">🇨🇳</span>
                            <input 
                                type="number" 
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="bg-transparent text-2xl font-mono text-white w-full outline-none"
                                placeholder="100"
                            />
                            <span className="text-slate-400 font-mono">CNY</span>
                        </div>
                    </div>

                    <div className="flex justify-center -my-3 relative z-10">
                        <div className="bg-slate-800 p-2 rounded-full border border-slate-700">
                            <ArrowRightLeft className="w-4 h-4 text-slate-400" />
                        </div>
                    </div>

                    {/* To Target Currency */}
                    <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                        <label className="text-xs text-slate-500 mb-1 block">目标货币 ({selectedCountry.currency})</label>
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">{selectedCountry.flag}</span>
                            <div className="text-2xl font-mono text-primary-400 w-full">
                                {convertedAmount}
                            </div>
                            <span className="text-slate-400 font-mono">{selectedCountry.currency}</span>
                        </div>
                    </div>
                </div>

                {/* Rate Info & Action */}
                <div className="mt-8 flex-1">
                    {!exchangeData ? (
                        <div className="text-center py-4">
                            <p className="text-sm text-slate-500 mb-4">点击下方按钮获取最新汇率</p>
                            <button 
                                onClick={getRate}
                                disabled={loadingRate}
                                className="w-full py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-lg font-medium transition-colors"
                            >
                                {loadingRate ? '正在查询...' : '获取实时汇率'}
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                             <div className="flex justify-between items-center text-sm text-slate-400 bg-slate-800/30 p-3 rounded-lg">
                                <span>参考汇率</span>
                                <span className="font-mono text-white">1 CNY ≈ {exchangeData.rate} {selectedCountry.currency}</span>
                            </div>
                            
                            {exchangeData.sources && exchangeData.sources.length > 0 && (
                                <div className="mt-4">
                                    <p className="text-xs text-slate-600 mb-2">数据来源 (Google Search):</p>
                                    <ul className="space-y-1">
                                        {exchangeData.sources.slice(0, 2).map((src, idx) => (
                                            <li key={idx}>
                                                <a href={src.uri} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs text-primary-500/70 hover:text-primary-400 truncate">
                                                    <ExternalLink className="w-3 h-3" />
                                                    {src.title}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            <p className="text-[10px] text-slate-600 text-center mt-2">更新于: {exchangeData.lastUpdated}</p>
                        </div>
                    )}
                </div>
             </div>
          )}

          {/* CHAT TAB */}
          {activeTab === 'chat' && (
            <div className="flex flex-col h-full">
              <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {chatHistory.length === 0 && (
                    <div className="text-center text-slate-500 mt-8 text-sm">
                        <p>我是您的{selectedCountry.name}业务助理。</p>
                        <p className="mt-2">您可以让我：</p>
                        <ul className="mt-2 space-y-1 text-xs">
                            <li>• 翻译合同条款或邮件</li>
                            <li>• 询问当地送礼禁忌</li>
                            <li>• 查询特定日期的银行状态</li>
                        </ul>
                    </div>
                )}
                {chatHistory.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] p-3 rounded-lg text-sm whitespace-pre-wrap ${
                            msg.role === 'user' 
                            ? 'bg-primary-600 text-white rounded-br-none' 
                            : 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700'
                        }`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div className="flex justify-start">
                        <div className="bg-slate-800 p-3 rounded-lg rounded-bl-none border border-slate-700">
                            <div className="flex gap-1">
                                <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" />
                                <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce delay-100" />
                                <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce delay-200" />
                            </div>
                        </div>
                    </div>
                )}
              </div>
              
              <div className="p-3 bg-slate-900 border-t border-slate-800">
                <div className="flex items-center justify-between mb-2 px-1">
                    <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer hover:text-white">
                        <input 
                            type="checkbox" 
                            checked={translateMode}
                            onChange={(e) => setTranslateMode(e.target.checked)}
                            className="rounded border-slate-700 bg-slate-800 text-primary-500 focus:ring-offset-0 focus:ring-0"
                        />
                        翻译模式 (翻译成{selectedCountry.lang})
                    </label>
                </div>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
                        placeholder={translateMode ? "输入中文，我来翻译..." : "询问商务礼仪或其它..."}
                        className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary-500"
                    />
                    <button 
                        onClick={handleAsk}
                        disabled={!chatInput.trim() || isTyping}
                        className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BizAssistant;