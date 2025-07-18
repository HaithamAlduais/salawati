import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Save, Clock, Bell, Calendar } from 'lucide-react';
import { Task, TaskFilterType, LOCALIZATION } from '../types';
import { useAppContext } from '../contexts/AppContext';
import { cn } from '../lib/utils';

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  blockId: string;
  editingTask?: Task;
}

const TaskForm: React.FC<TaskFormProps> = ({ 
  isOpen, 
  onClose, 
  blockId, 
  editingTask 
}) => {
  const { createTask, updateTask } = useAppContext();
  
  const [formData, setFormData] = useState({
    title: '',
    filters: [] as TaskFilterType[],
    reminderEnabled: false,
    reminderTime: ''
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingTask) {
      setFormData({
        title: editingTask.title,
        filters: editingTask.filters,
        reminderEnabled: editingTask.reminderEnabled || false,
        reminderTime: editingTask.reminderTime ? 
          editingTask.reminderTime.toTimeString().slice(0, 5) : ''
      });
    } else {
      setFormData({
        title: '',
        filters: [],
        reminderEnabled: false,
        reminderTime: ''
      });
    }
  }, [editingTask, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    setLoading(true);
    try {
      const reminderTime = formData.reminderEnabled && formData.reminderTime ? 
        new Date(`${new Date().toDateString()} ${formData.reminderTime}`) : 
        undefined;

      if (editingTask) {
        await updateTask(editingTask.id, {
          title: formData.title.trim(),
          filters: formData.filters,
          reminderEnabled: formData.reminderEnabled,
          reminderTime
        });
      } else {
        await createTask(
          blockId,
          formData.title.trim(),
          formData.filters,
          formData.reminderEnabled,
          reminderTime
        );
      }
      
      onClose();
    } catch (error) {
      console.error('Error saving task:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFilter = (filter: TaskFilterType) => {
    setFormData(prev => ({
      ...prev,
      filters: prev.filters.includes(filter)
        ? prev.filters.filter(f => f !== filter)
        : [...prev.filters, filter]
    }));
  };

  const filterOptions: { value: TaskFilterType; label: string; color: string }[] = [
    { value: 'normalDay', label: LOCALIZATION.normalDay, color: 'bg-blue-500' },
    { value: 'fastingDay', label: LOCALIZATION.fastingDay, color: 'bg-amber-500' },
    { value: 'holiday', label: LOCALIZATION.holiday, color: 'bg-green-500' }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          {/* Form Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative w-full max-w-md glass-card p-0 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                  {editingTask ? (
                    <Save className="w-5 h-5 text-white" />
                  ) : (
                    <Plus className="w-5 h-5 text-white" />
                  )}
                </div>
                <h2 className="text-xl font-bold text-gradient">
                  {editingTask ? LOCALIZATION.editTask : LOCALIZATION.addTask}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-all hover-lift"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Task Title */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  {LOCALIZATION.taskTitle}
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="input"
                  placeholder="اكتب عنوان المهمة..."
                  required
                  autoFocus
                />
              </div>

              {/* Task Filters */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-300">
                  {LOCALIZATION.taskFilters}
                </label>
                <div className="flex flex-wrap gap-2">
                  {filterOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => toggleFilter(option.value)}
                      className={cn(
                        "px-3 py-2 rounded-lg text-sm font-medium transition-all",
                        formData.filters.includes(option.value)
                          ? `${option.color} text-white shadow-lg`
                          : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reminder Settings */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-blue-400" />
                  <label className="text-sm font-medium text-gray-300">
                    {LOCALIZATION.setReminder}
                  </label>
                </div>
                
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.reminderEnabled}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      reminderEnabled: e.target.checked 
                    }))}
                    className="checkbox"
                  />
                  <span className="text-sm text-gray-400">
                    تفعيل التذكير لهذه المهمة
                  </span>
                </label>

                <AnimatePresence>
                  {formData.reminderEnabled && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-2"
                    >
                      <label className="block text-sm font-medium text-gray-300">
                        {LOCALIZATION.reminderTime}
                      </label>
                      <div className="relative">
                        <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="time"
                          value={formData.reminderTime}
                          onChange={(e) => setFormData(prev => ({ 
                            ...prev, 
                            reminderTime: e.target.value 
                          }))}
                          className="input pr-10"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn btn-ghost"
                  disabled={loading}
                >
                  {LOCALIZATION.cancel}
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading || !formData.title.trim()}
                >
                  {loading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                    />
                  ) : editingTask ? (
                    <Save className="w-4 h-4" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                  {editingTask ? LOCALIZATION.save : LOCALIZATION.add}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default TaskForm;