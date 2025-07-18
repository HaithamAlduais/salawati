import { useState, useEffect } from 'react';
import { format, addDays, isAfter, isBefore, startOfDay } from 'date-fns';
import { ar } from 'date-fns/locale';
import { LOCALIZATION } from '../types';

export const useDayCycle = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentDayLabel, setCurrentDayLabel] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now);
      
      // Calculate the Islamic day cycle (Maghrib to Maghrib)
      const maghribTime = new Date(now);
      maghribTime.setHours(18, 15, 0, 0); // Mock Maghrib time
      
      let dayLabel: string;
      const nextDay = addDays(now, 1);
      
      if (isAfter(now, maghribTime)) {
        // After Maghrib, show "Night of [Next Day]"
        const nextDayName = format(nextDay, 'EEEE', { locale: ar });
        dayLabel = LOCALIZATION.dayLabelNight + nextDayName;
      } else {
        // Before Maghrib, show current day
        const currentDayName = format(now, 'EEEE', { locale: ar });
        dayLabel = currentDayName;
      }
      
      setCurrentDayLabel(dayLabel);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  return { currentTime, currentDayLabel };
}; 