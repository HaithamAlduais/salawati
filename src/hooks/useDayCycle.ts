/**
 * useDayCycle Hook - Islamic Day Cycle Calculator
 * 
 * This hook calculates the Islamic day cycle which starts from Maghrib prayer
 * and determines the appropriate day label to display.
 * 
 * ISLAMIC DAY CYCLE LOGIC:
 * - Day starts at Maghrib (sunset)
 * - From Maghrib until midnight: "ليلة [Next Day]" (Night of [Next Day])
 * - From midnight until Maghrib: "[Current Day]"
 * 
 * CONNECTIONS:
 * - Used by: App.tsx → Header.tsx (displays day label)
 * - Dependencies: date-fns with Arabic locale, LOCALIZATION from types
 * 
 * EXAMPLE OUTPUT:
 * - After Maghrib: "ليلة الخميس" (Night of Thursday)
 * - Before Maghrib: "الأربعاء" (Wednesday)
 * 
 * TODO: Integrate with real prayer times API for accurate Maghrib time
 */
import { useState, useEffect } from 'react';
import { format, addDays, isAfter, isBefore, startOfDay } from 'date-fns';
import { ar } from 'date-fns/locale';
import { LOCALIZATION } from '../types';

export const useDayCycle = () => {
  // State for current time and calculated day label
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentDayLabel, setCurrentDayLabel] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now);
      
      // Calculate the Islamic day cycle (Maghrib to Maghrib)
      // TODO: Replace with real Maghrib time from prayer times API
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

    // Update time every second for live clock
    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  return { currentTime, currentDayLabel };
}; 