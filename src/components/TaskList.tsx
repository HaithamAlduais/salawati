import React from 'react';
import { Task, TaskFilterType, LOCALIZATION } from '../types';

interface TaskListProps {
  tasks: Task[];
  selectedFilters: TaskFilterType[];
  blockId: string;
}

const TaskList: React.FC<TaskListProps> = ({ 
  tasks, 
  selectedFilters, 
  blockId 
}) => {
  // Filter tasks based on selected filters
  const filteredTasks = tasks.filter(task => 
    selectedFilters.length === 0 || selectedFilters.some(filter => task.filters.includes(filter))
  );

  // Handle task toggle (completed/uncompleted)
  const handleTaskToggle = (taskId: string) => {
    // TODO: Implement task toggle logic with Electron Store
    console.log('Toggle task:', taskId);
  };

  // Handle task deletion
  const handleTaskDelete = (taskId: string) => {
    // TODO: Implement task deletion logic with Electron Store
    console.log('Delete task:', taskId);
  };

  // Handle task reordering (drag and drop)
  const handleTaskReorder = (draggedId: string, targetId: string) => {
    // TODO: Implement task reordering logic with Electron Store
    console.log('Reorder task:', draggedId, 'to:', targetId);
  };

  // Basic drag and drop handlers
  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Allows drop
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    const draggedId = e.dataTransfer.getData('taskId');
    if (draggedId !== targetId) {
      handleTaskReorder(draggedId, targetId);
    }
  };

  return (
    <div className="task-list mt-4">
      {filteredTasks.length === 0 ? (
        <p className="text-secondary text-sm text-center">
          {selectedFilters.length > 0 ? 'لا توجد مهام تطابق الفلتر المحدد' : 'لا توجد مهام بعد'}
        </p>
      ) : (
        <ul className="space-y-2">
          {filteredTasks.sort((a, b) => a.order - b.order).map(task => (
            <li 
              key={task.id} 
              className="flex items-center gap-2 bg-accent p-2 rounded-md shadow-sm cursor-grab hover:bg-border-color transition-colors"
              draggable
              onDragStart={(e) => handleDragStart(e, task.id)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, task.id)}
            >
              {/* Checkbox for task completion */}
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => handleTaskToggle(task.id)}
                className={`h-4 w-4 rounded ${
                  task.isSubTask 
                    ? 'text-secondary' 
                    : 'text-accent-color'
                }`}
              />
              
              {/* Task title */}
              <span className={`flex-1 text-sm ${
                task.completed 
                  ? 'line-through text-secondary' 
                  : 'text-primary'
              }`}>
                {task.title}
              </span>
              
              {/* Task filters/tags */}
              <div className="flex gap-1">
                {task.filters.map(filter => (
                  <span 
                    key={filter} 
                    className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary"
                  >
                    {LOCALIZATION[filter]}
                  </span>
                ))}
              </div>
              
              {/* Delete button */}
              <button 
                onClick={() => handleTaskDelete(task.id)}
                className="text-error-color hover:text-red-500 text-sm transition-colors"
                title="حذف المهمة"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
      
      {/* Add new task button */}
      <button 
        className="w-full mt-3 p-2 border-2 border-dashed border-border-color rounded text-secondary hover:text-accent-color hover:border-accent-color transition-colors"
        onClick={() => console.log('Add new task to block:', blockId)}
      >
        + إضافة مهمة جديدة
      </button>
    </div>
  );
};

export default TaskList; 