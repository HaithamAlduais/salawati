/**
 * Main App Component - Islamic Day Cycle Routine Management
 * 
 * This is the root component that orchestrates the entire application.
 * It connects all major components and manages the global state.
 * 
 * CONNECTIONS:
 * - Header: Displays clock, date, and dynamic Islamic day label
 * - TaskFilter: Manages task filtering by day type (normal/fasting/holiday)
 * - TimeBlockGrid: Shows the 24-hour cycle of time blocks
 * - usePrayerTimes: Fetches prayer times from API (currently mock data)
 * - useDayCycle: Calculates Islamic day cycle (Maghrib to Maghrib)
 * 
 * DATA FLOW:
 * 1. usePrayerTimes → TimeBlockGrid (prayer times for time blocks)
 * 2. useDayCycle → Header (current time and day label)
 * 3. TaskFilter → TimeBlockGrid (filtered tasks display)
 * 
 * TODO: Implement Electron Store for data persistence
 */
import React from 'react';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import TimeBlockGrid from './components/TimeBlockGrid';
import TaskFilter from './components/TaskFilter';
import Settings from './components/Settings';
import { AppProvider, useAppContext } from './contexts/AppContext';
import { usePrayerTimes } from './hooks/usePrayerTimes';
import { useDayCycle } from './hooks/useDayCycle';

// Inner App component that uses the context
const AppContent: React.FC = () => {
  const { selectedFilters, setFilters, isSettingsOpen, toggleSettings } = useAppContext();
  const { prayerTimes, loading } = usePrayerTimes();
  const { currentDayLabel, currentTime } = useDayCycle();

  return (
    <div className="app">
      {/* Header with modern design */}
      <Header 
        currentTime={currentTime}
        dayLabel={currentDayLabel}
      />
      
      <div className="main-content">
        {/* Task filter component */}
        <TaskFilter 
          selectedFilters={selectedFilters}
          onFilterChange={setFilters}
        />
        
        {/* Main grid showing prayer time blocks */}
        <TimeBlockGrid 
          prayerTimes={prayerTimes}
          loading={loading}
          selectedFilters={selectedFilters}
        />
      </div>

      {/* Settings Modal */}
      <Settings 
        isOpen={isSettingsOpen}
        onClose={() => toggleSettings(false)}
      />

      {/* Toast notifications */}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: 'rgba(20, 20, 24, 0.9)',
            color: '#ffffff',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            borderRadius: '12px',
            fontSize: '14px'
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#ffffff'
            }
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#ffffff'
            }
          }
        }}
      />
    </div>
  );
};

// Main App component with provider
function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App; 