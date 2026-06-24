import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Heart, 
  Calendar, 
  Plus, 
  Trash2, 
  Shuffle, 
  X, 
  BookOpen, 
  TrendingUp, 
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { useBloom } from '../../context/BloomContext';
import GlassCard from '../../components/GlassCard';

export default function GratitudeJar() {
  const { 
    gratitudeNotes = [], 
    addGratitudeNote, 
    deleteGratitudeNote,
    streak 
  } = useBloom();

  const [noteText, setNoteText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [pulledNote, setPulledNote] = useState(null);
  const [isPulling, setIsPulling] = useState(false);
  const [activeTab, setActiveTab] = useState('jar'); // 'jar' or 'history'
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Generate deterministic coordinates/rotations for scrolls in the jar based on note ID
  const getScrollPositions = (index, total) => {
    // Distribute them inside the bottom/center portion of the jar
    // Width of jar inside: ~40% to 60%, Height: ~35% to 80%
    const seed = index * 3.7;
    const angle = (seed * 180) % 360;
    const x = 50 + Math.cos(angle) * (15 + (index % 3) * 6); // Percentage relative to jar width (50 is center)
    const y = 50 + (index % 4) * 8 + (index % 2) * 5; // Percentage relative to jar height
    const rot = (seed * 45) % 90 - 45; // -45deg to 45deg
    
    return { x, y, rot };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!noteText.trim()) return;

    setIsSubmitting(true);
    // Play fly-in animation first, then save
    setTimeout(async () => {
      await addGratitudeNote(noteText);
      setNoteText('');
      setIsSubmitting(false);
    }, 1200); // sync with animation duration
  };

  const handlePullRandom = () => {
    if (gratitudeNotes.length === 0) return;
    setIsPulling(true);
    setPulledNote(null);
    
    // Animate pulling a random scroll
    setTimeout(() => {
      const randomIdx = Math.floor(Math.random() * gratitudeNotes.length);
      setPulledNote(gratitudeNotes[randomIdx]);
      setIsPulling(false);
    }, 1500);
  };

  // Group notes for the yearly/monthly archive list
  const groupedNotes = gratitudeNotes.reduce((acc, note) => {
    const d = new Date(note.createdAt);
    const y = d.getFullYear();
    const m = d.toLocaleString('default', { month: 'long' });
    
    if (!acc[y]) acc[y] = {};
    if (!acc[y][m]) acc[y][m] = [];
    acc[y][m].push(note);
    return acc;
  }, {});

  const years = Object.keys(groupedNotes).sort((a, b) => b - a);

  // Statistics calculations
  const totalNotes = gratitudeNotes.length;
  const currentMonthName = new Date().toLocaleString('default', { month: 'long' });
  const currentYear = new Date().getFullYear();
  const monthlyNotes = gratitudeNotes.filter(n => {
    const d = new Date(n.createdAt);
    return d.getFullYear() === currentYear && d.toLocaleString('default', { month: 'long' }) === currentMonthName;
  }).length;

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto overflow-y-auto h-[calc(100vh-4rem)] custom-scrollbar">
      
      {/* Background glow lighting effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[350px] h-[350px] bg-amber-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-10 left-1/3 w-[250px] h-[250px] bg-pink-500/5 rounded-full blur-[80px]" />
      </div>

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 pb-2">
        <div>
          <h3 className="font-extrabold text-sm text-gray-400 dark:text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
            <Sparkles size={16} className="text-amber-500" />
            <span>Gratitude Jar</span>
          </h3>
          <p className="text-xs text-gray-500">Collect moments of joy, gratitude, and magic to revisit anytime.</p>
        </div>

        {/* Tab Selector */}
        <div className="flex bg-white/40 dark:bg-black/25 border border-white/60 dark:border-white/10 rounded-2xl p-1 shadow-sm">
          <button
            onClick={() => setActiveTab('jar')}
            className={`px-4 py-1.5 rounded-xl text-xs font-black transition-all ${
              activeTab === 'jar'
                ? 'bg-blue-100 dark:bg-blue-900/60 text-blue-900 dark:text-blue-200 shadow-md'
                : 'text-blue-950/60 dark:text-blue-200/50 hover:text-blue-900'
            }`}
          >
            Magic Jar 🫙
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-1.5 rounded-xl text-xs font-black transition-all ${
              activeTab === 'history'
                ? 'bg-blue-100 dark:bg-blue-900/60 text-blue-900 dark:text-blue-200 shadow-md'
                : 'text-blue-950/60 dark:text-blue-200/50 hover:text-blue-900'
            }`}
          >
            Yearly Scrapbook 📖
          </button>
        </div>
      </div>

      {activeTab === 'jar' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch relative z-10">
          
          {/* Write Note Panel (Left/4 Cols) */}
          <div className="lg:col-span-4 flex flex-col justify-between space-y-6">
            
            {/* Form card structured like a nice writing pad */}
            <GlassCard className="relative overflow-hidden bg-gradient-to-br from-amber-500/5 via-transparent to-transparent flex-1 flex flex-col justify-between p-6 min-h-[320px]">
              <div className="space-y-4">
                <h4 className="font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <Heart size={16} className="text-pink-500 fill-pink-500" />
                  <span>Deposit some Gratitude</span>
                </h4>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="relative">
                    {/* Simulated lined card stock pad */}
                    <div className="absolute inset-0 bg-yellow-50/80 dark:bg-amber-950/40 border border-amber-200/50 rounded-2xl -z-10 shadow-inner" />
                    
                    {/* Submission Fly-away card */}
                    <AnimatePresence>
                      {isSubmitting && (
                        <motion.div
                          initial={{ scale: 1, x: 0, y: 0, opacity: 1, rotate: 0 }}
                          animate={{ 
                            scale: 0.1, 
                            x: 350, 
                            y: -250, 
                            opacity: 0, 
                            rotate: 720,
                            transition: { duration: 1.2, ease: "easeInOut" }
                          }}
                          className="absolute inset-0 bg-amber-100 dark:bg-amber-900 border border-amber-300 rounded-2xl z-20 p-4 shadow-xl flex items-center justify-center"
                        >
                          <div className="text-center text-amber-900 dark:text-amber-100 font-handwriting text-sm font-bold">
                            Folding scroll... ✨
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <textarea
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      placeholder="What is one small or big thing you're grateful for today? Write it down..."
                      rows={6}
                      disabled={isSubmitting}
                      className="w-full p-4 rounded-2xl bg-transparent border-0 focus:ring-0 focus:outline-none text-amber-950 dark:text-amber-50 font-handwriting placeholder-amber-900/60 dark:placeholder-amber-200/40 text-sm leading-loose resize-none custom-scrollbar"
                      maxLength={250}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={!noteText.trim() || isSubmitting}
                    className="w-full py-3 px-4 rounded-2xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 disabled:opacity-40"
                  >
                    <Plus size={14} />
                    <span>Drop into Jar</span>
                  </button>
                </form>
              </div>

              {/* Tips block */}
              <div className="mt-6 pt-4 border-t border-black/5 dark:border-white/5 text-[10px] text-gray-400 dark:text-gray-500 italic">
                🌸 Tips: Think of simple details—a warm tea, a lovely message, or completing a hard coding task.
              </div>
            </GlassCard>

            {/* Lucky Dip Action */}
            <GlassCard className="p-5 flex items-center justify-between bg-gradient-to-r from-amber-500/10 via-transparent to-transparent">
              <div className="space-y-0.5">
                <h5 className="font-bold text-xs text-gray-700 dark:text-gray-300">Feeling Nostalgic?</h5>
                <p className="text-[10px] text-gray-400">Pull a random note of gratitude from your jar.</p>
              </div>
              <button
                onClick={handlePullRandom}
                disabled={gratitudeNotes.length === 0 || isPulling}
                className="py-2.5 px-4 rounded-xl bg-amber-500 text-white font-bold text-xs hover:bg-amber-600 transition-all flex items-center gap-1 shadow-[0_4px_12px_rgba(245,158,11,0.2)] disabled:opacity-40"
              >
                <Shuffle size={13} />
                <span>Pull Note</span>
              </button>
            </GlassCard>
          </div>

          {/* Jar Showcase Panel (Center/5 Cols) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center py-6 min-h-[480px]">
            
            {/* The Magic Glass Jar Container */}
            <div className="relative w-80 h-[420px] flex items-center justify-center">
              
              {/* Magical Ambient Jar Background Radial Glow */}
              <div className="absolute w-[220px] h-[280px] bg-radial from-amber-300/35 via-amber-500/10 to-transparent rounded-full blur-2xl top-[25%] pointer-events-none animate-pulse" style={{ animationDuration: '6s' }} />

              {/* Ambient Glowing Fairy Lights Bulbs floating around Jar */}
              <div className="absolute inset-0 pointer-events-none z-10">
                {[
                  { delay: 0.1, size: 8, top: '22%', left: '42%' },
                  { delay: 1.2, size: 5, top: '45%', left: '30%' },
                  { delay: 0.7, size: 6, top: '55%', left: '68%' },
                  { delay: 2.3, size: 4, top: '70%', left: '38%' },
                  { delay: 1.8, size: 8, top: '65%', left: '55%' },
                  { delay: 0.4, size: 5, top: '38%', left: '60%' },
                ].map((light, i) => (
                  <motion.div
                    key={i}
                    animate={{ 
                      y: [0, -12, 0], 
                      opacity: [0.3, 0.95, 0.3],
                      scale: [1, 1.15, 1] 
                    }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 3 + i, 
                      delay: light.delay,
                      ease: "easeInOut"
                    }}
                    className="absolute bg-amber-300 rounded-full shadow-[0_0_12px_#fbbf24] border border-amber-100"
                    style={{
                      width: light.size,
                      height: light.size,
                      top: light.top,
                      left: light.left,
                    }}
                  />
                ))}
              </div>

              {/* Interactive SVG Glass Jar Illustration */}
              <svg 
                viewBox="0 0 100 130" 
                className="w-full h-full drop-shadow-[0_15px_30px_rgba(0,0,0,0.15)] select-none pointer-events-none"
              >
                {/* 1. Wood/Cork Lid */}
                <rect x="36" y="5" width="28" height="7" rx="1.5" fill="#5c3a21" stroke="#3d2513" strokeWidth="0.5" />
                <ellipse cx="50" cy="5" rx="14" ry="1.5" fill="#4d301b" />
                
                {/* Neck and lip glass rim */}
                <path d="M 33 13 Q 50 17 67 13 L 65 24 Q 50 26 35 24 Z" fill="rgba(255, 255, 255, 0.3)" stroke="rgba(255, 255, 255, 0.6)" strokeWidth="0.5" />
                <ellipse cx="50" cy="13" rx="17" ry="2" fill="rgba(255, 255, 255, 0.15)" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="0.5" />

                {/* 2. Apothecary Glass Jar Main Contour Body */}
                <path 
                  d="M 35 24 
                     Q 20 27 18 42
                     L 18 108
                     Q 18 123 35 125
                     L 65 125
                     Q 82 123 82 108
                     L 82 42
                     Q 80 27 65 24
                     Z" 
                  fill="url(#glass-gradient)" 
                  stroke="rgba(255, 255, 255, 0.65)" 
                  strokeWidth="0.8" 
                />

                {/* 3. Glass Highlights / Reflections (Gives realistic sheen) */}
                {/* Left rim light */}
                <path d="M 21 44 L 21 106 Q 21 118 34 121" fill="none" stroke="rgba(255, 255, 255, 0.45)" strokeWidth="1.2" strokeLinecap="round" />
                {/* Right highlight */}
                <path d="M 79 44 L 79 90" fill="none" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="1.8" strokeLinecap="round" />
                <path d="M 75 110 Q 75 119 65 121" fill="none" stroke="rgba(255, 255, 255, 0.35)" strokeWidth="1.0" strokeLinecap="round" />
                
                {/* Label text background */}
                <rect x="30" y="55" width="40" height="22" rx="3" fill="#fffcf0" stroke="#d4c3a3" strokeWidth="0.5" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.06))" />
                <rect x="32" y="57" width="36" height="18" rx="2" fill="none" stroke="#e6dbbb" strokeWidth="0.5" strokeDasharray="1.5,1" />

                {/* Definitions of Gradients */}
                <defs>
                  <linearGradient id="glass-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="rgba(255, 255, 255, 0.35)" />
                    <stop offset="25%" stopColor="rgba(255, 255, 255, 0.05)" />
                    <stop offset="75%" stopColor="rgba(255, 255, 255, 0.08)" />
                    <stop offset="100%" stopColor="rgba(255, 255, 255, 0.25)" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Label Content Overlay (rendered inside cork board rectangle center) */}
              <div className="absolute top-[44%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none select-none z-10">
                <span className="block text-[8px] font-bold text-amber-800/60 uppercase tracking-widest leading-none">Vibe Notes</span>
                <span className="block text-xl font-bold text-amber-900 font-serif leading-none mt-1">Gratitude</span>
                <span className="block text-[9px] font-semibold text-amber-700 font-mono mt-1 animate-pulse">
                  🌸 {gratitudeNotes.length} Notes
                </span>
              </div>

              {/* Floating scrolls interactive layer inside the jar */}
              <div className="absolute inset-0 z-10 w-full h-full overflow-hidden rounded-[40px] pointer-events-auto">
                {gratitudeNotes.slice(0, 15).map((note, index) => {
                  const { x, y, rot } = getScrollPositions(index, gratitudeNotes.length);
                  // Colors for notes (soft watercolor values)
                  const colors = [
                    'bg-amber-100 border-amber-300 dark:bg-amber-900/80 dark:border-amber-700',
                    'bg-pink-100 border-pink-300 dark:bg-pink-900/80 dark:border-pink-700',
                    'bg-emerald-100 border-emerald-300 dark:bg-emerald-900/80 dark:border-emerald-700',
                    'bg-sky-100 border-sky-300 dark:bg-sky-900/80 dark:border-sky-700',
                    'bg-purple-100 border-purple-300 dark:bg-purple-900/80 dark:border-purple-700'
                  ];
                  const colClass = colors[index % colors.length];

                  return (
                    <motion.div
                      key={note.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedNote(note);
                      }}
                      animate={{ 
                        y: [0, -8, 0],
                        rotate: [rot, rot + 4, rot]
                      }}
                      transition={{ 
                        repeat: Infinity, 
                        duration: 4.5 + (index % 3), 
                        delay: index * 0.25,
                        ease: "easeInOut"
                      }}
                      whileHover={{ scale: 1.25, zIndex: 30, cursor: 'pointer' }}
                      className={`absolute w-7 h-4 rounded border-b shadow-sm flex items-center justify-center text-[7px] ${colClass} pointer-events-auto`}
                      style={{ 
                        left: `${x}%`, 
                        top: `${y}%`,
                        transform: `translate(-50%, -50%) rotate(${rot}deg)`
                      }}
                      title="Click to read gratitude scroll"
                    >
                      <span>✉️</span>
                    </motion.div>
                  );
                })}
              </div>

            </div>

          </div>

          {/* Stats & Streak (Right/3 Cols) */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* 1. Streak Widget */}
            <GlassCard className="p-6 bg-gradient-to-br from-pink-500/5 via-transparent to-transparent space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">Daily Streak</span>
                <span className="text-lg">🔥</span>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-black text-theme-primary">{streak} Days</div>
                <p className="text-[10px] text-gray-500">Documenting gratitude strengthens mental wellness.</p>
              </div>
              
              {/* Progress bar simulation */}
              <div className="h-1.5 w-full bg-black/10 dark:bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-pink-500 to-amber-500 rounded-full" 
                  style={{ width: `${Math.min(100, (streak / 30) * 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-[8px] font-bold text-gray-400">
                <span>0d</span>
                <span>Goal: 30d (Habit)</span>
              </div>
            </GlassCard>

            {/* 2. Counter Stats Widget */}
            <GlassCard className="p-6 space-y-4">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wide flex items-center gap-1">
                <TrendingUp size={13} className="text-theme-primary" />
                <span>Jar Metrics</span>
              </span>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/5 dark:bg-white/5 p-3 rounded-2xl border border-black/5 text-center">
                  <span className="block text-[8px] font-bold text-gray-400 uppercase">Total Notes</span>
                  <span className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-1 block">{totalNotes}</span>
                </div>
                
                <div className="bg-black/5 dark:bg-white/5 p-3 rounded-2xl border border-black/5 text-center">
                  <span className="block text-[8px] font-bold text-gray-400 uppercase">{currentMonthName}</span>
                  <span className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-1 block">{monthlyNotes}</span>
                </div>
              </div>
            </GlassCard>

            {/* 3. Empty State or Quote Widget */}
            <GlassCard className="p-5 border border-dashed border-white/20 bg-amber-50/10 dark:bg-white/5">
              <span className="text-[14px] leading-relaxed font-serif italic text-amber-900/60 dark:text-amber-200/50 block text-center">
                "Gratitude turns what we have into enough, and more."
              </span>
            </GlassCard>

          </div>

        </div>
      ) : (
        /* History / Scrapbook Tab View */
        <div className="relative z-10 space-y-6 max-w-4xl mx-auto">
          
          {/* Year selector header */}
          <div className="flex items-center justify-between border-b border-black/5 dark:border-white/10 pb-4">
            <h4 className="font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
              <BookOpen size={16} className="text-theme-primary" />
              <span>Scrapbook Memory Log</span>
            </h4>

            {years.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-500 uppercase">Filter Year:</span>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="bg-white/40 dark:bg-black/25 border border-white/60 dark:border-white/10 rounded-xl px-3 py-1 text-xs font-bold text-gray-700 dark:text-gray-300 focus:outline-none cursor-pointer"
                >
                  {years.map(y => (
                    <option key={y} value={y} className="dark:bg-gray-900 dark:text-white">{y}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {totalNotes === 0 ? (
            <div className="text-center py-20 text-xs text-gray-400 border border-dashed border-white/20 rounded-3xl p-6 bg-white/5">
              No gratitude notes logged yet. Drop a letter into the jar to register your memories! 🫙✨
            </div>
          ) : !groupedNotes[selectedYear] ? (
            <div className="text-center py-20 text-xs text-gray-400">
              No gratitude notes logged for year {selectedYear}. Choose another year or deposit a note!
            </div>
          ) : (
            <div className="space-y-8">
              {Object.keys(groupedNotes[selectedYear]).map(month => {
                const notes = groupedNotes[selectedYear][month];
                
                return (
                  <div key={month} className="space-y-3">
                    <h5 className="text-xs font-black uppercase text-pink-500 tracking-wider pl-1">{month} {selectedYear}</h5>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {notes.map(note => (
                        <div
                          key={note.id}
                          onClick={() => setSelectedNote(note)}
                          className="group relative cursor-pointer p-4 bg-[#fffdf5] dark:bg-black/20 border border-amber-200/50 dark:border-white/5 rounded-2xl hover:shadow-md transition-all hover:-translate-y-0.5"
                        >
                          {/* Washi Tape scrapbooking design decoration */}
                          <div className="absolute -top-2 left-6 w-12 h-3.5 bg-pink-500/10 dark:bg-pink-400/20 border-l border-r border-dashed border-pink-400/30 rotate-[-2deg]" />
                          
                          <div className="space-y-2.5 pt-1.5">
                            <p className="text-sm text-gray-700 dark:text-gray-300 font-handwriting leading-relaxed line-clamp-3">
                              {note.content}
                            </p>
                            <div className="flex items-center justify-between text-[9px] text-gray-400 dark:text-gray-500 font-semibold border-t border-black/5 dark:border-white/5 pt-2">
                              <span>Logged: {new Date(note.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteGratitudeNote(note.id);
                                }}
                                className="p-1 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                                title="Discard Gratitude Note"
                              >
                                <Trash2 size={11} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}

      {/* Detail View Modal for clicked scrolls */}
      <AnimatePresence>
        {selectedNote && (
          <div className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              className="w-full max-w-md rounded-3xl bg-[#fffdf0] border border-amber-200/50 shadow-2xl p-6 relative overflow-hidden"
            >
              {/* Scrapbook margins */}
              <div className="absolute top-0 bottom-0 left-4 w-[1px] bg-red-400/30" />
              
              <div className="relative z-10 flex flex-col space-y-4 pl-4 text-amber-950">
                <div className="flex items-center justify-between border-b border-dashed border-gray-300 pb-2">
                  <div className="flex items-center gap-1.5">
                    <Heart size={14} className="text-pink-500 fill-pink-500" />
                    <span className="text-[10px] font-bold text-amber-900/70 uppercase tracking-widest font-sans">Gratitude Scroll Opened</span>
                  </div>
                  <button 
                    onClick={() => setSelectedNote(null)}
                    className="p-1 rounded-full hover:bg-black/10 text-gray-600 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="py-2 min-h-[120px]">
                  <p className="text-lg text-amber-950 font-handwriting leading-loose whitespace-pre-wrap">
                    {selectedNote.content}
                  </p>
                </div>

                <div className="pt-2 border-t border-dashed border-gray-300 flex items-center justify-between text-[10px] text-amber-850/80 italic">
                  <span>Written on {new Date(selectedNote.createdAt).toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  
                  <button 
                    onClick={() => {
                      deleteGratitudeNote(selectedNote.id);
                      setSelectedNote(null);
                    }}
                    className="py-1 px-2.5 rounded-lg hover:bg-red-500/10 text-red-500 font-bold transition-all flex items-center gap-0.5"
                  >
                    <Trash2 size={11} />
                    <span>Discard</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Lucky Dip Pulled Note Modal */}
      <AnimatePresence>
        {(pulledNote || isPulling) && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md rounded-3xl bg-amber-50 border-2 border-amber-300 shadow-2xl p-6 relative overflow-hidden text-center flex flex-col items-center justify-center min-h-[280px]"
            >
              {isPulling ? (
                <div className="space-y-4">
                  {/* Glowing spinning jar animation */}
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                    className="w-16 h-16 rounded-full border-4 border-dashed border-amber-500 border-t-transparent flex items-center justify-center text-amber-500 mx-auto"
                  >
                    🫙
                  </motion.div>
                  <div className="text-sm font-bold text-amber-800">Reaching into the jar... ✨</div>
                </div>
              ) : (
                <div className="space-y-5 w-full">
                  <div className="text-xl font-bold text-amber-950">✨🎉 Lucky Dip Note! 🎉✨</div>
                  <div className="w-full p-6 bg-white rounded-2xl border border-amber-200 shadow-inner">
                    <p className="text-lg text-amber-950 font-handwriting leading-loose">
                      "{pulledNote.content}"
                    </p>
                  </div>
                  
                  <div className="text-[10px] text-amber-800/80 font-bold">
                    Logged on {new Date(pulledNote.createdAt).toLocaleDateString()}
                  </div>

                  <div className="flex gap-2 justify-center pt-2">
                    <button
                      onClick={handlePullRandom}
                      className="py-2 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-all"
                    >
                      Pull Another
                    </button>
                    <button
                      onClick={() => setPulledNote(null)}
                      className="py-2 px-4 rounded-xl bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 text-gray-700 dark:text-gray-200 text-xs font-bold transition-all"
                    >
                      Close Jar
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Global CSS handwriting rules for scrapbook vibes */}
      <style>{`
        .font-handwriting {
          font-family: 'Caveat', cursive, sans-serif;
          font-size: 1.25rem;
          line-height: 1.6;
        }
      `}</style>

    </div>
  );
}
