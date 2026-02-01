
import React, { useState, useEffect } from 'react';
import { SystemModule } from '../types';

interface CodeSectionProps {
    modules: SystemModule[];
    lang: 'en' | 'ar';
}

const CodeSection: React.FC<CodeSectionProps> = ({ modules, lang }) => {
  const [activeTab, setActiveTab] = useState(modules[0].id);

  // When language switches, the modules array reference changes.
  // Ensure we find the equivalent active tab or fallback to first.
  const activeModule = modules.find(m => m.id === activeTab) || modules[0];

  useEffect(() => {
      // If the current active tab id doesn't exist in new modules (unlikely if IDs are constant), reset
      if (!modules.find(m => m.id === activeTab)) {
          setActiveTab(modules[0].id);
      }
  }, [modules, activeTab]);

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="lg:w-1/3 flex flex-col gap-2">
        {modules.map(module => (
          <button
            key={module.id}
            onClick={() => setActiveTab(module.id)}
            className={`text-left p-4 rounded-lg transition-all border ${
              activeTab === module.id 
              ? 'bg-blue-600/10 border-blue-500 text-blue-400' 
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className={`font-bold ${lang === 'ar' ? 'font-sans' : ''}`}>{module.name}</div>
            <div className="text-xs mt-1 opacity-70">{module.description}</div>
          </button>
        ))}
      </div>
      
      <div className="lg:w-2/3 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col">
        <div className="bg-slate-800 px-4 py-2 flex justify-between items-center">
          <span className="text-xs font-mono text-slate-300">implementation_skeleton.kt</span>
          <div className="flex gap-2">
             <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
             <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
             <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
          </div>
        </div>
        <div className="p-6 overflow-x-auto" dir="ltr">
          {/* Code always LTR */}
          <pre className="text-sm font-mono text-blue-300 leading-relaxed">
            <code>{activeModule?.codeSnippet}</code>
          </pre>
        </div>
        
        <div className="p-6 pt-0 mt-2 border-t border-slate-800">
            <h4 className="text-xs font-bold text-slate-500 uppercase mb-3 mt-4">
                {lang === 'en' ? 'Key Responsibilities' : 'المسؤوليات الرئيسية'}
            </h4>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {activeModule?.responsibilities.map((r, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></div>
                  {r}
                </li>
              ))}
            </ul>
        </div>
      </div>
    </div>
  );
};

export default CodeSection;
