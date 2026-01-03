import React from 'react';
import { SUGGESTED_QUESTIONS } from '../constants';

interface SidebarProps {
  onSuggestionClick: (question: string) => void;
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onSuggestionClick, isOpen, toggleSidebar }) => {
  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={toggleSidebar}
      />

      {/* Sidebar Content */}
      <div className={`fixed md:static inset-y-0 left-0 z-30 w-72 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out md:translate-x-0 flex flex-col h-full border-r border-slate-700 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-slate-700">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent leading-tight">
            Euonia TA
          </h1>
          <p className="text-xs text-slate-400 mt-2">Teaching Assistant for<br/>Prof. Michael</p>
          <p className="text-xs text-slate-500 mt-1">IMC • Woxsen School of Business</p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Core Philosophy</h3>
            <ul className="text-sm space-y-3 text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span>Strategy before tactics</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span>Fundamentals driven</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span>Clear positioning</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Suggested Topics</h3>
            <div className="space-y-2">
              {SUGGESTED_QUESTIONS.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    onSuggestionClick(q);
                    if (window.innerWidth < 768) toggleSidebar();
                  }}
                  className="w-full text-left text-sm p-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700 hover:border-blue-500/50"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-700 bg-slate-900">
          <p className="text-xs text-slate-500 text-center">
            AI can make mistakes. Check important info.
          </p>
        </div>
      </div>
    </>
  );
};

export default Sidebar;