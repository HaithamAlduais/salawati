import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { format, differenceInMinutes } from 'date-fns';
import { ar } from 'date-fns/locale';
import { Clock, Moon, Sun, Sunrise, Sunset } from 'lucide-react';
import { TimeBlock as TimeBlockType, TaskFilterType, LOCALIZATION } from '../types';
import TaskList from './TaskList';
import NoteEditor from './NoteEditor';
import { formatTime, getPrayerColor } from '../lib/utils';
import { cn } from '../lib/utils';

interface TimeBlockProps {
  block: TimeBlockType;
  selectedFilters: TaskFilterType[];
}

const TimeBlock: React.FC<TimeBlockProps> = ({ block, selectedFilters }) => {
  const [showNoteEditor, setShowNoteEditor] = useState(false);
  
  const now = new Date();
  const isActive = now >= block.startTime && now <= block.endTime;
  const isPast = now > block.endTime;
  const isFuture = now < block.startTime;
  
  const remainingMinutes = differenceInMinutes(block.endTime, now);
  const totalMinutes = differenceInMinutes(block.endTime, block.startTime);
  
  const getStatusColor = () => {
    if (isActive) return 'border-green-500';
    if (isPast) return 'border-gray-600';
    return 'border-blue-500';
  };

  const getStatusText = () => {
    if (isActive) return 'نشط الآن';
    if (isPast) return 'منتهي';
    return 'قادم';
  };

  const getPrayerIcon = () => {
    if (!block.prayerType) return Clock;
    
    switch (block.prayerType) {
      case 'fajr': return Sunrise;
      case 'dhuhr': return Sun;
      case 'asr': return Sun;
      case 'maghrib': return Sunset;
      case 'isha': return Moon;
      case 'qiyam': return Moon;
      default: return Clock;
    }
  };

  const Icon = getPrayerIcon();

  return (
    <motion.div 
      className={cn(
        "glass-card hover-lift transition-all",
        getStatusColor(),
        isActive && "ring-2 ring-green-500/50 shadow-lg shadow-green-500/20"
      )}
      whileHover={{ y: -4 }}
      layout
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-start gap-3">
            {/* Prayer Icon and Symbol */}
            <div className="flex flex-col items-center gap-1">
              <div 
                className="p-2 rounded-lg"
                style={{ 
                  backgroundColor: block.prayerType ? 
                    getPrayerColor(block.title.replace('صلاة ', '')) + '20' : 
                    'rgba(59, 130, 246, 0.2)' 
                }}
              >
                <Icon 
                  className="w-5 h-5" 
                  style={{ 
                    color: block.prayerType ? 
                      getPrayerColor(block.title.replace('صلاة ', '')) : 
                      'rgb(59, 130, 246)' 
                  }}
                />
              </div>
              <div 
                className="text-2xl font-bold"
                style={{ 
                  color: block.prayerType ? 
                    getPrayerColor(block.title.replace('صلاة ', '')) : 
                    'rgb(59, 130, 246)' 
                }}
              >
                {block.symbol}
              </div>
            </div>
            
            {/* Block Info */}
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white mb-1 leading-tight">
                {block.title}
              </h3>
              
              {/* Special display for Qiyam al-Layl */}
              {block.prayerType === 'qiyam' && (
                <div className="text-sm text-purple-300 mb-2">
                  {LOCALIZATION.qiyamTime}: {formatTime(block.startTime)}
                </div>
              )}
              
              <div className="text-sm text-gray-400 mb-2">
                {formatTime(block.startTime)} - {formatTime(block.endTime)}
              </div>
              
              <div className="text-xs text-gray-500">
                المدة: {Math.round(totalMinutes)} دقيقة
              </div>
            </div>
          </div>
          
          {/* Status */}
          <div className="text-left">
            <div className={cn(
              "text-sm font-medium px-3 py-1 rounded-full",
              isActive ? "bg-green-500/20 text-green-400" :
              isPast ? "bg-gray-500/20 text-gray-400" :
              "bg-blue-500/20 text-blue-400"
            )}>
              {getStatusText()}
            </div>
          </div>
        </div>

        {/* Active countdown */}
        {isActive && (
          <motion.div 
            className="text-center mb-4 p-3 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-lg border border-green-500/20"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="text-green-400 font-bold text-lg flex items-center justify-center gap-2">
              <Clock className="w-5 h-5" />
              {remainingMinutes > 0 ? `${remainingMinutes} دقيقة متبقية` : 'انتهى الوقت'}
            </div>
          </motion.div>
        )}

        {/* Block Content */}
        <div className="block-content">
          {block.type === 'prayer' ? (
            <TaskList 
              blockId={block.id}
              selectedFilters={selectedFilters}
            />
          ) : (
            <div className="notes-section">
              {block.notes.length > 0 ? (
                <div 
                  className="note-preview glass-card p-3 cursor-pointer hover-lift transition-all"
                  onClick={() => setShowNoteEditor(true)}
                >
                  <h4 className="font-medium text-white mb-1">
                    {block.notes[0].title}
                  </h4>
                  <p className="text-sm text-gray-400 line-clamp-2">
                    {block.notes[0].content.substring(0, 100)}
                    {block.notes[0].content.length > 100 && '...'}
                  </p>
                </div>
              ) : (
                <button
                  className="w-full p-3 border-2 border-dashed border-gray-600 rounded-lg text-gray-400 hover:text-blue-400 hover:border-blue-400 transition-all glass-card"
                  onClick={() => setShowNoteEditor(true)}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>إضافة ملاحظة</span>
                  </div>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Note Editor Modal */}
      {showNoteEditor && (
        <NoteEditor
          blockId={block.id}
          notes={block.notes}
          onClose={() => setShowNoteEditor(false)}
        />
      )}
    </motion.div>
  );
};

export default TimeBlock; 