import React from 'react';
import { motion } from 'framer-motion';
import TimeBlock from './TimeBlock';
import { PrayerTimes, TaskFilterType, TimeBlock as TimeBlockType, PrayerType } from '../types';
import { generateBlockId, formatTime } from '../lib/utils';
import { addHours, addMinutes, differenceInMinutes } from 'date-fns';

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
      <div className="flex justify-center items-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
        />
        <div className="mr-4 text-lg text-gradient">جاري تحميل أوقات الصلاة...</div>
      </div>
    );
  }

  if (!prayerTimes) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="text-red-400 text-lg mb-2">خطأ في تحميل أوقات الصلاة</div>
          <p className="text-gray-400 text-sm">يرجى التحقق من الاتصال بالإنترنت وإعادة المحاولة</p>
        </div>
      </div>
    );
  }

  // Generate time blocks based on prayer times
  const timeBlocks = generateTimeBlocks(prayerTimes);

  return (
    <div className="time-block-grid p-4">
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {timeBlocks.map((block, index) => (
          <motion.div
            key={block.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.5, 
              delay: index * 0.1,
              type: "spring",
              stiffness: 100 
            }}
          >
            <TimeBlock
              block={block}
              selectedFilters={selectedFilters}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

// Helper function to generate time blocks based on prayer times
function generateTimeBlocks(prayerTimes: PrayerTimes): TimeBlockType[] {
  const blocks: TimeBlockType[] = [];
  const prayers = [
    { name: 'فجر', time: prayerTimes.fajr, type: 'fajr' as PrayerType },
    { name: 'ظهر', time: prayerTimes.dhuhr, type: 'dhuhr' as PrayerType },
    { name: 'عصر', time: prayerTimes.asr, type: 'asr' as PrayerType },
    { name: 'مغرب', time: prayerTimes.maghrib, type: 'maghrib' as PrayerType },
    { name: 'عشاء', time: prayerTimes.isha, type: 'isha' as PrayerType }
  ];

  // Add Qiyam al-Layl if available
  if (prayerTimes.qiyam) {
    prayers.unshift({
      name: 'قيام الليل',
      time: prayerTimes.qiyam,
      type: 'qiyam' as PrayerType
    });
  }

  // Sort prayers by time
  prayers.sort((a, b) => a.time.getTime() - b.time.getTime());

  prayers.forEach((prayer, index) => {
    const startTime = prayer.time;
    const nextPrayer = prayers[index + 1];
    const endTime = nextPrayer ? nextPrayer.time : addHours(prayer.time, 24);
    
    // Calculate duration for prayer block (typically 30-45 minutes)
    const prayerDuration = prayer.name === 'قيام الليل' ? 90 : 
                          prayer.name === 'فجر' ? 45 : 
                          prayer.name === 'مغرب' ? 30 : 45;
    
    const prayerEndTime = addMinutes(startTime, prayerDuration);

    // Create prayer block
    const prayerBlock: TimeBlockType = {
      id: generateBlockId(),
      type: 'prayer',
      startTime,
      endTime: prayerEndTime,
      title: `صلاة ${prayer.name}`,
      symbol: '●',
      tasks: [],
      notes: [],
      prayerType: prayer.type
    };

    blocks.push(prayerBlock);

    // Create interstitial block if there's time between prayers
    if (nextPrayer) {
      const interstitialStart = prayerEndTime;
      const interstitialEnd = nextPrayer.time;
      
      // Only create interstitial block if there's significant time (> 30 minutes)
      if (differenceInMinutes(interstitialEnd, interstitialStart) > 30) {
        const interstitialBlock: TimeBlockType = {
          id: generateBlockId(),
          type: 'interstitial',
          startTime: interstitialStart,
          endTime: interstitialEnd,
          title: `بين ${prayer.name} و ${nextPrayer.name}`,
          symbol: '○',
          tasks: [],
          notes: []
        };

        blocks.push(interstitialBlock);
      }
    } else {
      // Handle the last prayer to next day's first prayer
      const nextDayFirstPrayer = prayers[0];
      const nextDayTime = new Date(nextDayFirstPrayer.time);
      nextDayTime.setDate(nextDayTime.getDate() + 1);
      
      if (differenceInMinutes(nextDayTime, prayerEndTime) > 30) {
        const interstitialBlock: TimeBlockType = {
          id: generateBlockId(),
          type: 'interstitial',
          startTime: prayerEndTime,
          endTime: nextDayTime,
          title: `بين ${prayer.name} و ${nextDayFirstPrayer.name}`,
          symbol: '○',
          tasks: [],
          notes: []
        };

        blocks.push(interstitialBlock);
      }
    }
  });

  return blocks;
}

export default TimeBlockGrid; 