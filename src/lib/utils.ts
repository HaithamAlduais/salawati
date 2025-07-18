import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString('ar-SA', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
}

export function formatArabicDate(date: Date): string {
  return date.toLocaleDateString('ar-SA', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function calculateQiyamTime(maghribTime: Date, fajrTime: Date): Date {
  // Calculate the last third of the night
  const maghribMs = maghribTime.getTime();
  const fajrMs = fajrTime.getTime();
  
  // Handle case where Fajr is on the next day
  const adjustedFajrMs = fajrMs < maghribMs ? fajrMs + 24 * 60 * 60 * 1000 : fajrMs;
  
  const nightDuration = adjustedFajrMs - maghribMs;
  const lastThirdStart = maghribMs + (nightDuration * 2) / 3;
  
  return new Date(lastThirdStart);
}

export function getPrayerColor(prayerName: string): string {
  const colors = {
    'فجر': 'var(--prayer-fajr)',
    'ظهر': 'var(--prayer-dhuhr)',
    'عصر': 'var(--prayer-asr)',
    'مغرب': 'var(--prayer-maghrib)',
    'عشاء': 'var(--prayer-isha)',
    'قيام الليل': 'var(--prayer-qiyam)'
  };
  
  return colors[prayerName as keyof typeof colors] || 'var(--accent-primary)';
}

export function generateTaskId(): string {
  return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function generateBlockId(): string {
  return `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}