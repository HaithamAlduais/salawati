"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
const electron_1 = require("electron");
// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
electron_1.contextBridge.exposeInMainWorld('electronAPI', {
    // Store operations for data persistence
    storeGet: (key) => electron_1.ipcRenderer.invoke('store-get', key),
    storeSet: (key, value) => electron_1.ipcRenderer.invoke('store-set', key, value),
    storeDelete: (key) => electron_1.ipcRenderer.invoke('store-delete', key),
    // Notifications for prayer time reminders
    showNotification: (title, body) => electron_1.ipcRenderer.invoke('show-notification', title, body),
    // Platform info for OS-specific features
    platform: process.platform
});
//# sourceMappingURL=preload.js.map