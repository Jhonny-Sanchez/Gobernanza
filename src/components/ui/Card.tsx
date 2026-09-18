import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  hoverable = false
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white border border-slate-200/90 rounded-xl p-5 shadow-2xs transition-all duration-150 ${
        hoverable ? 'hover:border-slate-300 hover:shadow-xs cursor-pointer' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};
