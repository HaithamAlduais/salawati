import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Bell, Clock } from 'lucide-react';
import { Task, TaskFilterType, LOCALIZATION } from '../types';
import { useAppContext } from '../contexts/AppContext';
import TaskForm from './TaskForm';
import { cn, formatTime } from '../lib/utils';

interface TaskListProps {
  blockId: string;
  selectedFilters: TaskFilterType[];
}

const TaskList: React.FC<TaskListProps> = ({ 
  blockId, 
  selectedFilters 
}) => {
  const { getTasksForBlock, toggleTask, deleteTask } = useAppContext();
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();

  // Get tasks for this specific block
  const allTasks = getTasksForBlock(blockId);
  
  // Filter tasks based on selected filters
  const filteredTasks = selectedFilters.length === 0 
    ? allTasks 
    : allTasks.filter(task => 
        selectedFilters.some(filter => task.filters.includes(filter))
      );

  const handleTaskToggle = async (taskId: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    try {
      await toggleTask(taskId);
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  };

  const handleTaskDelete = async (taskId: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    if (confirm('هل أنت متأكد من حذف هذه المهمة؟')) {
      try {
        await deleteTask(taskId);
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  const handleTaskEdit = (task: Task, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    setEditingTask(task);
    setShowTaskForm(true);
  };

  const handleAddTask = () => {
    setEditingTask(undefined);
    setShowTaskForm(true);
  };

  const handleCloseTaskForm = () => {
    setShowTaskForm(false);
    setEditingTask(undefined);
  };

  return (
    <div className="task-list mt-4">
      <AnimatePresence>
        {filteredTasks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-8"
          >
            <div className="text-gray-400 text-sm mb-2">
              {selectedFilters.length > 0 
                ? LOCALIZATION.noTasksForFilter 
                : LOCALIZATION.noTasks
              }
            </div>
            <button
              onClick={handleAddTask}
              className="btn btn-ghost btn-sm mt-2"
            >
              <Plus className="w-4 h-4" />
              {LOCALIZATION.addNewTask}
            </button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-2"
          >
            {filteredTasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ 
                  duration: 0.3, 
                  delay: index * 0.05,
                  type: "spring",
                  stiffness: 200 
                }}
                className={cn(
                  "group glass-card p-3 hover-lift cursor-pointer transition-all",
                  task.completed && "opacity-60"
                )}
              >
                <div className="flex items-center gap-3">
                  {/* Checkbox */}
                  <button
                    onClick={(e) => handleTaskToggle(task.id, e)}
                    className={cn(
                      "flex-shrink-0 w-5 h-5 rounded-md border-2 transition-all relative",
                      "hover:scale-110 active:scale-95",
                      task.completed
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 border-blue-500"
                        : "border-gray-400 hover:border-blue-400"
                    )}
                  >
                    {task.completed && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <div className="text-white text-xs font-bold">✓</div>
                      </motion.div>
                    )}
                  </button>
                  
                  {/* Task Content */}
                  <div className="flex-1 min-w-0">
                    <div className={cn(
                      "font-medium text-sm transition-all",
                      task.completed 
                        ? "line-through text-gray-400" 
                        : "text-white"
                    )}>
                      {task.title}
                    </div>
                    
                    {/* Task Meta */}
                    <div className="flex items-center gap-2 mt-1">
                      {/* Filters */}
                      {task.filters.length > 0 && (
                        <div className="flex gap-1">
                          {task.filters.map(filter => (
                            <span 
                              key={filter} 
                              className={cn(
                                "text-xs px-2 py-0.5 rounded-full text-white",
                                filter === 'normalDay' && "bg-blue-500/70",
                                filter === 'fastingDay' && "bg-amber-500/70",
                                filter === 'holiday' && "bg-green-500/70"
                              )}
                            >
                              {LOCALIZATION[filter]}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      {/* Reminder indicator */}
                      {task.reminderEnabled && task.reminderTime && (
                        <div className="flex items-center gap-1 text-xs text-blue-400">
                          <Bell className="w-3 h-3" />
                          <span>{formatTime(task.reminderTime)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => handleTaskEdit(task, e)}
                      className="p-1.5 hover:bg-white/10 rounded-md transition-all text-gray-400 hover:text-blue-400"
                      title={LOCALIZATION.editTask}
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => handleTaskDelete(task.id, e)}
                      className="p-1.5 hover:bg-white/10 rounded-md transition-all text-gray-400 hover:text-red-400"
                      title={LOCALIZATION.deleteTask}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Add new task button */}
      {filteredTasks.length > 0 && (
        <motion.button
          onClick={handleAddTask}
          className="w-full mt-4 p-3 border-2 border-dashed border-gray-600 rounded-lg text-gray-400 hover:text-blue-400 hover:border-blue-400 transition-all glass-card"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" />
            <span className="font-medium">{LOCALIZATION.addNewTask}</span>
          </div>
        </motion.button>
      )}

      {/* Task Form Modal */}
      <TaskForm
        isOpen={showTaskForm}
        onClose={handleCloseTaskForm}
        blockId={blockId}
        editingTask={editingTask}
      />
    </div>
  );
};

export default TaskList; 