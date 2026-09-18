import React from 'react';

interface ProgressProps {
  value: number;
  max?: number;
  color?: 'teal' | 'emerald' | 'amber' | 'red' | 'blue';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export const Progress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  color = 'teal',
  size = 'md',
  showLabel = false,
  className = ''
}) => {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  const heights = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4'
  };

  const colors = {
    teal: 'bg-teal-600',
    emerald: 'bg-emerald-600',
    amber: 'bg-amber-500',
    red: 'bg-red-600',
    blue: 'bg-blue-600'
  };

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center text-xs font-medium text-slate-600 mb-1.5">
          <span>Progreso</span>
          <span className="font-semibold text-slate-900">{percentage}%</span>
        </div>
      )}
      <div className={`w-full bg-slate-100 rounded-full overflow-hidden ${heights[size]}`}>
        <div
          className={`${colors[color]} ${heights[size]} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
