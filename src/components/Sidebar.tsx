import React from 'react';
import {
  LayoutDashboard,
  CheckCircle2,
  Network,
  Cpu,
  ShieldAlert,
  ShieldCheck,
  FileCheck,
  FileText,
  ClipboardList,
  BarChart3,
  FileSpreadsheet,
  Calendar,
  Bell,
  Settings,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { useStore } from '../store/useStore';

interface SidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPath, onNavigate }) => {
  const { currentUser, logout, alerts } = useStore();

  const unreadAlerts = alerts.filter((a) => !a.resolved).length;

  const menuBlock1 = [
    { name: 'COMMAND CENTER', path: '/', icon: LayoutDashboard },
    { name: 'IMPLEMENTACIÓN', path: '/implementation', icon: CheckCircle2 },
    { name: 'GOBERNANZA', path: '/governance', icon: Network },
    { name: 'INTELIGENCIA ARTIFICIAL', path: '/ai-registry', icon: Cpu },
    { name: 'RIESGOS', path: '/risks', icon: ShieldAlert },
    { name: 'CONTROLES', path: '/controls', icon: ShieldCheck },
    { name: 'EVIDENCIAS', path: '/evidences', icon: FileCheck },
    { name: 'DOCUMENTOS', path: '/documents', icon: FileText },
    { name: 'AUDITORÍA', path: '/audit', icon: ClipboardList },
    { name: 'DESEMPEÑO', path: '/performance', icon: BarChart3 }
  ];

  const menuBlock2 = [
    { name: 'REPORTES', path: '/reports', icon: FileSpreadsheet },
    { name: 'CALENDARIO', path: '/calendar', icon: Calendar },
    { name: 'ALERTAS', path: '/alerts', icon: Bell, badge: unreadAlerts > 0 ? unreadAlerts : undefined },
    { name: 'CONFIGURACIÓN', path: '/settings', icon: Settings }
  ];

  return (
    <aside className="w-[260px] bg-slate-900 text-slate-300 flex flex-col shrink-0 h-screen border-r border-slate-800 select-none z-30">
      {/* Brand Header */}
      <div className="h-16 px-5 flex items-center gap-3 border-b border-slate-800/80 bg-slate-950/40">
        <div className="w-9 h-9 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 shrink-0 shadow-xs">
          <Cpu className="w-5 h-5" />
        </div>
        <div className="flex items-baseline gap-1 tracking-tight">
          <span className="text-base font-bold text-white tracking-wide">AIGobernanza</span>
          <span className="text-base font-extrabold text-teal-400">360</span>
        </div>
      </div>

      {/* Navigation Scrollable Area */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-800">
        {/* Block 1 */}
        <div>
          <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
            Plataforma SGIA & Ciberseguridad
          </p>
          <div className="space-y-1">
            {menuBlock1.map((item) => {
              const isActive = currentPath === item.path;
              const Icon = item.icon;
              return (
                <button
                  key={item.path}
                  onClick={() => onNavigate(item.path)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-slate-800 text-teal-300 shadow-2xs border-l-3 border-teal-400'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-colors ${
                        isActive ? 'text-teal-400' : 'text-slate-400 group-hover:text-slate-300'
                      }`}
                    />
                    <span className="truncate">{item.name}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-teal-400 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Separator */}
        <div className="border-t border-slate-800/80 pt-4">
          <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
            Gestión & Soporte
          </p>
          <div className="space-y-1">
            {menuBlock2.map((item) => {
              const isActive = currentPath === item.path;
              const Icon = item.icon;
              return (
                <button
                  key={item.path}
                  onClick={() => onNavigate(item.path)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-slate-800 text-teal-300 shadow-2xs border-l-3 border-teal-400'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-colors ${
                        isActive ? 'text-teal-400' : 'text-slate-400'
                      }`}
                    />
                    <span className="truncate">{item.name}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* User Footer */}
      <div className="p-3 border-t border-slate-800/90 bg-slate-950/60 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <img
            src={
              currentUser?.avatarUrl ||
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
            }
            alt={currentUser?.name || 'Usuario'}
            className="w-8 h-8 rounded-full object-cover border border-slate-700 shrink-0"
          />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-slate-200 truncate leading-tight">
              {currentUser?.name || 'Jorge Hosato'}
            </p>
            <p className="text-[11px] text-slate-400 truncate leading-tight">
              {currentUser?.email || 'j-hosato@hotmail.com'}
            </p>
          </div>
        </div>
        <button
          onClick={logout}
          title="Cerrar sesión"
          className="p-1.5 rounded-md text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
