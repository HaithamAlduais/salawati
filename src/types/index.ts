export type TaskFilterType = 'normalDay' | 'fastingDay' | 'holiday';

export interface PrayerTime {
  name: string;
  time: Date;
  arabicName: string;
}

export interface TimeBlock {
  id: string;
  type: 'prayer' | 'interstitial';
  startTime: Date;
  endTime: Date;
  title: string;
  symbol: '●' | '○';
  tasks: Task[];
  notes: Note[];
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  isSubTask: boolean;
  parentId?: string;
  filters: TaskFilterType[];
  order: number;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PrayerTimes {
  fajr: Date;
  dhuhr: Date;
  asr: Date;
  maghrib: Date;
  isha: Date;
  qiyam?: Date;
}

export interface DayCycle {
  currentDayLabel: string;
  currentTime: Date;
  isNight: boolean;
}

export interface Localization {
  dayLabelNight: string;
  prayerBlockTitle: string;
  interstitialBlockTitle: string;
  and: string;
  remainingTime: string;
  taskFilter: string;
  normalDay: string;
  fastingDay: string;
  holiday: string;
}

export const LOCALIZATION: Localization = {
  dayLabelNight: "ليلة ",
  prayerBlockTitle: "فترة صلاة ",
  interstitialBlockTitle: "فترة بين ",
  and: " و ",
  remainingTime: "المتبقي: ",
  taskFilter: "عرض مهام:",
  normalDay: "يوم عادي",
  fastingDay: "صيام",
  holiday: "إجازة"
}; 