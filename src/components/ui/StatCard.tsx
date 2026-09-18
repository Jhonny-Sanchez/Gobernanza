import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: string;
    isPositive?: boolean;
    isNeutral?: boolean;
  };
  comparison?: string;
  icon: React.ReactNode;
  statusColor?: 'teal' | 'blue' | 'emerald' | 'amber' | 'red';
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  trend,
  comparison,
  icon,
  statusColor = 'teal',
  onClick
}) => {
  const colorMap = {
    teal: { iconBg: 'bg-teal-50 text-teal-700 border-teal-100', accent: 'bg-teal-500' },
    blue: { iconBg: 'bg-blue-50 text-blue-700 border-blue-100', accent: 'bg-blue-500' },
    emerald: { iconBg: 'bg-emerald-50 text-emerald-700 border-emerald-100', accent: 'bg-emerald-500' },
    amber: { iconBg: 'bg-amber-50 text-amber-700 border-amber-100', accent: 'bg-amber-500' },
    red: { iconBg: 'bg-red-50 text-red-700 border-red-100', accent: 'bg-red-500' }
  };

  const currentTheme = colorMap[statusColor] || colorMap.teal;

  return (
    <div
      onClick={onClick}
      className={`bg-white border border-slate-200/90 rounded-xl p-5 shadow-2xs relative overflow-hidden transition-all duration-150 ${
        onClick ? 'cursor-pointer hover:border-slate-300 hover:shadow-xs' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-slate-500 tracking-wide uppercase truncate mb-1">
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 tracking-tight">{value}</span>
            {subtitle && <span className="text-xs text-slate-500 font-medium">{subtitle}</span>}
          </div>
        </div>
        <div
          className={`w-11 h-11 rounded-lg flex items-center justify-center border shrink-0 ${currentTheme.iconBg}`}
        >
          {icon}
        </div>
      </div>

      {(trend || comparison) && (
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          {trend && (
            <div
              className={`flex items-center gap-1 font-semibold ${
                trend.isNeutral
                  ? 'text-slate-500'
                  : trend.isPositive
                  ? 'text-emerald-700'
                  : 'text-red-700'
              }`}
            >
              {trend.isNeutral ? (
                <Minus className="w-3.5 h-3.5" />
              ) : trend.isPositive ? (
                <TrendingUp className="w-3.5 h-3.5" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5" />
              )}
              <span>{trend.value}</span>
            </div>
          )}
          {comparison && (
            <span className="text-slate-400 font-normal truncate ml-auto">{comparison}</span>
          )}
        </div>
      )}
    </div>
  );
};
