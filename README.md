# صلواتي - Salawati

A cross-platform Islamic day cycle routine management application built with **Electron + React + TypeScript**.

## 🚀 Technology Stack

### **Frontend Framework: React (NOT React Native or Flutter)**
- **React 18** with TypeScript for the user interface
- **Vite** for fast development and building
- **CSS** with RTL support for Arabic text
- **date-fns** with Arabic locale for date/time handling

### **Desktop Framework: Electron**
- **Electron 28** for cross-platform desktop app (Windows, Mac, Linux)
- **Electron Store** for local data persistence
- **IPC (Inter-Process Communication)** for secure main/renderer communication

### **Why This Stack?**
- **Cross-platform**: Works on Windows, Mac, and Linux
- **Web technologies**: Familiar React/TypeScript development
- **Desktop native**: Full access to system APIs (notifications, file system)
- **RTL support**: Excellent Arabic text support
- **Performance**: Fast development with Vite, optimized builds

## 🏗️ What Was Built

### **Complete App Foundation**
✅ **Electron Setup**: Main process with window management and IPC handlers  
✅ **React Frontend**: TypeScript components with RTL support  
✅ **Build System**: Vite configuration for development and production  
✅ **Type Safety**: Comprehensive TypeScript definitions  

### **Islamic Day Cycle Logic**
✅ **Maghrib to Maghrib**: Day cycle starting from Maghrib prayer  
✅ **Dynamic Day Labels**: "ليلة [Next Day]" after Maghrib, "[Current Day]" before Maghrib  
✅ **Real-time Clock**: Live clock with Arabic date/time formatting  
✅ **Prayer Time Integration**: Hook for fetching prayer times (currently mock data)  

### **Time Block System**
✅ **Prayer Blocks (●)**: 1.5 hours for Qiyam, Fajr, Dhuhr, Asr; 3 hours for Maghrib & Isha  
✅ **Interstitial Blocks (○)**: Variable duration between prayer blocks  
✅ **Status Indicators**: Active, past, and future block states  
✅ **Real-time Countdown**: Shows remaining time for active blocks  

### **Task Management Foundation**
✅ **Contextual Task Filtering**: "Normal Day", "Fasting Day", "Holiday" filters  
✅ **Task Hierarchy**: Main tasks (□) and sub-tasks (○) with different styling  
✅ **Drag & Drop**: Ready structure for task reordering  
✅ **Task List Component**: Complete task display and management UI  

### **RTL Markdown Editor Foundation**
✅ **Full RTL Support**: Natural Arabic writing experience  
✅ **Rich Markdown**: Toolbar with formatting buttons (B, I, H, •, </>)  
✅ **Auto-save**: System ready for Electron Store integration  
✅ **Keyboard Shortcuts**: Ctrl+S (save), Ctrl+B (bold), Ctrl+I (italic)  

### **Notification System**
✅ **Electron notifications**: Infrastructure ready for 5-minute reminders  
✅ **IPC handlers**: Secure communication between main and renderer processes  

## 📁 Project Structure

```
salawati/
├── src/                          # React frontend (Web technologies)
│   ├── components/               # React components
│   │   ├── Header.tsx           # Clock, date, and day label display
│   │   ├── TaskFilter.tsx       # Task filtering by day type
│   │   ├── TimeBlockGrid.tsx    # Grid layout for time blocks
│   │   ├── TimeBlock.tsx        # Individual time block display
│   │   ├── TaskList.tsx         # Task management within blocks
│   │   └── NoteEditor.tsx       # RTL Markdown editor for notes
│   ├── hooks/                   # Custom React hooks
│   │   ├── usePrayerTimes.ts    # Fetch prayer times from API
│   │   └── useDayCycle.ts       # Islamic day cycle calculations
│   ├── types/                   # TypeScript type definitions
│   │   └── index.ts             # All app types and interfaces
│   ├── main.tsx                 # React entry point
│   ├── App.tsx                  # Main app component
│   └── index.css                # RTL styles and dark theme
├── electron/                    # Electron main process (Desktop app)
│   ├── src/
│   │   ├── main.ts              # Main process with window creation
│   │   └── preload.ts           # Secure IPC communication
│   └── tsconfig.json            # TypeScript config for Electron
├── dist/                        # Built frontend (will be created)
├── package.json                 # Dependencies and scripts
├── vite.config.ts               # Vite build configuration
├── tsconfig.json                # TypeScript config for React
└── index.html                   # HTML entry point with RTL support
```

## 🚀 Development

### **Prerequisites**
- Node.js 18+
- npm or yarn

### **Installation & Running**
```bash
# Clone the repository
git clone https://github.com/HaithamAlduais/salawati.git
cd salawati

# Install dependencies
npm install

# Start development server (Web version for testing)
npm run dev

# Start Electron app (Desktop version)
npm run dev:main
```

### **What Each Command Does**
- `npm run dev`: Starts Vite dev server on localhost:3000 (Web version)
- `npm run dev:main`: Compiles Electron main process and starts desktop app
- `npm run build`: Builds React frontend for production
- `npm run dist`: Creates distributable desktop app

## 🔧 Key Features Implemented

### **1. Islamic Day Cycle Logic**
```typescript
// src/hooks/useDayCycle.ts
// Calculates Islamic day cycle (Maghrib to Maghrib)
// Shows "ليلة [Next Day]" after Maghrib, "[Current Day]" before Maghrib
```

### **2. RTL Support**
```html
<!-- index.html -->
<html lang="ar" dir="rtl">
<!-- Full Arabic font support and RTL text direction -->
```

### **3. Dark Theme with Arabic Styling**
```css
/* src/index.css */
/* Dark theme with Arabic font (Noto Sans Arabic) */
/* RTL support and Arabic color scheme */
```

### **4. Task Management System**
```typescript
// src/components/TaskList.tsx
// Drag & drop tasks with filtering by day type
// Main tasks (□) and sub-tasks (○) with different styling
```

### **5. RTL Markdown Editor**
```typescript
// src/components/NoteEditor.tsx
// Full RTL support for Arabic writing
// Markdown toolbar with formatting options
// Keyboard shortcuts (Ctrl+S, Ctrl+B, Ctrl+I)
```

## 🎯 Next Steps

### **Immediate Tasks**
1. **Complete Time Block Logic**: Generate full 24-hour cycle from prayer times
2. **Implement Electron Store**: Connect task/note saving to local storage
3. **Add Prayer Times API**: Replace mock data with real prayer times API
4. **Complete Markdown Editor**: Implement formatting buttons functionality

### **Advanced Features**
1. **Notifications**: Schedule 5-minute reminders before time blocks
2. **Data Export**: Export tasks and notes
3. **Settings**: User preferences and location settings
4. **Offline Support**: Work without internet connection

## 🌐 Local Development

### **Web Version (localhost:3000)**
- Perfect for testing UI and components
- Fast development with Vite hot reload
- Test RTL layout and Arabic text

### **Desktop Version (Electron)**
- Full desktop app experience
- Access to system notifications
- Local file storage

## 📝 Comments in Code

Every file contains detailed comments explaining:
- **Purpose**: What the file/component does
- **Connections**: How it connects to other parts
- **Dependencies**: What it depends on
- **TODO**: What needs to be implemented next

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes with detailed comments
4. Test on both web (localhost:3000) and desktop versions
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

## 👨‍💻 Author

HaithamAlduais - [GitHub](https://github.com/HaithamAlduais)

---

**صلواتي** - Your Islamic day cycle companion

*Built with React + Electron for cross-platform desktop experience* 