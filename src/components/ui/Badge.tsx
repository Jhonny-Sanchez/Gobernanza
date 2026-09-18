import React from 'react';
import { getBadgeColor } from '../../utils/calculations';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'teal' | 'auto';
  statusText?: string;
  size?: 'sm' | 'md';
  className?: string;
  showDot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'auto',
  statusText,
  size = 'sm',
  className = '',
  showDot = true
}) => {
  let bg = 'bg-slate-100';
  let text = 'text-slate-700';
  let border = 'border-slate-200';
  let dot = 'bg-slate-400';

  if (variant === 'auto' && (statusText || typeof children === 'string')) {
    const computed = getBadgeColor(statusText || (children as string));
    bg = computed.bg;
    text = computed.text;
    border = computed.border;
    dot = computed.dot;
  } else if (variant === 'teal') {
    bg = 'bg-teal-50';
    text = 'text-teal-700';
    border = 'border-teal-200';
    dot = 'bg-teal-500';
  } else if (variant === 'success') {
    bg = 'bg-emerald-50';
    text = 'text-emerald-700';
    border = 'border-emerald-200';
    dot = 'bg-emerald-500';
  } else if (variant === 'warning') {
    bg = 'bg-amber-50';
    text = 'text-amber-700';
    border = 'border-amber-200';
    dot = 'bg-amber-500';
  } else if (variant === 'danger') {
    bg = 'bg-red-50';
    text = 'text-red-700';
    border = 'border-red-200';
    dot = 'bg-red-500';
  } else if (variant === 'info') {
    bg = 'bg-blue-50';
    text = 'text-blue-700';
    border = 'border-blue-200';
    dot = 'bg-blue-500';
  }

  const sizeClasses = size === 'sm' ? 'text-xs px-2.5 py-0.5' : 'text-sm px-3 py-1';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border whitespace-nowrap ${sizeClasses} ${bg} ${text} ${border} ${className}`}
    >
      {showDot && <span className={`w-1.5 h-1.5 rounded-full ${dot} shrink-0`} />}
      {children}
    </span>
  );
};
