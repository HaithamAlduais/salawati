import { useState, useEffect } from 'react';
import { PrayerTimes } from '../types';

export const usePrayerTimes = () => {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrayerTimes = async () => {
      try {
        setLoading(true);
        
        // For now, we'll use mock data
        // In the full implementation, this would fetch from a prayer times API
        const mockPrayerTimes: PrayerTimes = {
          fajr: new Date(new Date().setHours(5, 30, 0, 0)),
          dhuhr: new Date(new Date().setHours(12, 30, 0, 0)),
          asr: new Date(new Date().setHours(15, 45, 0, 0)),
          maghrib: new Date(new Date().setHours(18, 15, 0, 0)),
          isha: new Date(new Date().setHours(19, 45, 0, 0)),
          qiyam: new Date(new Date().setHours(2, 30, 0, 0))
        };

        setPrayerTimes(mockPrayerTimes);
        setError(null);
      } catch (err) {
        setError('فشل في تحميل أوقات الصلاة');
        console.error('Error fetching prayer times:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrayerTimes();
  }, []);

  return { prayerTimes, loading, error };
}; 