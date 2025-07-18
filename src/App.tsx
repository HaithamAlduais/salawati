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
  const [selectedFilters, setSelectedFilters] = useState<TaskFilterType[]>([]);
  const { prayerTimes, loading } = usePrayerTimes();
  const { currentDayLabel, currentTime } = useDayCycle();

  return (
    <div className="app">
      <Header 
        currentTime={currentTime}
        dayLabel={currentDayLabel}
      />
      
      <div className="main-content">
        <TaskFilter 
          selectedFilters={selectedFilters}
          onFilterChange={setSelectedFilters}
        />
        
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