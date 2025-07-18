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
  prayerType?: PrayerType;
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  isSubTask: boolean;
  parentId?: string;
  filters: TaskFilterType[];
  order: number;
  blockId: string;
  reminderEnabled?: boolean;
  reminderTime?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  blockId: string;
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

export interface Settings {
  id: string;
  userId: string;
  notificationsEnabled: boolean;
  location: {
    latitude: number;
    longitude: number;
    city: string;
    country: string;
  };
  calculationMethod: 'MWL' | 'ISNA' | 'Egypt' | 'Makkah' | 'Karachi' | 'Tehran' | 'Jafari';
  madhab: 'Shafi' | 'Hanafi';
  adjustments: {
    fajr: number;
    dhuhr: number;
    asr: number;
    maghrib: number;
    isha: number;
  };
  theme: 'dark' | 'light' | 'auto';
  language: 'ar' | 'en';
  createdAt: Date;
  updatedAt: Date;
}

export type PrayerType = 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha' | 'qiyam';

export interface NotificationSettings {
  id: string;
  taskId: string;
  enabled: boolean;
  time: Date;
  type: 'before' | 'at' | 'after';
  offsetMinutes: number;
  createdAt: Date;
}

export interface DatabaseTask {
  id: string;
  title: string;
  completed: boolean;
  is_sub_task: boolean;
  parent_id?: string;
  filters: TaskFilterType[];
  order_index: number;
  block_id: string;
  reminder_enabled: boolean;
  reminder_time?: string;
  created_at: string;
  updated_at: string;
}

export interface DatabaseNote {
  id: string;
  title: string;
  content: string;
  block_id: string;
  created_at: string;
  updated_at: string;
}

export interface TaskOperation {
  type: 'create' | 'update' | 'delete' | 'toggle';
  task: Partial<Task>;
  blockId?: string;
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
  settings: string;
  notifications: string;
  enableNotifications: string;
  addTask: string;
  editTask: string;
  deleteTask: string;
  taskCompleted: string;
  setReminder: string;
  qiyamTime: string;
  fajr: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  qiyam: string;
  save: string;
  cancel: string;
  delete: string;
  edit: string;
  add: string;
  close: string;
  confirm: string;
  loading: string;
  error: string;
  success: string;
  noTasks: string;
  noTasksForFilter: string;
  addNewTask: string;
  taskTitle: string;
  taskFilters: string;
  reminderTime: string;
  general: string;
  location: string;
  calculation: string;
  adjustments: string;
  theme: string;
  language: string;
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
  holiday: "إجازة",
  settings: "الإعدادات",
  notifications: "الإشعارات",
  enableNotifications: "تفعيل الإشعارات",
  addTask: "إضافة مهمة",
  editTask: "تعديل المهمة",
  deleteTask: "حذف المهمة",
  taskCompleted: "المهمة مكتملة",
  setReminder: "تعيين تذكير",
  qiyamTime: "وقت قيام الليل",
  fajr: "فجر",
  dhuhr: "ظهر",
  asr: "عصر",
  maghrib: "مغرب",
  isha: "عشاء",
  qiyam: "قيام الليل",
  save: "حفظ",
  cancel: "إلغاء",
  delete: "حذف",
  edit: "تعديل",
  add: "إضافة",
  close: "إغلاق",
  confirm: "تأكيد",
  loading: "جاري التحميل...",
  error: "خطأ",
  success: "نجح",
  noTasks: "لا توجد مهام بعد",
  noTasksForFilter: "لا توجد مهام تطابق الفلتر المحدد",
  addNewTask: "إضافة مهمة جديدة",
  taskTitle: "عنوان المهمة",
  taskFilters: "فلاتر المهمة",
  reminderTime: "وقت التذكير",
  general: "عام",
  location: "الموقع",
  calculation: "طريقة الحساب",
  adjustments: "التعديلات",
  theme: "المظهر",
  language: "اللغة"
}; 