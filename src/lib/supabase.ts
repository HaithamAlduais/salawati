import { createClient } from '@supabase/supabase-js';
import type { Task, Note, DatabaseTask, DatabaseNote, TaskFilterType } from '../types';

// These would normally come from environment variables
// For now, using placeholder values - in production, these should be set properly
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper functions to convert between client and database formats
export function taskToDatabase(task: Task): Omit<DatabaseTask, 'created_at' | 'updated_at'> {
  return {
    id: task.id,
    title: task.title,
    completed: task.completed,
    is_sub_task: task.isSubTask,
    parent_id: task.parentId || null,
    filters: task.filters,
    order_index: task.order,
    block_id: task.blockId,
    reminder_enabled: task.reminderEnabled || false,
    reminder_time: task.reminderTime?.toISOString() || null
  };
}

export function taskFromDatabase(dbTask: DatabaseTask): Task {
  return {
    id: dbTask.id,
    title: dbTask.title,
    completed: dbTask.completed,
    isSubTask: dbTask.is_sub_task,
    parentId: dbTask.parent_id || undefined,
    filters: dbTask.filters,
    order: dbTask.order_index,
    blockId: dbTask.block_id,
    reminderEnabled: dbTask.reminder_enabled,
    reminderTime: dbTask.reminder_time ? new Date(dbTask.reminder_time) : undefined,
    createdAt: new Date(dbTask.created_at),
    updatedAt: new Date(dbTask.updated_at)
  };
}

export function noteToDatabase(note: Note): Omit<DatabaseNote, 'created_at' | 'updated_at'> {
  return {
    id: note.id,
    title: note.title,
    content: note.content,
    block_id: note.blockId
  };
}

export function noteFromDatabase(dbNote: DatabaseNote): Note {
  return {
    id: dbNote.id,
    title: dbNote.title,
    content: dbNote.content,
    blockId: dbNote.block_id,
    createdAt: new Date(dbNote.created_at),
    updatedAt: new Date(dbNote.updated_at)
  };
}

// Database operations
export class DatabaseService {
  // Task operations
  static async getTasks(blockId?: string): Promise<Task[]> {
    try {
      let query = supabase.from('tasks').select('*');
      
      if (blockId) {
        query = query.eq('block_id', blockId);
      }
      
      const { data, error } = await query.order('order_index');
      
      if (error) throw error;
      
      return data?.map(taskFromDatabase) || [];
    } catch (error) {
      console.error('Error fetching tasks:', error);
      return [];
    }
  }

  static async createTask(task: Omit<Task, 'createdAt' | 'updatedAt'>): Promise<Task | null> {
    try {
      const dbTask = taskToDatabase({
        ...task,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      const { data, error } = await supabase
        .from('tasks')
        .insert(dbTask)
        .select()
        .single();
      
      if (error) throw error;
      
      return data ? taskFromDatabase(data) : null;
    } catch (error) {
      console.error('Error creating task:', error);
      return null;
    }
  }

  static async updateTask(taskId: string, updates: Partial<Task>): Promise<Task | null> {
    try {
      const updateData = {
        ...updates,
        updated_at: new Date().toISOString()
      };
      
      // Convert client format to database format
      if (updates.isSubTask !== undefined) {
        updateData.is_sub_task = updates.isSubTask;
        delete updateData.isSubTask;
      }
      if (updates.parentId !== undefined) {
        updateData.parent_id = updates.parentId;
        delete updateData.parentId;
      }
      if (updates.order !== undefined) {
        updateData.order_index = updates.order;
        delete updateData.order;
      }
      if (updates.blockId !== undefined) {
        updateData.block_id = updates.blockId;
        delete updateData.blockId;
      }
      if (updates.reminderEnabled !== undefined) {
        updateData.reminder_enabled = updates.reminderEnabled;
        delete updateData.reminderEnabled;
      }
      if (updates.reminderTime !== undefined) {
        updateData.reminder_time = updates.reminderTime?.toISOString() || null;
        delete updateData.reminderTime;
      }
      
      const { data, error } = await supabase
        .from('tasks')
        .update(updateData)
        .eq('id', taskId)
        .select()
        .single();
      
      if (error) throw error;
      
      return data ? taskFromDatabase(data) : null;
    } catch (error) {
      console.error('Error updating task:', error);
      return null;
    }
  }

  static async deleteTask(taskId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);
      
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error deleting task:', error);
      return false;
    }
  }

  static async toggleTask(taskId: string): Promise<Task | null> {
    try {
      // First get the current task
      const { data: currentTask, error: fetchError } = await supabase
        .from('tasks')
        .select('completed')
        .eq('id', taskId)
        .single();
      
      if (fetchError) throw fetchError;
      
      // Toggle the completed status
      const { data, error } = await supabase
        .from('tasks')
        .update({ 
          completed: !currentTask.completed,
          updated_at: new Date().toISOString()
        })
        .eq('id', taskId)
        .select()
        .single();
      
      if (error) throw error;
      
      return data ? taskFromDatabase(data) : null;
    } catch (error) {
      console.error('Error toggling task:', error);
      return null;
    }
  }

  // Note operations
  static async getNotes(blockId?: string): Promise<Note[]> {
    try {
      let query = supabase.from('notes').select('*');
      
      if (blockId) {
        query = query.eq('block_id', blockId);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return data?.map(noteFromDatabase) || [];
    } catch (error) {
      console.error('Error fetching notes:', error);
      return [];
    }
  }

  static async createNote(note: Omit<Note, 'createdAt' | 'updatedAt'>): Promise<Note | null> {
    try {
      const dbNote = noteToDatabase({
        ...note,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      const { data, error } = await supabase
        .from('notes')
        .insert(dbNote)
        .select()
        .single();
      
      if (error) throw error;
      
      return data ? noteFromDatabase(data) : null;
    } catch (error) {
      console.error('Error creating note:', error);
      return null;
    }
  }

  static async updateNote(noteId: string, updates: Partial<Note>): Promise<Note | null> {
    try {
      const updateData = {
        ...updates,
        updated_at: new Date().toISOString()
      };
      
      if (updates.blockId !== undefined) {
        updateData.block_id = updates.blockId;
        delete updateData.blockId;
      }
      
      const { data, error } = await supabase
        .from('notes')
        .update(updateData)
        .eq('id', noteId)
        .select()
        .single();
      
      if (error) throw error;
      
      return data ? noteFromDatabase(data) : null;
    } catch (error) {
      console.error('Error updating note:', error);
      return null;
    }
  }

  static async deleteNote(noteId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', noteId);
      
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error deleting note:', error);
      return false;
    }
  }
}