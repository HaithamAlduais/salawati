import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Settings as SettingsIcon, Bell, BellOff, Save, MapPin, Clock, Palette, Globe } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';
import { LOCALIZATION } from '../types';
import { cn } from '../lib/utils';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

const Settings: React.FC<SettingsProps> = ({ isOpen, onClose }) => {
  const { settings, updateSettings } = useAppContext();
  const [activeTab, setActiveTab] = useState<'general' | 'notifications' | 'location' | 'calculation'>('general');
  const [localSettings, setLocalSettings] = useState(settings);

  if (!settings || !localSettings) return null;

  const handleSave = async () => {
    await updateSettings(localSettings);
    onClose();
  };

  const tabs = [
    { id: 'general' as const, label: LOCALIZATION.general, icon: SettingsIcon },
    { id: 'notifications' as const, label: LOCALIZATION.notifications, icon: Bell },
    { id: 'location' as const, label: LOCALIZATION.location, icon: MapPin },
    { id: 'calculation' as const, label: LOCALIZATION.calculation, icon: Clock }
  ];

  const calculationMethods = [
    { value: 'MWL', label: 'رابطة العالم الإسلامي' },
    { value: 'ISNA', label: 'الجمعية الإسلامية لأمريكا الشمالية' },
    { value: 'Egypt', label: 'الهيئة المصرية العامة للمساحة' },
    { value: 'Makkah', label: 'أم القرى - مكة المكرمة' },
    { value: 'Karachi', label: 'جامعة العلوم الإسلامية، كراتشي' },
    { value: 'Tehran', label: 'معهد الجيوفيزياء، جامعة طهران' },
    { value: 'Jafari', label: 'الفقه الجعفري' }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          {/* Settings Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative w-full max-w-4xl h-[80vh] mx-4 glass-card p-0 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                  <SettingsIcon className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gradient">{LOCALIZATION.settings}</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-all hover-lift"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex h-full">
              {/* Sidebar */}
              <div className="w-64 bg-black/20 border-r border-white/10 p-4">
                <nav className="space-y-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                          "w-full flex items-center gap-3 p-3 rounded-lg transition-all",
                          activeTab === tab.id
                            ? "bg-gradient-to-r from-blue-500/20 to-purple-600/20 border border-blue-500/30 text-white"
                            : "hover:bg-white/5 text-gray-300 hover:text-white"
                        )}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{tab.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Content */}
              <div className="flex-1 p-6 overflow-y-auto">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    {activeTab === 'general' && (
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-xl font-semibold mb-4 text-gradient">الإعدادات العامة</h3>
                          
                          <div className="space-y-4">
                            <div className="glass-card p-4">
                              <label className="block text-sm font-medium mb-2">المظهر</label>
                              <select
                                value={localSettings.theme}
                                onChange={(e) => setLocalSettings({
                                  ...localSettings,
                                  theme: e.target.value as 'dark' | 'light' | 'auto'
                                })}
                                className="input"
                              >
                                <option value="dark">داكن</option>
                                <option value="light">فاتح</option>
                                <option value="auto">تلقائي</option>
                              </select>
                            </div>

                            <div className="glass-card p-4">
                              <label className="block text-sm font-medium mb-2">اللغة</label>
                              <select
                                value={localSettings.language}
                                onChange={(e) => setLocalSettings({
                                  ...localSettings,
                                  language: e.target.value as 'ar' | 'en'
                                })}
                                className="input"
                              >
                                <option value="ar">العربية</option>
                                <option value="en">English</option>
                              </select>
                            </div>

                            <div className="glass-card p-4">
                              <label className="block text-sm font-medium mb-2">المذهب الفقهي</label>
                              <select
                                value={localSettings.madhab}
                                onChange={(e) => setLocalSettings({
                                  ...localSettings,
                                  madhab: e.target.value as 'Shafi' | 'Hanafi'
                                })}
                                className="input"
                              >
                                <option value="Shafi">الشافعي</option>
                                <option value="Hanafi">الحنفي</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'notifications' && (
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-xl font-semibold mb-4 text-gradient">إعدادات الإشعارات</h3>
                          
                          <div className="space-y-4">
                            <div className="glass-card p-6">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  {localSettings.notificationsEnabled ? (
                                    <Bell className="w-6 h-6 text-blue-400" />
                                  ) : (
                                    <BellOff className="w-6 h-6 text-gray-400" />
                                  )}
                                  <div>
                                    <h4 className="font-semibold">تفعيل جميع الإشعارات</h4>
                                    <p className="text-sm text-gray-400">
                                      سيتم إرسال إشعارات للمهام والتذكيرات
                                    </p>
                                  </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={localSettings.notificationsEnabled}
                                    onChange={(e) => setLocalSettings({
                                      ...localSettings,
                                      notificationsEnabled: e.target.checked
                                    })}
                                    className="sr-only peer"
                                  />
                                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-purple-600"></div>
                                </label>
                              </div>
                            </div>

                            {localSettings.notificationsEnabled && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="glass-card p-4"
                              >
                                <h5 className="font-medium mb-3">خيارات الإشعارات</h5>
                                <div className="space-y-3 text-sm">
                                  <div className="flex items-center justify-between">
                                    <span>إشعارات أوقات الصلاة</span>
                                    <input type="checkbox" defaultChecked className="checkbox" />
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <span>تذكيرات المهام</span>
                                    <input type="checkbox" defaultChecked className="checkbox" />
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <span>تذكير قيام الليل</span>
                                    <input type="checkbox" defaultChecked className="checkbox" />
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'location' && (
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-xl font-semibold mb-4 text-gradient">إعدادات الموقع</h3>
                          
                          <div className="space-y-4">
                            <div className="glass-card p-4">
                              <label className="block text-sm font-medium mb-2">المدينة</label>
                              <input
                                type="text"
                                value={localSettings.location.city}
                                onChange={(e) => setLocalSettings({
                                  ...localSettings,
                                  location: { ...localSettings.location, city: e.target.value }
                                })}
                                className="input"
                                placeholder="اسم المدينة"
                              />
                            </div>

                            <div className="glass-card p-4">
                              <label className="block text-sm font-medium mb-2">الدولة</label>
                              <input
                                type="text"
                                value={localSettings.location.country}
                                onChange={(e) => setLocalSettings({
                                  ...localSettings,
                                  location: { ...localSettings.location, country: e.target.value }
                                })}
                                className="input"
                                placeholder="اسم الدولة"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div className="glass-card p-4">
                                <label className="block text-sm font-medium mb-2">خط العرض</label>
                                <input
                                  type="number"
                                  step="0.000001"
                                  value={localSettings.location.latitude}
                                  onChange={(e) => setLocalSettings({
                                    ...localSettings,
                                    location: { ...localSettings.location, latitude: parseFloat(e.target.value) }
                                  })}
                                  className="input"
                                />
                              </div>

                              <div className="glass-card p-4">
                                <label className="block text-sm font-medium mb-2">خط الطول</label>
                                <input
                                  type="number"
                                  step="0.000001"
                                  value={localSettings.location.longitude}
                                  onChange={(e) => setLocalSettings({
                                    ...localSettings,
                                    location: { ...localSettings.location, longitude: parseFloat(e.target.value) }
                                  })}
                                  className="input"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'calculation' && (
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-xl font-semibold mb-4 text-gradient">طريقة حساب أوقات الصلاة</h3>
                          
                          <div className="space-y-4">
                            <div className="glass-card p-4">
                              <label className="block text-sm font-medium mb-2">طريقة الحساب</label>
                              <select
                                value={localSettings.calculationMethod}
                                onChange={(e) => setLocalSettings({
                                  ...localSettings,
                                  calculationMethod: e.target.value as any
                                })}
                                className="input"
                              >
                                {calculationMethods.map((method) => (
                                  <option key={method.value} value={method.value}>
                                    {method.label}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div>
                              <h4 className="font-medium mb-3">تعديلات الأوقات (بالدقائق)</h4>
                              <div className="grid grid-cols-2 gap-4">
                                {Object.entries(localSettings.adjustments).map(([prayer, value]) => (
                                  <div key={prayer} className="glass-card p-4">
                                    <label className="block text-sm font-medium mb-2">
                                      {LOCALIZATION[prayer as keyof typeof LOCALIZATION] || prayer}
                                    </label>
                                    <input
                                      type="number"
                                      value={value}
                                      onChange={(e) => setLocalSettings({
                                        ...localSettings,
                                        adjustments: {
                                          ...localSettings.adjustments,
                                          [prayer]: parseInt(e.target.value) || 0
                                        }
                                      })}
                                      className="input"
                                      min="-60"
                                      max="60"
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-white/10">
              <button
                onClick={onClose}
                className="btn btn-ghost"
              >
                {LOCALIZATION.cancel}
              </button>
              <button
                onClick={handleSave}
                className="btn btn-primary"
              >
                <Save className="w-4 h-4" />
                {LOCALIZATION.save}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Settings;