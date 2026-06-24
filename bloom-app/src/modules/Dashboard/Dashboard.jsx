import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Flame, 
  CheckCircle2, 
  BookOpen, 
  Hourglass, 
  Flower2, 
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import { useBloom } from '../../context/BloomContext';
import GlassCard from '../../components/GlassCard';
import { getRandomQuote } from '../../utils/quotes';

export default function Dashboard({ setActiveView }) {
  const { 
    todos, 
    journals, 
    timeCapsules, 
    streak, 
    memories,
    letters
  } = useBloom();

  const [quote, setQuote] = useState({ text: '', author: '' });
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    setQuote(getRandomQuote());

    const hr = new Date().getHours();
    if (hr < 12) {
      setGreeting('Good morning, sunshine ☀️');
    } else if (hr < 18) {
      setGreeting('Good afternoon, star 🌤️');
    } else {
      setGreeting('Good evening, dreamer 🌙');
    }
  }, []);

  // Productivity calculation
  const completedTodos = todos.filter(t => t.completed).length;
  const totalTodos = todos.length;
  const completionRate = totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0;

  // Recent journal entry
  const latestJournal = journals[0];

  // Upcoming locked time capsule
  const nextCapsule = timeCapsules
    .filter(c => new Date(c.unlockDate) > new Date())
    .sort((a, b) => new Date(a.unlockDate) - new Date(b.unlockDate))[0];

  // Remaining time calculation for preview
  const [timeLeft, setTimeLeft] = useState('');
  useEffect(() => {
    if (!nextCapsule) return;
    const interval = setInterval(() => {
      const diff = new Date(nextCapsule.unlockDate) - new Date();
      if (diff <= 0) {
        setTimeLeft('Ready to open!');
        clearInterval(interval);
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        setTimeLeft(`${days}d ${hours}h remaining`);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [nextCapsule]);

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto overflow-y-auto h-[calc(100vh-4rem)] custom-scrollbar bg-grid-pattern">
      
      {/* Animated Hero Section */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="relative overflow-hidden p-6 md:p-10 rounded-[32px] bg-gradient-to-br from-pink-400/20 via-purple-400/20 to-indigo-400/20 border border-white/30 dark:border-white/5 flex flex-col md:flex-row items-center justify-between gap-6"
      >
        <div className="space-y-4 text-center md:text-left z-10">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/40 dark:bg-white/5 border border-white/50 text-xs font-bold text-theme-primary"
          >
            <Sparkles size={14} className="animate-pulse" />
            <span>Digital Life Companion</span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl md:text-5xl font-black tracking-tight"
          >
            {greeting}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-sm md:text-base text-gray-600 dark:text-gray-300 max-w-md"
          >
            Welcome back to your safe space. Today is a beautiful day to nurture your garden, log your memories, and write to your future self.
          </motion.p>
        </div>

        {/* Floating Flower Decoration */}
        <motion.div 
          animate={{ 
            rotate: 360,
            y: [0, -10, 0]
          }}
          transition={{ 
            rotate: { duration: 25, repeat: Infinity, ease: "linear" },
            y: { duration: 5, repeat: Infinity, ease: "easeInOut" }
          }}
          className="text-pink-400/30 dark:text-pink-400/10 shrink-0 hidden md:block"
        >
          <Flower2 size={180} />
        </motion.div>
      </motion.div>

      {/* Stats Quick Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Streak Counter */}
        <GlassCard delay={0.1} className="flex items-center gap-4 hover:border-orange-400/50">
          <div className="w-12 h-12 rounded-2xl bg-orange-100 dark:bg-orange-950/40 text-orange-500 flex items-center justify-center shrink-0">
            <Flame size={24} className="animate-bounce" />
          </div>
          <div>
            <div className="text-2xl font-black text-orange-500">{streak} Days</div>
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400">Current Growth Streak</div>
          </div>
        </GlassCard>

        {/* To-Do Garden Summary */}
        <GlassCard delay={0.15} className="flex items-center gap-4 hover:border-emerald-400/50" onClick={() => setActiveView('todo')}>
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/40 text-emerald-500 flex items-center justify-center shrink-0">
            <Flower2 size={24} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-2xl font-black text-emerald-500">{completedTodos}/{totalTodos}</div>
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400">Garden Seeds Sown</div>
          </div>
        </GlassCard>

        {/* Memories Saved */}
        <GlassCard delay={0.2} className="flex items-center gap-4 hover:border-pink-400/50" onClick={() => setActiveView('memory')}>
          <div className="w-12 h-12 rounded-2xl bg-pink-100 dark:bg-pink-950/40 text-pink-500 flex items-center justify-center shrink-0">
            <Sparkles size={24} />
          </div>
          <div>
            <div className="text-2xl font-black text-pink-500">{memories.length}</div>
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400">Vault Memories Logged</div>
          </div>
        </GlassCard>

        {/* Letters Sealed */}
        <GlassCard delay={0.25} className="flex items-center gap-4 hover:border-indigo-400/50" onClick={() => setActiveView('letters')}>
          <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950/40 text-indigo-500 flex items-center justify-center shrink-0">
            <Hourglass size={24} />
          </div>
          <div>
            <div className="text-2xl font-black text-indigo-500">{letters.length}</div>
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400">Letters to Future Me</div>
          </div>
        </GlassCard>
      </div>

      {/* Main Grid content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Columns (Span 2): Quote & Garden Progress & Recent Journal */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Quote Card */}
          <GlassCard delay={0.3} className="relative overflow-hidden bg-gradient-to-r from-theme-primary/5 via-transparent to-transparent">
            <div className="absolute top-2 right-4 text-7xl font-serif text-theme-primary/10 select-none">“</div>
            <div className="space-y-3 relative z-10">
              <div className="text-xs font-bold text-theme-primary uppercase tracking-widest">Quote of the Day</div>
              <p className="text-lg font-semibold italic text-gray-800 dark:text-gray-100">
                "{quote.text}"
              </p>
              <div className="text-sm font-bold text-gray-500 dark:text-gray-400">— {quote.author}</div>
            </div>
          </GlassCard>

          {/* Productivity / Garden Growth Progress Chart */}
          <GlassCard delay={0.35} className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp size={20} className="text-emerald-500" />
                <h3 className="font-bold text-gray-800 dark:text-gray-100">Garden Progress</h3>
              </div>
              <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full">{completionRate}% Completed</span>
            </div>
            <div className="w-full h-3 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${completionRate}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full"
              />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {completionRate === 100 
                ? 'Your garden is in full bloom! Excellent job conquering all your tasks today! 🌸'
                : `Conquer ${totalTodos - completedTodos} more tasks today to fully grow your garden flowers!`}
            </p>
          </GlassCard>

          {/* Recent Journal Entry Preview */}
          <GlassCard delay={0.4} className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen size={20} className="text-theme-primary" />
                <h3 className="font-bold text-gray-800 dark:text-gray-100">Recent Diary Reflection</h3>
              </div>
              <button 
                onClick={() => setActiveView('journal')}
                className="text-xs font-bold text-theme-primary flex items-center gap-1 hover:underline"
              >
                <span>Write more</span>
                <ArrowRight size={14} />
              </button>
            </div>

            {latestJournal ? (
              <div className="space-y-3 p-4 rounded-2xl bg-white/20 dark:bg-black/10 border border-white/30 dark:border-white/5">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-gray-800 dark:text-gray-100">{latestJournal.title}</h4>
                  <span className="text-[10px] text-gray-400 dark:text-gray-500 font-bold bg-white/50 dark:bg-black/20 px-2 py-0.5 rounded-full">{latestJournal.date}</span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-3 leading-relaxed">
                  {latestJournal.content}
                </p>
                {latestJournal.goodThing && (
                  <div className="pt-2.5 border-t border-white/20 dark:border-white/5 flex items-start gap-1.5 text-xs text-theme-primary font-medium">
                    <span>🌈</span>
                    <span><strong>Good thing:</strong> {latestJournal.goodThing}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-400 dark:text-gray-500 text-xs">
                No reflections recorded yet. How has your day been? Write your first journal entry!
              </div>
            )}
          </GlassCard>

        </div>

        {/* Right Column (Span 1): Upcoming Time Capsules & Letters */}
        <div className="space-y-6">
          {/* Upcoming Time Capsules Card */}
          <GlassCard delay={0.45} className="space-y-4 flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Hourglass size={20} className="text-pink-500" />
                  <h3 className="font-bold text-gray-800 dark:text-gray-100">Locked Capsules</h3>
                </div>
                <button 
                  onClick={() => setActiveView('capsule')}
                  className="text-xs font-bold text-pink-500 flex items-center gap-1 hover:underline"
                >
                  <span>All vaults</span>
                  <ArrowRight size={14} />
                </button>
              </div>

              {nextCapsule ? (
                <div className="p-4 rounded-2xl bg-gradient-to-br from-pink-500/10 to-purple-500/5 border border-pink-500/20 text-center space-y-3">
                  <div className="text-4xl">🔒</div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-800 dark:text-gray-200">{nextCapsule.title}</h4>
                    <div className="text-xs text-pink-500 font-bold mt-1.5 bg-pink-500/10 px-3 py-1 rounded-full inline-block">
                      {timeLeft}
                    </div>
                  </div>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500 leading-normal">
                    This capsule will unlock automatically when the counter expires. Hang tight!
                  </p>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400 dark:text-gray-500 text-xs">
                  No upcoming capsules locked. Set up a capsule to preserve a memory for the future!
                </div>
              )}
            </div>
            
            {/* Quick action buttons */}
            <div className="pt-4 border-t border-white/20 dark:border-white/5 grid grid-cols-2 gap-2">
              <button 
                onClick={() => setActiveView('thoughts')}
                className="py-2.5 px-3 rounded-2xl bg-black/10 dark:bg-white/5 border border-white/10 dark:border-white/5 text-[11px] font-bold text-center text-gray-700 dark:text-gray-200 hover:bg-black/15 dark:hover:bg-white/10 transition-all"
              >
                📁 Dump Thoughts
              </button>
              <button 
                onClick={() => setActiveView('bucket')}
                className="py-2.5 px-3 rounded-2xl bg-blue-500 text-white text-[11px] font-bold text-center hover:opacity-95 shadow-glow transition-all"
              >
                🌟 Bucket List
              </button>
            </div>
          </GlassCard>
        </div>

      </div>

    </div>
  );
}
