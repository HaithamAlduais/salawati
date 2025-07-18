import React from 'react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

interface HeaderProps {
  currentTime: Date;
  dayLabel: string;
}

const Header: React.FC<HeaderProps> = ({ currentTime, dayLabel }) => {
  return (
    <header className="header bg-secondary border-b border-border-color p-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="clock text-2xl font-bold text-accent">
            {format(currentTime, 'HH:mm:ss', { locale: ar })}
          </div>
          <div className="date text-lg text-secondary">
            {format(currentTime, 'EEEE, d MMMM yyyy', { locale: ar })}
          </div>
        </div>
        
        <div className="day-label text-xl font-semibold text-primary">
          {dayLabel}
        </div>
      </div>
    </header>
  );
};

export default Header; 