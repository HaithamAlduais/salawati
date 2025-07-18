/**
 * Electron Main Process - Desktop App Entry Point
 * 
 * This is the main process that creates the desktop window and manages
 * the application lifecycle. It handles IPC communication with the renderer.
 * 
 * CONNECTIONS:
 * - Creates BrowserWindow that loads the React app
 * - Handles IPC calls from renderer process (preload.ts)
 * - Manages app lifecycle (ready, closed, etc.)
 * - Stores data using electron-store
 * 
 * SECURITY: Uses contextIsolation for secure renderer communication
 * 
 * TODO: Implement prayer time notifications and scheduling
 */
import { app, BrowserWindow, ipcMain, Notification } from 'electron';
import * as path from 'path';
import Store from 'electron-store';
import * as cron from 'node-cron';

// Initialize persistent storage for app data
const store = new Store();

// Main application window
let mainWindow: BrowserWindow | null = null;

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, '../assets/icon.png'),
    titleBarStyle: 'default',
    show: false
  });

  // Load the app
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../../dist/index.html'));
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC handlers for data persistence
ipcMain.handle('store-get', async (event, key: string) => {
  return store.get(key);
});

ipcMain.handle('store-set', async (event, key: string, value: any) => {
  store.set(key, value);
  return true;
});

ipcMain.handle('store-delete', async (event, key: string) => {
  store.delete(key);
  return true;
});

// Notification system
ipcMain.handle('show-notification', async (event, title: string, body: string) => {
  const notification = new Notification({
    title,
    body,
    silent: false
  });
  
  notification.show();
  return true;
});

// Schedule notifications for prayer times
function scheduleNotifications() {
  // This will be implemented to schedule notifications 5 minutes before each time block
  console.log('Notification system initialized');
}

app.whenReady().then(scheduleNotifications); 