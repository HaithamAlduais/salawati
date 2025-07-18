/**
 * Preload Script - Secure IPC Communication Bridge
 * 
 * This script runs in the renderer process but has access to Node.js APIs.
 * It creates a secure bridge between the main process and renderer process.
 * 
 * SECURITY: Only exposes specific methods to the renderer process
 * CONNECTIONS: Main process (electron/src/main.ts) ↔ Renderer process (React app)
 * 
 * EXPOSED APIs:
 * - storeGet/storeSet/storeDelete: Data persistence operations
 * - showNotification: System notification display
 * - platform: Current operating system info
 */
import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Store operations for data persistence
  storeGet: (key: string) => ipcRenderer.invoke('store-get', key),
  storeSet: (key: string, value: any) => ipcRenderer.invoke('store-set', key, value),
  storeDelete: (key: string) => ipcRenderer.invoke('store-delete', key),
  
  // Notifications for prayer time reminders
  showNotification: (title: string, body: string) => 
    ipcRenderer.invoke('show-notification', title, body),
  
  // Platform info for OS-specific features
  platform: process.platform
});

// Type definitions for the exposed API
declare global {
  interface Window {
    electronAPI: {
      storeGet: (key: string) => Promise<any>;
      storeSet: (key: string, value: any) => Promise<boolean>;
      storeDelete: (key: string) => Promise<boolean>;
      showNotification: (title: string, body: string) => Promise<boolean>;
      platform: string;
    };
  }
} 