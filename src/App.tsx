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
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import Header from './components/Header';
import TimeBlockGrid from './components/TimeBlockGrid';
import TaskFilter from './components/TaskFilter';
import { usePrayerTimes } from './hooks/usePrayerTimes';
import { useDayCycle } from './hooks/useDayCycle';
import { TaskFilterType } from './types';

function App() {
  // Global state for task filtering
  const [selectedFilters, setSelectedFilters] = useState<TaskFilterType[]>([]);
  
  // Custom hooks for data management
  const { prayerTimes, loading } = usePrayerTimes(); // Fetches prayer times
  const { currentDayLabel, currentTime } = useDayCycle(); // Calculates Islamic day cycle

  return (
    <div className="app">
      {/* Header shows clock, date, and dynamic Islamic day label */}
      <Header 
        currentTime={currentTime}
        dayLabel={currentDayLabel}
      />
      
      <div className="main-content">
        {/* Task filter for showing tasks by day type */}
        <TaskFilter 
          selectedFilters={selectedFilters}
          onFilterChange={setSelectedFilters}
        />
        
        {/* Main grid showing 24-hour cycle of time blocks */}
        <TimeBlockGrid 
          prayerTimes={prayerTimes}
          loading={loading}
          selectedFilters={selectedFilters}
        />
      </div>
    </div>
  );
}

export default App; 