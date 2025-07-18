import React from 'react';
import { motion } from 'framer-motion';
import { Filter, Calendar, Coffee, PartyPopper } from 'lucide-react';
import { TaskFilterType, LOCALIZATION } from '../types';
import { cn } from '../lib/utils';

interface TaskFilterProps {
  selectedFilters: TaskFilterType[];
  onFilterChange: (filters: TaskFilterType[]) => void;
}

const TaskFilter: React.FC<TaskFilterProps> = ({ selectedFilters, onFilterChange }) => {
  const filterOptions: { 
    value: TaskFilterType; 
    label: string; 
    icon: React.ElementType;
    color: string;
    bgColor: string;
  }[] = [
    { 
      value: 'normalDay', 
      label: LOCALIZATION.normalDay, 
      icon: Calendar,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500'
    },
    { 
      value: 'fastingDay', 
      label: LOCALIZATION.fastingDay, 
      icon: Coffee,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500'
    },
    { 
      value: 'holiday', 
      label: LOCALIZATION.holiday, 
      icon: PartyPopper,
      color: 'text-green-400',
      bgColor: 'bg-green-500'
    }
  ];

  const handleFilterToggle = (filter: TaskFilterType) => {
    if (selectedFilters.includes(filter)) {
      onFilterChange(selectedFilters.filter(f => f !== filter));
    } else {
      onFilterChange([...selectedFilters, filter]);
    }
  };

  return (
    <motion.div 
      className="glass-card m-4 p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        {/* Filter Label */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg">
            <Filter className="w-5 h-5 text-purple-400" />
          </div>
          <span className="text-white font-medium text-lg">
            {LOCALIZATION.taskFilter}
          </span>
        </div>
        
        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          {filterOptions.map((option, index) => {
            const Icon = option.icon;
            const isSelected = selectedFilters.includes(option.value);
            
            return (
              <motion.button
                key={option.value}
                onClick={() => handleFilterToggle(option.value)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all text-sm",
                  "border border-white/10 hover-lift",
                  isSelected
                    ? `${option.bgColor} text-white shadow-lg`
                    : "bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white"
                )}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon className={cn(
                  "w-4 h-4",
                  isSelected ? "text-white" : option.color
                )} />
                <span>{option.label}</span>
                
                {/* Selection indicator */}
                {isSelected && (
                  <motion.div
                    className="w-2 h-2 bg-white rounded-full"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500 }}
                  />
                )}
              </motion.button>
            );
          })}
          
          {/* Clear all filters button */}
          {selectedFilters.length > 0 && (
            <motion.button
              onClick={() => onFilterChange([])}
              className="px-3 py-2 text-sm text-gray-400 hover:text-red-400 transition-colors"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              مسح الكل
            </motion.button>
          )}
        </div>
      </div>
      
      {/* Active filters count */}
      {selectedFilters.length > 0 && (
        <motion.div 
          className="mt-3 text-sm text-gray-400"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          عرض المهام لـ {selectedFilters.length} من أنواع الأيام
        </motion.div>
      )}
    </motion.div>
  );
};

export default TaskFilter; 