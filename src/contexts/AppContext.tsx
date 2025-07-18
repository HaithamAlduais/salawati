import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Task, Settings, TaskFilterType, TimeBlock } from '../types';
import { DatabaseService } from '../lib/supabase';
import { generateTaskId } from '../lib/utils';
import toast from 'react-hot-toast';

interface AppState {
  tasks: Task[];
  settings: Settings | null;
  loading: boolean;
  selectedFilters: TaskFilterType[];
  isSettingsOpen: boolean;
}

type AppAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_TASKS'; payload: Task[] }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: { id: string; updates: Partial<Task> } }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'TOGGLE_TASK'; payload: string }
  | { type: 'SET_SETTINGS'; payload: Settings }
  | { type: 'SET_FILTERS'; payload: TaskFilterType[] }
  | { type: 'TOGGLE_SETTINGS'; payload?: boolean };

const initialState: AppState = {
  tasks: [],
  settings: null,
  loading: true,
  selectedFilters: [],
  isSettingsOpen: false
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_TASKS':
      return { ...state, tasks: action.payload };
    
    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload] };
    
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id
            ? { ...task, ...action.payload.updates, updatedAt: new Date() }
            : task
        )
      };
    
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload)
      };
    
    case 'TOGGLE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload
            ? { ...task, completed: !task.completed, updatedAt: new Date() }
            : task
        )
      };
    
    case 'SET_SETTINGS':
      return { ...state, settings: action.payload };
    
    case 'SET_FILTERS':
      return { ...state, selectedFilters: action.payload };
    
    case 'TOGGLE_SETTINGS':
      return {
        ...state,
        isSettingsOpen: action.payload ?? !state.isSettingsOpen
      };
    
    default:
      return state;
  }
}

interface AppContextValue extends AppState {
  // Task operations
  createTask: (blockId: string, title: string, filters: TaskFilterType[], reminderEnabled?: boolean, reminderTime?: Date) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleTask: (id: string) => Promise<void>;
  
  // Filter operations
  setFilters: (filters: TaskFilterType[]) => void;
  
  // Settings operations
  updateSettings: (settings: Partial<Settings>) => Promise<void>;
  toggleSettings: (open?: boolean) => void;
  
  // Utility functions
  getTasksForBlock: (blockId: string) => Task[];
  refreshTasks: () => Promise<void>;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Initialize app data
  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Load tasks
      const tasks = await DatabaseService.getTasks();
      dispatch({ type: 'SET_TASKS', payload: tasks });
      
      // Load settings (for now, create default settings)
      const defaultSettings: Settings = {
        id: 'default',
        userId: 'default_user',
        notificationsEnabled: true,
        location: {
          latitude: 21.4225,
          longitude: 39.8262,
          city: 'مكة المكرمة',
          country: 'السعودية'
        },
        calculationMethod: 'MWL',
        madhab: 'Shafi',
        adjustments: {
          fajr: 0,
          dhuhr: 0,
          asr: 0,
          maghrib: 0,
          isha: 0
        },
        theme: 'dark',
        language: 'ar',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      dispatch({ type: 'SET_SETTINGS', payload: defaultSettings });
      
    } catch (error) {
      console.error('Error initializing app:', error);
      toast.error('فشل في تحميل البيانات');
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const createTask = async (
    blockId: string,
    title: string,
    filters: TaskFilterType[],
    reminderEnabled: boolean = false,
    reminderTime?: Date
  ) => {
    try {
      const newTask: Omit<Task, 'createdAt' | 'updatedAt'> = {
        id: generateTaskId(),
        title,
        completed: false,
        isSubTask: false,
        filters,
        order: state.tasks.filter(t => t.blockId === blockId).length,
        blockId,
        reminderEnabled,
        reminderTime
      };

      const createdTask = await DatabaseService.createTask(newTask);
      if (createdTask) {
        dispatch({ type: 'ADD_TASK', payload: createdTask });
        toast.success('تم إنشاء المهمة بنجاح');
      } else {
        throw new Error('Failed to create task');
      }
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error('فشل في إنشاء المهمة');
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      const updatedTask = await DatabaseService.updateTask(id, updates);
      if (updatedTask) {
        dispatch({ type: 'UPDATE_TASK', payload: { id, updates } });
        toast.success('تم تحديث المهمة بنجاح');
      } else {
        throw new Error('Failed to update task');
      }
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('فشل في تحديث المهمة');
    }
  };

  const deleteTask = async (id: string) => {
    try {
      const success = await DatabaseService.deleteTask(id);
      if (success) {
        dispatch({ type: 'DELETE_TASK', payload: id });
        toast.success('تم حذف المهمة بنجاح');
      } else {
        throw new Error('Failed to delete task');
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('فشل في حذف المهمة');
    }
  };

  const toggleTask = async (id: string) => {
    try {
      const updatedTask = await DatabaseService.toggleTask(id);
      if (updatedTask) {
        dispatch({ type: 'TOGGLE_TASK', payload: id });
        toast.success(updatedTask.completed ? 'تم إكمال المهمة' : 'تم إلغاء إكمال المهمة');
      } else {
        throw new Error('Failed to toggle task');
      }
    } catch (error) {
      console.error('Error toggling task:', error);
      toast.error('فشل في تحديث حالة المهمة');
    }
  };

  const setFilters = (filters: TaskFilterType[]) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  };

  const updateSettings = async (settingsUpdates: Partial<Settings>) => {
    try {
      if (state.settings) {
        const updatedSettings = {
          ...state.settings,
          ...settingsUpdates,
          updatedAt: new Date()
        };
        dispatch({ type: 'SET_SETTINGS', payload: updatedSettings });
        toast.success('تم حفظ الإعدادات بنجاح');
      }
    } catch (error) {
      console.error('Error updating settings:', error);
      toast.error('فشل في حفظ الإعدادات');
    }
  };

  const toggleSettings = (open?: boolean) => {
    dispatch({ type: 'TOGGLE_SETTINGS', payload: open });
  };

  const getTasksForBlock = (blockId: string): Task[] => {
    return state.tasks
      .filter(task => task.blockId === blockId)
      .sort((a, b) => a.order - b.order);
  };

  const refreshTasks = async () => {
    try {
      const tasks = await DatabaseService.getTasks();
      dispatch({ type: 'SET_TASKS', payload: tasks });
    } catch (error) {
      console.error('Error refreshing tasks:', error);
      toast.error('فشل في تحديث المهام');
    }
  };

  const contextValue: AppContextValue = {
    ...state,
    createTask,
    updateTask,
    deleteTask,
    toggleTask,
    setFilters,
    updateSettings,
    toggleSettings,
    getTasksForBlock,
    refreshTasks
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}