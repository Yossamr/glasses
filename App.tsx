
import React, { useState } from 'react';
import ArchitectureFlow from './components/ArchitectureFlow';
import CodeSection from './components/CodeSection';
import PipelineDiagram from './components/PipelineDiagram';
import VisionSimulator from './components/VisionSimulator';
import { TRANSLATIONS, CURRENT_MODEL_STATS } from './constants';

const App: React.FC = () => {
  const [lang, setLang] = useState<'en' | 'ar'>('en');
  const content = TRANSLATIONS[lang];

  const toggleLang = () => {
    setLang(prev => prev === 'en' ? 'ar' : 'en');
  };

  return (
    <div dir={lang === 'ar' ? 'rtl' : 'ltr'} className="max-w-7xl mx-auto px-4 py-12 space-y-16 font-sans">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-emerald-600 p-2 rounded-lg shadow-xl shadow-emerald-500/20">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.040L3 6.247a11.964 11.964 0 00-1 4.965c0 4.053 2.008 7.638 5.074 9.768a10.957 10.957 0 0011.852 0C20.992 18.85 23 15.265 23 11.212c0-1.72-.363-3.354-1-4.82l-1.382-.13z" />
              </svg>
            </div>
            <h1 className="text-4xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-blue-600">
              {content.header.title} <span className="text-slate-500 font-light italic">{content.header.subtitle}</span>
            </h1>
          </div>
          <p className="text-slate-400 max-w-2xl leading-relaxed">
            {content.header.description}
          </p>
        </div>
        <div className="flex flex-col items-end gap-3">
            <button 
                onClick={toggleLang}
                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-lg transition-colors border border-slate-700 font-bold text-sm"
            >
                <span className={lang === 'en' ? 'text-emerald-400' : 'text-slate-500'}>EN</span>
                <span className="text-slate-600">|</span>
                <span className={lang === 'ar' ? 'text-emerald-400' : 'text-slate-500'}>عربي</span>
            </button>
            <div className="bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-full flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">{content.header.badge}</span>
            </div>
        </div>
      </header>

      {/* NEW: Live Vision Simulator */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-6 w-1 bg-red-500"></div>
            <h2 className="text-2xl font-bold">{content.header.liveEmulator}</h2>
          </div>
          <div className="flex gap-2">
             <span className="text-[10px] bg-red-900/30 text-red-400 border border-red-900/50 px-2 py-1 rounded font-mono animate-pulse">{content.header.recording}</span>
          </div>
        </div>
        <VisionSimulator content={content.simulator} lang={lang} />
      </section>

      {/* Real-time Performance Metrics */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {content.performanceTargets.map((target, idx) => (
          <div key={idx} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl border-t-4 border-t-emerald-600">
            <h4 className="text-slate-500 text-xs font-bold uppercase mb-4">{target.metric}</h4>
            <div className="text-3xl font-mono text-emerald-400">{target.value}</div>
            <p className="text-slate-400 text-sm mt-2">{target.description}</p>
          </div>
        ))}
      </section>

      {/* Logic Flow Visualization */}
      <section className="space-y-6">
        <div className="flex items-center gap-2">
          <div className="h-6 w-1 bg-emerald-600"></div>
          <h2 className="text-2xl font-bold">{content.header.signalChain}</h2>
        </div>
        <ArchitectureFlow steps={content.signalChain} lang={lang} />
      </section>

      {/* Production Implementation */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-6 w-1 bg-blue-600"></div>
            <h2 className="text-2xl font-bold">{content.header.androidImpl}</h2>
          </div>
          <span className="text-xs font-mono text-slate-500 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">{content.header.sourceCode}</span>
        </div>
        <CodeSection modules={content.systemModules} lang={lang} />
      </section>

      {/* Engineering Strategies */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-3xl space-y-6 lg:col-span-2">
          <h3 className="text-xl font-bold text-white">{content.header.engineeringDecisions}</h3>
          <div className="space-y-4">
            <div className="p-4 bg-slate-950/50 rounded-xl border border-slate-800">
              <h4 className="text-emerald-500 font-bold text-sm mb-1 uppercase">Memory Optimization</h4>
              <p className="text-xs text-slate-400">
                {lang === 'en' 
                    ? "Using `Bitmap.Config.RGB_565` to reduce memory footprint by 50% while maintaining sufficient precision for AI." 
                    : "استخدام `Bitmap.Config.RGB_565` لتقليل حجم الذاكرة بنسبة 50% مع الحفاظ على دقة كافية للذكاء الاصطناعي."}
              </p>
            </div>
            <div className="p-4 bg-slate-950/50 rounded-xl border border-slate-800">
              <h4 className="text-blue-500 font-bold text-sm mb-1 uppercase">Network Stability</h4>
              <p className="text-xs text-slate-400">
                {lang === 'en'
                    ? "A `Watchdog Timer` monitors the Socket every 100ms. Upon failure, TOF Sonar via BLE GATT is triggered immediately."
                    : "نظام `Watchdog Timer` يراقب الـ Socket كل 100ms. عند الفشل، يتم تفعيل سونار TOF عبر BLE GATT فوراً."}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-3xl space-y-6">
          <h3 className="text-xl font-bold text-white">{content.header.uxRules}</h3>
          <div className="grid grid-cols-1 gap-4">
            {content.uxStrategy.map((ux, i) => (
              <div key={i} className="group border-b border-slate-800 pb-4 last:border-0">
                <h4 className="text-sm font-bold text-slate-300 group-hover:text-emerald-400 transition-colors">{ux.title}</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed italic">{ux.rule}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Lifecycle & Feedback Loop */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-6 w-1 bg-purple-600"></div>
            <h2 className="text-2xl font-bold">{content.header.learningLoop}</h2>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
            <span>Model: {CURRENT_MODEL_STATS.version}</span>
            <span>Acc: {CURRENT_MODEL_STATS.accuracy}</span>
          </div>
        </div>
        <PipelineDiagram nodes={content.pipelineNodes} lang={lang} />
      </section>

      {/* Footer */}
      <footer className="pt-12 border-t border-slate-800 text-center text-slate-500 text-xs">
        {content.header.footer}
      </footer>
    </div>
  );
};

export default App;
