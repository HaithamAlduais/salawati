import React, { useState } from 'react';
import { format, differenceInMinutes } from 'date-fns';
import { ar } from 'date-fns/locale';
import { TimeBlock as TimeBlockType, TaskFilterType } from '../types';
import TaskList from './TaskList';
import NoteEditor from './NoteEditor';

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
    if (isActive) return 'border-success-color';
    if (isPast) return 'border-secondary';
    return 'border-accent-color';
  };

  const getStatusText = () => {
    if (isActive) return 'نشط الآن';
    if (isPast) return 'منتهي';
    return 'قادم';
  };

  return (
    <div className={`time-block bg-secondary border rounded-lg p-4 ${getStatusColor()} transition-all hover:shadow-lg`}>
      <div className="block-header flex justify-between items-start mb-4">
        <div className="block-info">
          <div className="symbol text-2xl mb-2">{block.symbol}</div>
          <h3 className="block-title text-lg font-semibold text-primary mb-1">
            {block.title}
          </h3>
          <div className="time-range text-sm text-secondary">
            {format(block.startTime, 'HH:mm', { locale: ar })} - {format(block.endTime, 'HH:mm', { locale: ar })}
          </div>
        </div>
        
        <div className="status-info text-right">
          <div className={`status text-sm font-medium ${
            isActive ? 'text-success-color' : isPast ? 'text-secondary' : 'text-accent-color'
          }`}>
            {getStatusText()}
          </div>
          <div className="duration text-xs text-secondary">
            {totalMinutes} دقيقة
          </div>
        </div>
      </div>

      {isActive && (
        <div className="countdown text-center mb-4">
          <div className="text-accent font-bold text-lg">
            {remainingMinutes} دقيقة متبقية
          </div>
        </div>
      )}

      <div className="block-content">
        {block.type === 'prayer' ? (
          <TaskList 
            tasks={block.tasks}
            selectedFilters={selectedFilters}
            blockId={block.id}
          />
        ) : (
          <div className="notes-preview">
            {block.notes.length > 0 ? (
              <div 
                className="note-preview cursor-pointer p-3 bg-accent rounded hover:bg-border-color transition-colors"
                onClick={() => setShowNoteEditor(true)}
              >
                <h4 className="note-title font-medium text-primary mb-1">
                  {block.notes[0].title}
                </h4>
                <p className="note-snippet text-sm text-secondary line-clamp-2">
                  {block.notes[0].content.substring(0, 100)}...
                </p>
              </div>
            ) : (
              <button
                className="add-note-btn w-full p-3 border-2 border-dashed border-border-color rounded text-secondary hover:text-accent-color hover:border-accent-color transition-colors"
                onClick={() => setShowNoteEditor(true)}
              >
                + إضافة ملاحظة
              </button>
            )}
          </div>
        )}
      </div>

      {showNoteEditor && (
        <NoteEditor
          blockId={block.id}
          notes={block.notes}
          onClose={() => setShowNoteEditor(false)}
        />
      )}
    </div>
  );
};

export default TimeBlock; 