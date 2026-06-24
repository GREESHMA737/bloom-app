import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Calendar, 
  Smile, 
  Trash2, 
  ChevronRight,
  Plus,
  Save,
  Clock
} from 'lucide-react';
import { useBloom } from '../../context/BloomContext';
import GlassCard from '../../components/GlassCard';

const MOODS = [
  { id: 'happy', emoji: '😊', label: 'Happy' },
  { id: 'calm', emoji: '😌', label: 'Calm' },
  { id: 'tired', emoji: '🥱', label: 'Tired' },
  { id: 'anxious', emoji: '🥺', label: 'Anxious' },
  { id: 'excited', emoji: '🥳', label: 'Excited' },
  { id: 'sad', emoji: '😢', label: 'Sad' },
];

export default function JournalDiary() {
  const { 
    journals, 
    addJournalEntry, 
    deleteJournalEntry 
  } = useBloom();

  const getTodayDateString = () => {
    return new Date().toISOString().split('T')[0];
  };

  const [date, setDate] = useState(getTodayDateString());
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('happy');
  const [goodThing, setGoodThing] = useState('');

  // Load existing entry when date changes
  useEffect(() => {
    const existing = journals.find(j => j.date === date);
    if (existing) {
      setTitle(existing.title);
      setContent(existing.content);
      setMood(existing.mood);
      setGoodThing(existing.goodThing || '');
    } else {
      // Clear for new entry
      setTitle('');
      setContent('');
      setMood('happy');
      setGoodThing('');
    }
  }, [date, journals]);

  const handleSave = (e) => {
    e.preventDefault();
    if (!title.trim() && !content.trim()) return;
    addJournalEntry(date, title, content, mood, goodThing);
  };

  const handleSelectPastEntry = (entry) => {
    setDate(entry.date);
  };

  const handleNewEntry = () => {
    setDate(getTodayDateString());
    setTitle('');
    setContent('');
    setMood('happy');
    setGoodThing('');
  };

  const getMoodEmoji = (moodId) => {
    return MOODS.find(m => m.id === moodId)?.emoji || '😊';
  };

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto overflow-y-auto h-[calc(100vh-4rem)] custom-scrollbar">
      
      {/* Notebook Binder Aesthetic Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Side Page (Span 4): Calendar, Mood, and History */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Quick Controls Card */}
          <GlassCard className="space-y-4">
            <h3 className="font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
              <Calendar size={18} className="text-blue-500" />
              <span>Diary Check-In</span>
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase mb-1.5">Select Date</label>
                <input 
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-white/40 dark:bg-black/20 border border-white/60 dark:border-white/10 focus:outline-none focus:border-theme-primary text-sm font-semibold transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase mb-2">Today's Vibe</label>
                <div className="grid grid-cols-3 gap-2">
                  {MOODS.map(m => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setMood(m.id)}
                      className={`py-2 px-1 rounded-xl border flex flex-col items-center justify-center transition-all ${
                        mood === m.id 
                          ? 'bg-theme-primary/10 border-theme-primary text-blue-500 font-bold shadow-sm' 
                          : 'bg-white/30 dark:bg-white/5 border-white/60 dark:border-white/10 hover:border-theme-primary/50'
                      }`}
                    >
                      <span className="text-xl">{m.emoji}</span>
                      <span className="text-[9px] mt-0.5 font-bold uppercase">{m.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <button 
              onClick={handleNewEntry}
              className="w-full py-2.5 px-4 rounded-xl border border-dashed border-theme-primary/30 hover:border-theme-primary text-blue-500 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            >
              <Plus size={14} />
              <span>Write Today's Entry</span>
            </button>
          </GlassCard>

          {/* Past Reflections Log */}
          <GlassCard className="flex-1 overflow-hidden flex flex-col min-h-[300px]">
            <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2 shrink-0">
              <Clock size={18} className="text-blue-500" />
              <span>Past Reflections</span>
            </h3>

            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2.5 pr-1">
              {journals.length === 0 ? (
                <div className="text-center py-12 text-xs text-gray-400 dark:text-gray-500">
                  Your book of memories is empty. Start writing to fill these pages! 📖
                </div>
              ) : (
                journals.map(entry => (
                  <div
                    key={entry.id}
                    onClick={() => handleSelectPastEntry(entry)}
                    className={`p-3 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                      entry.date === date
                        ? 'bg-blue-500 text-white hover:bg-blue-600 border-theme-primary shadow-sm'
                        : 'bg-white/20 dark:bg-white/5 border-white/50 dark:border-white/5 hover:border-theme-primary/50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-xl shrink-0">{getMoodEmoji(entry.mood)}</span>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold truncate">{entry.title || 'Untitled reflection'}</h4>
                        <span className={`text-[9px] font-medium ${entry.date === date ? 'text-white/80' : 'text-gray-400 dark:text-gray-500'}`}>{entry.date}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1 shrink-0">
                      <ChevronRight size={14} className={entry.date === date ? 'text-white' : 'text-gray-400'} />
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteJournalEntry(entry.id);
                        }}
                        className={`p-1 rounded hover:bg-red-500/20 ${entry.date === date ? 'text-white/80 hover:text-white' : 'text-gray-400 hover:text-red-500'} transition-all`}
                        title="Delete Entry"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </GlassCard>
        </div>

        {/* Right Side Page (Span 8): Ruled Notebook Editor */}
        <div className="lg:col-span-8">
          <div className="w-full h-full rounded-[32px] overflow-hidden border border-amber-200/50 dark:border-indigo-950/50 shadow-lg relative flex flex-col min-h-[500px]">
            {/* Ruled Notebook Sheet Background */}
            <div className="absolute inset-0 notebook-page z-0" />
            
            {/* Binder Rings Decor on left side (desktop-only) */}
            <div className="absolute top-0 bottom-0 left-4 w-4 hidden lg:flex flex-col justify-around py-8 z-10 pointer-events-none">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="w-6 h-3 bg-gradient-to-r from-gray-400 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded-full border border-gray-500/20 -translate-x-1/2 shadow-sm" />
              ))}
            </div>

            {/* Notebook Content Layout */}
            <form onSubmit={handleSave} className="relative z-10 p-6 md:p-10 flex-1 flex flex-col space-y-6 lg:pl-12">
              
              {/* Notebook Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-dashed border-gray-300 dark:border-indigo-900 pb-4">
                <div className="flex items-center gap-2.5 text-xs text-gray-500 dark:text-gray-400 font-bold bg-amber-500/10 dark:bg-indigo-500/10 px-3 py-1.5 rounded-full">
                  <Calendar size={14} className="text-blue-500" />
                  <span>Entry for {date}</span>
                </div>
                
                <div className="text-xl font-handwriting text-blue-500 font-bold">
                  vibe: {getMoodEmoji(mood)}
                </div>
              </div>

              {/* Title Input */}
              <div>
                <input 
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Title your thoughts today..."
                  className="w-full bg-transparent border-none text-lg font-bold text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none font-sans"
                  maxLength={100}
                />
              </div>

              {/* Writing Lines Area */}
              <div className="flex-1 flex flex-col">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Dear Diary, today was..."
                  className="w-full flex-1 bg-transparent border-none focus:outline-none text-sm leading-[32px] text-gray-700 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-600 font-handwriting text-base resize-none custom-scrollbar"
                />
              </div>

              {/* Good Thing Reflection at Bottom */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 to-pink-500/10 dark:from-amber-500/5 dark:to-pink-500/5 border border-amber-500/20 dark:border-pink-500/10 space-y-2">
                <label className="block text-xs font-bold text-blue-500 uppercase flex items-center gap-1">
                  <span>🌈</span>
                  <span>Good Thing I Did Today</span>
                </label>
                <input 
                  type="text"
                  value={goodThing}
                  onChange={(e) => setGoodThing(e.target.value)}
                  placeholder="What was a small victory or beautiful moment today?"
                  className="w-full bg-transparent border-none focus:outline-none text-xs text-gray-700 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-500 font-sans font-semibold"
                  maxLength={200}
                />
              </div>

              {/* Save Button */}
              <div className="flex justify-end pt-2 border-t border-dashed border-gray-300 dark:border-indigo-900">
                <button
                  type="submit"
                  disabled={!title.trim() && !content.trim()}
                  className="py-2.5 px-6 rounded-2xl bg-blue-500 text-white hover:bg-blue-600 font-bold text-xs hover:opacity-95 shadow-glow disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-1.5"
                >
                  <Save size={14} />
                  <span>Lock In Diary Entry</span>
                </button>
              </div>

            </form>
          </div>
        </div>

      </div>

    </div>
  );
}
