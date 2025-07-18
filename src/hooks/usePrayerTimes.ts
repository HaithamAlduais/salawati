import { useState, useEffect } from 'react';
import { PrayerTimes } from '../types';
import { calculateQiyamTime } from '../lib/utils';

export const usePrayerTimes = () => {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrayerTimes = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get user's location for accurate prayer times
        const position = await getCurrentPosition();
        const { latitude, longitude } = position.coords;
        
        // Fetch from prayer times API
        const prayerTimesData = await fetchPrayerTimesFromAPI(latitude, longitude);
        
        // Calculate Qiyam al-Layl time
        const qiyamTime = calculateQiyamTime(prayerTimesData.maghrib, prayerTimesData.fajr);
        
        const finalPrayerTimes: PrayerTimes = {
          ...prayerTimesData,
          qiyam: qiyamTime
        };

        setPrayerTimes(finalPrayerTimes);
      } catch (err) {
        console.error('Error fetching prayer times:', err);
        setError('فشل في تحميل أوقات الصلاة');
        
        // Fallback to mock data if API fails
        const fallbackPrayerTimes = generateMockPrayerTimes();
        setPrayerTimes(fallbackPrayerTimes);
      } finally {
        setLoading(false);
      }
    };

    fetchPrayerTimes();
  }, []);

  return { prayerTimes, loading, error };
};

// Helper function to get user's current position
function getCurrentPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      resolve,
      (error) => {
        console.warn('Geolocation error:', error);
        // Fallback to a default location (Mecca)
        resolve({
          coords: {
            latitude: 21.4225,
            longitude: 39.8262,
            accuracy: 0,
            altitude: null,
            altitudeAccuracy: null,
            heading: null,
            speed: null
          },
          timestamp: Date.now()
        } as GeolocationPosition);
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 60 * 60 * 1000 // 1 hour
      }
    );
  });
}

// Function to fetch prayer times from an API
async function fetchPrayerTimesFromAPI(latitude: number, longitude: number): Promise<Omit<PrayerTimes, 'qiyam'>> {
  const today = new Date();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  
  try {
    // Using Al-Adhan API for prayer times
    const response = await fetch(
      `https://api.aladhan.com/v1/calendar/${year}/${month}?latitude=${latitude}&longitude=${longitude}&method=4&school=1`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    const todayData = data.data.find((day: any) => {
      const dayDate = new Date(day.date.gregorian.date);
      return dayDate.toDateString() === today.toDateString();
    });
    
    if (!todayData) {
      throw new Error('No prayer times found for today');
    }
    
    const timings = todayData.timings;
    
    return {
      fajr: parseTimeString(timings.Fajr),
      dhuhr: parseTimeString(timings.Dhuhr),
      asr: parseTimeString(timings.Asr),
      maghrib: parseTimeString(timings.Maghrib),
      isha: parseTimeString(timings.Isha)
    };
  } catch (error) {
    console.error('API fetch failed:', error);
    throw error;
  }
}

// Helper function to parse time string to Date object
function parseTimeString(timeString: string): Date {
  const today = new Date();
  const [time, timezone] = timeString.split(' ');
  const [hours, minutes] = time.split(':').map(Number);
  
  const date = new Date(today);
  date.setHours(hours, minutes, 0, 0);
  
  return date;
}

// Fallback mock data with realistic times
function generateMockPrayerTimes(): PrayerTimes {
  const today = new Date();
  
  const fajr = new Date(today);
  fajr.setHours(5, 30, 0, 0);
  
  const dhuhr = new Date(today);
  dhuhr.setHours(12, 30, 0, 0);
  
  const asr = new Date(today);
  asr.setHours(15, 45, 0, 0);
  
  const maghrib = new Date(today);
  maghrib.setHours(18, 15, 0, 0);
  
  const isha = new Date(today);
  isha.setHours(19, 45, 0, 0);
  
  const qiyam = calculateQiyamTime(maghrib, fajr);
  
  return {
    fajr,
    dhuhr,
    asr,
    maghrib,
    isha,
    qiyam
  };
} 