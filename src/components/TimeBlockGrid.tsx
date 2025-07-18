import React from 'react';
import TimeBlock from './TimeBlock';
import { PrayerTimes, TaskFilterType } from '../types';

interface TimeBlockGridProps {
  prayerTimes: PrayerTimes | null;
  loading: boolean;
  selectedFilters: TaskFilterType[];
}

const TimeBlockGrid: React.FC<TimeBlockGridProps> = ({ 
  prayerTimes, 
  loading, 
  selectedFilters 
}) => {
  if (loading) {
    return (
      <div className="loading-container flex justify-center items-center h-64">
        <div className="text-accent text-lg">جاري تحميل أوقات الصلاة...</div>
      </div>
    );
  }

  if (!prayerTimes) {
    return (
      <div className="error-container flex justify-center items-center h-64">
        <div className="text-error-color text-lg">خطأ في تحميل أوقات الصلاة</div>
      </div>
    );
  }

  // Generate time blocks based on prayer times
  const timeBlocks = generateTimeBlocks(prayerTimes);

  return (
    <div className="time-block-grid p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {timeBlocks.map((block) => (
          <TimeBlock
            key={block.id}
            block={block}
            selectedFilters={selectedFilters}
          />
        ))}
      </div>
    </div>
  );
};

// Helper function to generate time blocks
function generateTimeBlocks(prayerTimes: PrayerTimes) {
  const blocks = [];
  
  // This is a simplified version - in the full implementation,
  // we would calculate all the interstitial blocks between prayer times
  // and create the complete 24-hour cycle
  
  return blocks;
}

export default TimeBlockGrid; 