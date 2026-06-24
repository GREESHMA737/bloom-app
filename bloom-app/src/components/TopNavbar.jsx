import React, { useState } from 'react';
import { 
  Sun, 
  Moon, 
  Search, 
  Menu, 
  Palette,
  Smile,
  X,
  Flower2,
  LogIn,
  LogOut,
  User,
  Cloud,
  CloudOff,
  Settings
} from 'lucide-react';
import { useBloom } from '../context/BloomContext';
import { supabase } from '../utils/supabaseClient';

const THEMES = [
  { id: 'theme-lavender', name: 'Lavender Dream', color: 'bg-indigo-300 dark:bg-indigo-500' },
  { id: 'theme-sakura', name: 'Sakura Blush', color: 'bg-pink-300 dark:bg-pink-500' },
  { id: 'theme-mint', name: 'Mint Meadow', color: 'bg-emerald-300 dark:bg-emerald-500' },
  { id: 'theme-aurora', name: 'Aurora Sky', color: 'bg-sky-300 dark:bg-sky-500' },
  { id: 'theme-sunset', name: 'Sunset Warmth', color: 'bg-orange-300 dark:bg-orange-500' },
];

const MOODS = [
  { id: 'happy', emoji: '😊', label: 'Happy' },
  { id: 'calm', emoji: '😌', label: 'Calm' },
  { id: 'tired', emoji: '🥱', label: 'Tired' },
  { id: 'anxious', emoji: '🥺', label: 'Anxious' },
  { id: 'excited', emoji: '🥳', label: 'Excited' },
  { id: 'sad', emoji: '😢', label: 'Sad' },
];

export default function TopNavbar({ onMenuToggle, activeView, mobileMenuOpen, setMobileMenuOpen, setActiveView, authModalOpen, setAuthModalOpen }) {
  const { 
    isDarkMode, 
    setIsDarkMode, 
    activeTheme, 
    setActiveTheme, 
    searchQuery, 
    setSearchQuery,
    journals,
    addJournalEntry,
    authUser,
    isSupabaseConfigured
  } = useBloom();

  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  const [moodDropdownOpen, setMoodDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Get current mood from the latest journal entry, or default to happy
  const latestMood = journals[0]?.mood || 'happy';
  const currentMoodObj = MOODS.find(m => m.id === latestMood) || MOODS[0];

  const handleMoodSelect = (moodId) => {
    // Save to today's entry in context
    const todayStr = new Date().toISOString().split('T')[0];
    const todayEntry = journals.find(j => j.date === todayStr);
    
    addJournalEntry(
      todayStr, 
      todayEntry?.title || "Daily Check-in", 
      todayEntry?.content || "Checking in and documenting my vibe.", 
      moodId, 
      todayEntry?.goodThing || "Shared how I was feeling today."
    );
    setMoodDropdownOpen(false);
  };

  const getPageTitle = () => {
    switch (activeView) {
      case 'dashboard': return 'Hey Sweetie ✨';
      case 'todo': return 'To-Do Garden 🌱';
      case 'notes': return 'Notes Hub 📝';
      case 'journal': return 'Journal Diary 📖';
      case 'bucket': return 'Bucket List 🌟';
      case 'capsule': return 'Time Capsule ⏳';
      case 'thoughts': return 'Dump Thoughts 💭';
      case 'memory': return 'Memory Wall 📸';
      case 'letters': return 'Letters to Future Me 💌';
      case 'gratitude': return 'Gratitude Jar 🫙✨';
      default: return 'Bloom';
    }
  };

  return (
    <header className="glass-panel sticky top-0 z-20 w-full h-16 border-b border-white/20 dark:border-white/5 flex items-center justify-between px-4 md:px-6 transition-all duration-300">
      {/* Left side: Hamburger (mobile) + Page Title */}
      <div className="flex items-center gap-3">
        <button 
          onClick={onMenuToggle}
          className="p-2 -ml-2 rounded-lg hover:bg-white/20 dark:hover:bg-white/10 text-theme-primary md:hidden transition-colors"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <h1 className="text-xl font-bold bg-gradient-to-r from-theme-primary to-theme-text-secondary bg-clip-text text-transparent">
          {getPageTitle()}
        </h1>
      </div>

      {/* Center: Search input */}
      <div className="hidden sm:flex relative items-center w-64 md:w-80">
        <span className="absolute left-3 text-gray-400 dark:text-gray-500">
          <Search size={16} />
        </span>
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search memories, notes, garden..." 
          className="w-full pl-9 pr-4 py-1.5 rounded-full bg-white/30 dark:bg-black/20 border border-white/40 dark:border-white/5 focus:outline-none focus:border-theme-primary focus:ring-1 focus:ring-theme-primary/30 text-sm placeholder-gray-400 dark:placeholder-gray-500 transition-all"
        />
      </div>

      {/* Right side: Mood + Theme Palette + Dark Mode */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Mood Selector Dropdown */}
        <div className="relative">
          <button 
            onClick={() => {
              setMoodDropdownOpen(!moodDropdownOpen);
              setThemeDropdownOpen(false);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold glass-card bg-white/40 dark:bg-white/5 border border-white/60 dark:border-white/10 hover:border-theme-primary transition-all duration-300"
          >
            <span>{currentMoodObj.emoji}</span>
            <span className="hidden md:inline text-gray-700 dark:text-gray-200">Mood: {currentMoodObj.label}</span>
          </button>
          
          {moodDropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 rounded-2xl glass-card bg-white/95 dark:bg-gray-900/95 border border-white/20 shadow-lg p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500 px-2.5 py-1">How are you feeling?</div>
              {MOODS.map(m => (
                <button
                  key={m.id}
                  onClick={() => handleMoodSelect(m.id)}
                  className="w-full flex items-center gap-2 px-2.5 py-2 text-left text-xs font-semibold rounded-xl hover:bg-theme-primary/10 dark:hover:bg-theme-primary/20 text-gray-700 dark:text-gray-200 transition-colors"
                >
                  <span className="text-base">{m.emoji}</span>
                  <span>{m.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Theme Picker Dropdown */}
        <div className="relative">
          <button 
            onClick={() => {
              setThemeDropdownOpen(!themeDropdownOpen);
              setMoodDropdownOpen(false);
            }}
            className="p-2 rounded-full glass-card hover:border-theme-primary text-theme-primary transition-all duration-300"
            title="Choose Aesthetic Theme"
          >
            <Palette size={18} />
          </button>
          
          {themeDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-2xl glass-card bg-white/95 dark:bg-gray-900/95 border border-white/20 shadow-lg p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500 px-2.5 py-1.5 border-b border-gray-100 dark:border-gray-800">Aesthetic Palette</div>
              <div className="py-1 space-y-0.5">
                {THEMES.map(theme => (
                  <button
                    key={theme.id}
                    onClick={() => {
                      setActiveTheme(theme.id);
                      setThemeDropdownOpen(false);
                    }}
                    className={`w-full flex items-center gap-2.5 px-2.5 py-2 text-left text-xs font-semibold rounded-xl hover:bg-theme-primary/10 dark:hover:bg-theme-primary/20 text-gray-700 dark:text-gray-200 transition-colors ${activeTheme === theme.id ? 'bg-theme-primary/10 text-theme-primary font-bold' : ''}`}
                  >
                    <span className={`w-3 h-3 rounded-full ${theme.color} shrink-0`} />
                    <span>{theme.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Dark Mode Toggle */}
        <button 
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="p-2 rounded-full glass-card hover:border-theme-primary text-theme-primary transition-all duration-300"
          title={isDarkMode ? "Toggle Light Mode" : "Toggle Dark Mode"}
        >
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Supabase Database Connection / Profile Menu */}
        <div className="relative">
          {!isSupabaseConfigured ? (
            <button
              onClick={() => setAuthModalOpen(true)}
              className="p-2 rounded-full glass-card hover:border-red-500/50 text-red-500 dark:text-red-400 flex items-center gap-1"
              title="Supabase Disconnected (Click to Connect)"
            >
              <CloudOff size={18} />
              <span className="text-[10px] font-bold hidden lg:inline">Offline</span>
            </button>
          ) : !authUser ? (
            <button
              onClick={() => setAuthModalOpen(true)}
              className="p-2 px-3 rounded-full glass-card hover:border-theme-primary text-theme-primary flex items-center gap-1.5"
              title="Sign In to Cloud Vault"
            >
              <LogIn size={15} />
              <span className="text-[10px] font-bold">Sign In</span>
            </button>
          ) : (
            <>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold glass-card bg-white/40 dark:bg-white/5 border border-white/60 dark:border-white/10 hover:border-theme-primary transition-all duration-300"
                title={authUser.email}
              >
                <div className="w-5 h-5 rounded-full bg-theme-primary/10 text-theme-primary flex items-center justify-center font-bold text-[10px]">
                  {authUser.email.substring(0, 2).toUpperCase()}
                </div>
                <span className="hidden md:inline text-gray-700 dark:text-gray-200 truncate max-w-[80px]">
                  {authUser.email.split('@')[0]}
                </span>
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-2xl glass-card bg-white/95 dark:bg-gray-900/95 border border-white/20 shadow-lg p-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-200 space-y-2">
                  <div className="px-2 border-b border-black/5 dark:border-white/5 pb-2">
                    <div className="text-[10px] uppercase font-bold text-gray-400">Account</div>
                    <div className="text-xs font-bold text-gray-700 dark:text-gray-200 truncate mt-0.5">{authUser.email}</div>
                    <div className="text-[9px] text-green-500 font-bold flex items-center gap-0.5 mt-0.5">
                      <Cloud size={10} /> Cloud Sync Active
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <button
                      onClick={() => {
                        setAuthModalOpen(true);
                        setUserDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-2 py-1.5 text-left text-xs font-bold rounded-xl hover:bg-black/5 dark:hover:bg-white/5 text-gray-600 dark:text-gray-300 transition-colors"
                    >
                      <Settings size={13} /> Settings
                    </button>

                    <button
                      onClick={async () => {
                        setUserDropdownOpen(false);
                        if (supabase) await supabase.auth.signOut();
                      }}
                      className="w-full flex items-center gap-2 px-2 py-1.5 text-left text-xs font-bold rounded-xl hover:bg-red-500/10 text-red-500 transition-colors"
                    >
                      <LogOut size={13} /> Log Out
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu Drawer Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/30 dark:bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div 
            className="w-64 max-w-[80vw] h-full glass-card bg-white/95 dark:bg-gray-950/95 border-r border-white/20 dark:border-white/5 flex flex-col p-4 z-50 animate-in slide-in-from-left duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <Flower2 size={24} className="text-pink-500 animate-spin-slow" />
                <span className="text-xl font-bold bg-gradient-to-r from-pink-500 to-indigo-500 bg-clip-text text-transparent">Bloom</span>
              </div>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500"
              >
                <X size={18} />
              </button>
            </div>

            <nav className="flex-1 py-4 space-y-1 overflow-y-auto">
              {[
                { id: 'dashboard', label: 'Dashboard', emoji: '🏠' },
                { id: 'todo', label: 'To-Do Garden', emoji: '🌱' },
                { id: 'notes', label: 'Notes Hub', emoji: '📝' },
                { id: 'journal', label: 'Journal Diary', emoji: '📖' },
                { id: 'bucket', label: 'Bucket List', emoji: '🌟' },
                { id: 'capsule', label: 'Time Capsule', emoji: '⏳' },
                { id: 'thoughts', label: 'Dump Thoughts', emoji: '💭' },
                { id: 'memory', label: 'Memory Wall', emoji: '📸' },
                { id: 'letters', label: 'Letters to Me', emoji: '💌' },
                { id: 'gratitude', label: 'Gratitude Jar', emoji: '🫙' },
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveView(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold transition-colors ${activeView === item.id ? 'bg-theme-primary/10 text-theme-primary font-bold' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'}`}
                >
                  <span className="text-base">{item.emoji}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>

            <div className="p-3 border-t border-gray-100 dark:border-gray-800 text-center text-xs text-gray-400">
              Bloom 🌸 – Version 1.0
            </div>
          </div>
        </div>
      )}
      
    </header>
  );
}
