import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Trash2, Bot, User, CornerDownLeft, ShieldCheck, ChevronRight } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Drawer } from './ui/Drawer';

export const CopilotDrawer: React.FC = () => {
  const {
    isCopilotOpen,
    setCopilotOpen,
    copilotMessages,
    sendCopilotMessage,
    clearCopilotMessages
  } = useStore();

  const [input, setInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [copilotMessages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendCopilotMessage(input.trim());
    setInput('');
  };

  const quickPrompts = [
    '¿Cuáles son los riesgos críticos?',
    '¿Qué requisitos tienen brechas?',
    '¿Qué sistemas IA requieren revisión?',
    '¿Qué evidencias están próximas a vencer?'
  ];

  return (
    <Drawer
      isOpen={isCopilotOpen}
      onClose={() => setCopilotOpen(false)}
      title="Copilot de Gobernanza IA"
      subtitle="Asistente cognitivo enterprise entrenado en ISO/IEC 42001, ISO 27001 y EU AI Act"
      badge={
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-gradient-to-r from-teal-500/15 to-blue-500/15 text-teal-700 border border-teal-200">
          <Sparkles className="w-3 h-3 text-teal-600" />
          <span>Gemini Core Active</span>
        </span>
      }
      width="xl"
    >
      <div className="flex flex-col h-[calc(100vh-190px)]">
        {/* Messages list */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-4 scrollbar-thin">
          {copilotMessages.map((msg) => {
            const isAssistant = msg.sender === 'assistant';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isAssistant ? 'items-start' : 'items-start flex-row-reverse'}`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                    isAssistant
                      ? 'bg-gradient-to-br from-teal-600 to-blue-600 text-white shadow-xs'
                      : 'bg-slate-800 text-white'
                  }`}
                >
                  {isAssistant ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                <div
                  className={`max-w-[85%] rounded-xl p-4 text-xs sm:text-sm leading-relaxed ${
                    isAssistant
                      ? 'bg-slate-50 border border-slate-200 text-slate-800'
                      : 'bg-teal-700 text-white shadow-xs'
                  }`}
                >
                  <div className="whitespace-pre-line font-normal">{msg.text}</div>

                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-slate-200/80 flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500 font-medium">
                      <ShieldCheck className="w-3 h-3 text-teal-600" />
                      <span>Fuentes verificadas:</span>
                      {msg.sources.map((s, idx) => (
                        <span
                          key={idx}
                          className="bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-700 font-semibold"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  )}

                  {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-slate-200/80 space-y-1.5">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Sugerencias rápidas:
                      </p>
                      <div className="flex flex-col gap-1">
                        {msg.suggestedActions.map((action, idx) => (
                          <button
                            key={idx}
                            onClick={() => sendCopilotMessage(action.label)}
                            className="text-left text-xs bg-white hover:bg-teal-50 hover:border-teal-300 border border-slate-200 text-slate-700 hover:text-teal-800 px-3 py-1.5 rounded-lg transition-all flex items-center justify-between cursor-pointer"
                          >
                            <span>{action.label}</span>
                            <ChevronRight className="w-3 h-3 text-slate-400" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div
                    className={`mt-1.5 text-[10px] text-right ${
                      isAssistant ? 'text-slate-400' : 'text-teal-200'
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={chatEndRef} />
        </div>

        {/* Quick prompt pill buttons */}
        <div className="py-2 overflow-x-auto flex gap-1.5 no-scrollbar shrink-0">
          {quickPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => sendCopilotMessage(prompt)}
              className="text-[11px] whitespace-nowrap bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-full border border-slate-200 transition-colors cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input form */}
        <form onSubmit={handleSubmit} className="pt-2 border-t border-slate-200 flex gap-2 shrink-0">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Pregunta sobre riesgos, controles, brechas de IA..."
            className="flex-1 bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-all"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white px-3.5 py-2.5 rounded-lg transition-all flex items-center justify-center cursor-pointer shadow-xs"
          >
            <Send className="w-4 h-4" />
          </button>
          {copilotMessages.length > 1 && (
            <button
              type="button"
              onClick={clearCopilotMessages}
              title="Limpiar historial"
              className="text-slate-400 hover:text-slate-600 p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </form>
      </div>
    </Drawer>
  );
};
