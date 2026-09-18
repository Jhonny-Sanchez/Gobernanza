import React from 'react';
import { Search, Bell, Sparkles, Building2, ChevronDown } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';

interface TopbarProps {
  onOpenOrgSelector: () => void;
  onNavigateAlerts: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onOpenOrgSelector, onNavigateAlerts }) => {
  const {
    currentOrganization,
    toggleCopilot,
    alerts,
    searchQuery,
    setSearchQuery
  } = useStore();

  const unreadAlerts = alerts.filter((a) => !a.resolved);
  const criticalCount = unreadAlerts.filter((a) => a.severity === 'CRÍTICO').length;

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between gap-4 shrink-0 z-20">
      {/* Left: Organization & Active Standards */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onOpenOrgSelector}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer text-left group"
        >
          <div className="w-6 h-6 rounded bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 shrink-0">
            <Building2 className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-slate-900 leading-tight truncate flex items-center gap-1">
              {currentOrganization.name}
              <ChevronDown className="w-3 h-3 text-slate-400 group-hover:text-slate-600 transition-transform" />
            </p>
            <p className="text-[10px] text-slate-400 leading-none truncate">
              {currentOrganization.sector}
            </p>
          </div>
        </button>

        <div className="hidden lg:flex items-center gap-1.5 pl-2 border-l border-slate-200">
          {currentOrganization.activeStandards.map((std) => (
            <Badge key={std} variant="teal" size="sm" showDot={false}>
              {std}
            </Badge>
          ))}
        </div>
      </div>

      {/* Right: Search, Alerts, Copilot */}
      <div className="flex items-center gap-3">
        {/* Global Search */}
        <div className="relative hidden md:block w-56 lg:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar requisitos, IA, riesgos..."
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-all"
          />
        </div>

        {/* Notifications & Critical Alerts Indicator */}
        <button
          onClick={onNavigateAlerts}
          className="relative p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
          title={`${unreadAlerts.length} alertas activas`}
        >
          <Bell className="w-4 h-4" />
          {unreadAlerts.length > 0 && (
            <span
              className={`absolute top-1.5 right-1.5 w-2 h-2 rounded-full ${
                criticalCount > 0 ? 'bg-red-500 animate-pulse' : 'bg-amber-500'
              }`}
            />
          )}
        </button>

        {criticalCount > 0 && (
          <div
            onClick={onNavigateAlerts}
            className="hidden sm:flex items-center gap-1.5 bg-red-50 text-red-700 border border-red-200 px-2.5 py-1 rounded-full text-xs font-semibold cursor-pointer hover:bg-red-100 transition-colors"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
            <span>{criticalCount} crítico{criticalCount > 1 ? 's' : ''}</span>
          </div>
        )}

        {/* Copilot Button */}
        <Button
          variant="copilot"
          size="sm"
          icon={<Sparkles className="w-3.5 h-3.5" />}
          onClick={toggleCopilot}
        >
          Copilot
        </Button>
      </div>
    </header>
  );
};
