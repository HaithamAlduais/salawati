import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { Settings, Bell, Sun, Moon } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';
import { formatArabicDate } from '../lib/utils';

interface HeaderProps {
  currentTime: Date;
  dayLabel: string;
}

const Header: React.FC<HeaderProps> = ({ currentTime, dayLabel }) => {
  const { toggleSettings, settings } = useAppContext();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isNightTime = currentTime.getHours() >= 18 || currentTime.getHours() <= 6;

  if (!mounted) return null;

  return (
    <motion.header 
      className="relative overflow-hidden"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-green-600/10" />
      <div className="absolute inset-0 backdrop-blur-xl bg-black/40" />
      
      <div className="relative p-6">
        <div className="flex justify-between items-center">
          {/* Left side - Time and Date */}
          <div className="flex items-center gap-6">
            {/* Current Time */}
            <motion.div 
              className="flex items-center gap-3"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="p-3 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-xl border border-white/10">
                {isNightTime ? (
                  <Moon className="w-6 h-6 text-blue-400" />
                ) : (
                  <Sun className="w-6 h-6 text-amber-400" />
                )}
              </div>
              <div>
                <div className="text-3xl font-bold text-gradient font-mono tracking-wider">
                  {format(currentTime, 'HH:mm:ss')}
                </div>
                <div className="text-sm text-gray-400 font-medium">
                  الوقت الحالي
                </div>
              </div>
            </motion.div>
            
            {/* Date */}
            <motion.div 
              className="hidden md:block"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="text-lg text-white font-medium">
                {formatArabicDate(currentTime)}
              </div>
              <div className="text-sm text-gray-400">
                {format(currentTime, 'yyyy/MM/dd')}
              </div>
            </motion.div>
          </div>
          
          {/* Center - Islamic Day Label */}
          <motion.div 
            className="flex-1 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full border border-white/10">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
              <div className="text-xl font-bold text-gradient">
                {dayLabel}
              </div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
            </div>
          </motion.div>
          
          {/* Right side - Actions */}
          <motion.div 
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {/* Notifications indicator */}
            {settings?.notificationsEnabled && (
              <motion.div
                className="p-2 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-lg border border-green-500/20"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Bell className="w-5 h-5 text-green-400" />
              </motion.div>
            )}
            
            {/* Settings button */}
            <motion.button
              onClick={() => toggleSettings(true)}
              className="p-3 bg-gradient-to-r from-gray-600/20 to-gray-700/20 rounded-xl border border-white/10 hover:border-white/20 transition-all hover-lift"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Settings className="w-5 h-5 text-gray-300 hover:text-white transition-colors" />
            </motion.button>
          </motion.div>
        </div>
        
        {/* Bottom decorative line */}
        <motion.div 
          className="mt-6 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        />
      </div>
    </motion.header>
  );
};

export default Header; 