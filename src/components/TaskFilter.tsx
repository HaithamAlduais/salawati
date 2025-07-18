import React from 'react';
import { TaskFilterType, LOCALIZATION } from '../types';

interface TaskFilterProps {
  selectedFilters: TaskFilterType[];
  onFilterChange: (filters: TaskFilterType[]) => void;
}

const TaskFilter: React.FC<TaskFilterProps> = ({ selectedFilters, onFilterChange }) => {
  const filterOptions: { value: TaskFilterType; label: string }[] = [
    { value: 'normalDay', label: LOCALIZATION.normalDay },
    { value: 'fastingDay', label: LOCALIZATION.fastingDay },
    { value: 'holiday', label: LOCALIZATION.holiday }
  ];

  const handleFilterToggle = (filter: TaskFilterType) => {
    if (selectedFilters.includes(filter)) {
      onFilterChange(selectedFilters.filter(f => f !== filter));
    } else {
      onFilterChange([...selectedFilters, filter]);
    }
  };

  return (
    <div className="task-filter bg-accent p-4 rounded-lg m-4">
      <div className="flex items-center gap-4">
        <span className="text-primary font-medium">{LOCALIZATION.taskFilter}</span>
        
        <div className="flex gap-2">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleFilterToggle(option.value)}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                selectedFilters.includes(option.value)
                  ? 'bg-accent-color text-white'
                  : 'bg-secondary text-secondary hover:bg-border-color'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskFilter; 