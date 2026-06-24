import React from 'react';
import { motion } from 'framer-motion';
import { 
  Flower2, 
  LayoutDashboard, 
  CheckSquare, 
  FileText, 
  BookOpen, 
  Sparkles, 
  Hourglass, 
  BrainCircuit, 
  Image as ImageIcon, 
  Mail,
  Heart,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useBloom } from '../context/BloomContext';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'todo', label: 'To-Do Garden', icon: CheckSquare, suffix: '🌱' },
  { id: 'notes', label: 'Notes Hub', icon: FileText, suffix: '📝' },
  { id: 'journal', label: 'Journal Diary', icon: BookOpen, suffix: '📖' },
  { id: 'bucket', label: 'Bucket List', icon: Sparkles, suffix: '🌟' },
  { id: 'capsule', label: 'Time Capsule', icon: Hourglass, suffix: '⏳' },
  { id: 'thoughts', label: 'Dump Thoughts', icon: BrainCircuit, suffix: '💭' },
  { id: 'memory', label: 'Memory Wall', icon: ImageIcon, suffix: '📸' },
  { id: 'letters', label: 'Letters to Me', icon: Mail, suffix: '💌' },
  { id: 'gratitude', label: 'Gratitude Jar', icon: Heart, suffix: '🫙' },
];

export default function Sidebar({ activeView, setActiveView, sidebarOpen, setSidebarOpen }) {
  const { isDarkMode, streak } = useBloom();

  return (
    <motion.div 
      className={`glass-panel border-r shrink-0 hidden md:flex flex-col h-screen sticky top-0 z-30 transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'}`}
      animate={{ width: sidebarOpen ? 256 : 80 }}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-5 border-b border-white/20 dark:border-white/5 h-16">
        <div className="flex items-center gap-3 overflow-hidden">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="text-pink-500 text-glow"
          >
            <Flower2 size={28} />
          </motion.div>
          {sidebarOpen && (
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-2xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent"
            >
              Bloom
            </motion.span>
          )}
        </div>
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1 rounded-lg hover:bg-white/20 dark:hover:bg-white/10 text-theme-primary transition-colors"
        >
          {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className="w-full relative flex items-center gap-3 px-3 py-3 rounded-xl transition-all group overflow-hidden"
            >
              {/* Active Indicator Background */}
              {isActive && (
                <motion.div 
                  layoutId="activeIndicator"
                  className="absolute inset-0 bg-gradient-to-r from-purple-500/15 via-pink-500/10 to-transparent border-l-4 border-theme-primary"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}

              <Icon 
                size={22} 
                className={`transition-colors relative z-10 shrink-0 ${
                  isActive ? 'text-theme-primary' : 'text-gray-400 dark:text-gray-500 group-hover:text-theme-primary'
                }`} 
              />
              
              {sidebarOpen && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`text-sm font-medium relative z-10 ${
                    isActive ? 'font-semibold text-theme-primary' : 'text-gray-600 dark:text-gray-300 group-hover:text-theme-primary'
                  }`}
                >
                  {item.label} {item.suffix && <span className="text-xs ml-0.5">{item.suffix}</span>}
                </motion.span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Streak Badge Footer */}
      {sidebarOpen && (
        <div className="p-4 border-t border-white/20 dark:border-white/5 text-center">
          <div className="glass-card flex items-center justify-center gap-2 py-2 px-3 rounded-2xl">
            <span className="text-lg">🔥</span>
            <div className="text-left leading-none">
              <div className="text-xs font-bold text-gray-500 dark:text-gray-400">STREAK</div>
              <div className="text-sm font-black text-theme-primary">{streak} Days Growing</div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
