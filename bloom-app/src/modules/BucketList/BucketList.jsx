import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Trash2, 
  Check, 
  CheckCircle,
  Trophy,
  Sparkles,
  Search
} from 'lucide-react';
import { useBloom } from '../../context/BloomContext';
import GlassCard from '../../components/GlassCard';
import confetti from 'canvas-confetti';

const POPULAR_EMOJIS = ['✈️', '🎓', '🎸', '🌟', '🏕️', '🧗', '🎨', '🚀', '🏋️', '🧘', '🌍', '🏠', '❤️', '🚲', '🍕'];

export default function BucketList() {
  const { 
    bucketList, 
    addBucketItem, 
    updateBucketProgress, 
    toggleBucketComplete, 
    deleteBucketItem,
    searchQuery
  } = useBloom();

  const [text, setText] = useState('');
  const [emoji, setEmoji] = useState('🌟');
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);

  // Filter based on search query
  const filteredBucket = bucketList.filter(item => 
    item.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeGoals = filteredBucket.filter(g => !g.completed);
  const completedGoals = filteredBucket.filter(g => g.completed);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    addBucketItem(text, emoji);
    setText('');
    setEmoji('🌟');
  };

  const handleToggleComplete = (id, wasCompleted) => {
    toggleBucketComplete(id);
    if (!wasCompleted) {
      triggerConfetti();
    }
  };

  const handleSliderChange = (id, value) => {
    const numericVal = Number(value);
    updateBucketProgress(id, numericVal);
    if (numericVal >= 100) {
      triggerConfetti();
    }
  };

  const triggerConfetti = () => {
    // Beautiful celebration confetti burst
    const duration = 2 * 1000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#a78bfa', '#f472b6', '#34d399', '#38bdf8', '#fb923c']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#a78bfa', '#f472b6', '#34d399', '#38bdf8', '#fb923c']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  };

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-6xl mx-auto overflow-y-auto h-[calc(100vh-4rem)] custom-scrollbar">
      
      {/* Overview Achievements Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GlassCard className="md:col-span-2 flex flex-col md:flex-row items-center justify-between gap-4 bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-transparent border-purple-500/20">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-xl font-extrabold text-theme-primary flex items-center gap-1.5 justify-center md:justify-start">
              <Trophy className="animate-bounce" />
              <span>Manifest Your Dreams</span>
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Track your life list, slide your progress, and check off accomplishments.
            </p>
          </div>
          <div className="flex items-center gap-2 font-bold text-xs bg-white/40 dark:bg-white/5 border border-white/60 px-4 py-2 rounded-2xl shrink-0">
            <span>🌟 Achieved:</span>
            <span className="text-theme-primary text-sm font-black">{completedGoals.length} Goals</span>
          </div>
        </GlassCard>

        {/* Quick Add Form */}
        <GlassCard className="p-4 flex flex-col justify-center">
          <form onSubmit={handleSubmit} className="flex gap-2">
            {/* Emoji Selector Trigger */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setEmojiPickerOpen(!emojiPickerOpen)}
                className="w-11 h-11 rounded-2xl bg-white/40 dark:bg-black/20 border border-white/60 dark:border-white/10 hover:border-theme-primary text-xl flex items-center justify-center transition-colors shrink-0"
              >
                {emoji}
              </button>

              {emojiPickerOpen && (
                <div className="absolute left-0 mt-2 w-48 rounded-2xl glass-card bg-white/95 dark:bg-gray-900/95 border border-white/20 p-2 z-50 grid grid-cols-5 gap-1 shadow-lg">
                  {POPULAR_EMOJIS.map(em => (
                    <button
                      key={em}
                      type="button"
                      onClick={() => {
                        setEmoji(em);
                        setEmojiPickerOpen(false);
                      }}
                      className="w-7 h-7 rounded-lg hover:bg-theme-primary/10 text-lg flex items-center justify-center"
                    >
                      {em}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <input 
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="e.g. Travel to Japan..."
              className="flex-1 px-4 py-2.5 rounded-2xl bg-white/40 dark:bg-black/20 border border-white/60 dark:border-white/10 focus:outline-none focus:border-theme-primary text-xs font-semibold placeholder-gray-400 dark:placeholder-gray-500 transition-all min-w-0"
            />
            
            <button
              type="submit"
              disabled={!text.trim()}
              className="p-3 rounded-2xl bg-theme-primary hover:opacity-95 text-white disabled:opacity-50 transition-all shrink-0"
            >
              <Plus size={18} />
            </button>
          </form>
        </GlassCard>
      </div>

      {/* Grid of Goals */}
      <div className="space-y-6">
        
        {/* Active Goals Grid */}
        <div className="space-y-4">
          <h3 className="font-bold text-sm text-gray-400 dark:text-gray-500 uppercase tracking-wider px-1">Active Dreams</h3>
          
          {activeGoals.length === 0 ? (
            <div className="text-center py-8 text-xs text-gray-400 dark:text-gray-500 border border-dashed border-white/20 rounded-3xl">
              No active goals. Add one and manifest it! ✨
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <AnimatePresence initial={false}>
                {activeGoals.map(item => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="glass-card p-5 rounded-3xl border border-white/40 dark:border-white/5 space-y-4 relative group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl filter drop-shadow-sm select-none">{item.emoji}</span>
                        <h4 className="font-bold text-sm text-gray-800 dark:text-gray-100 line-clamp-2 leading-relaxed">{item.text}</h4>
                      </div>
                      
                      <button
                        onClick={() => handleDeleteBucketItem(item.id)} // typo fix check: deleteBucketItem is the function
                        onClick={() => deleteBucketItem(item.id)}
                        className="p-1 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                        title="Delete Goal"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    {/* Progress Slider */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase">
                        <span>Progress</span>
                        <span>{item.progress}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="0"
                        max="100"
                        value={item.progress}
                        onChange={(e) => handleSliderChange(item.id, e.target.value)}
                        className="w-full accent-theme-primary bg-gray-200 dark:bg-gray-800 h-1.5 rounded-full outline-none cursor-pointer"
                      />
                    </div>

                    <button
                      onClick={() => handleToggleComplete(item.id, item.completed)}
                      className="w-full py-2.5 rounded-2xl bg-white/40 dark:bg-white/5 hover:bg-theme-primary/10 border border-white/60 dark:border-white/5 hover:border-theme-primary/50 text-[11px] font-extrabold text-theme-primary transition-all flex items-center justify-center gap-1"
                    >
                      <CheckCircle size={14} />
                      <span>Mark Achieved</span>
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Conquered Goals Grid */}
        <div className="space-y-4">
          <h3 className="font-bold text-sm text-gray-400 dark:text-gray-500 uppercase tracking-wider px-1">🌟 Completed Dreams</h3>
          
          {completedGoals.length === 0 ? (
            <div className="text-center py-8 text-xs text-gray-400 dark:text-gray-500 border border-dashed border-white/20 rounded-3xl">
              No completed goals yet. Slide that progress bar or tap achieve! 🚀
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <AnimatePresence initial={false}>
                {completedGoals.map(item => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="glass-card p-5 rounded-3xl border border-emerald-500/10 bg-emerald-500/5 dark:bg-emerald-950/10 space-y-4 relative group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl filter drop-shadow-sm select-none">{item.emoji}</span>
                        <h4 className="font-bold text-sm line-through text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">{item.text}</h4>
                      </div>
                      
                      <button
                        onClick={() => deleteBucketItem(item.id)}
                        className="p-1 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                        title="Delete Goal"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[10px] font-bold text-emerald-500 uppercase">
                        <span>Achieved</span>
                        <span>100%</span>
                      </div>
                      <div className="w-full h-1.5 bg-emerald-500/20 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full w-full" />
                      </div>
                    </div>

                    <button
                      onClick={() => handleToggleComplete(item.id, item.completed)}
                      className="w-full py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 border border-emerald-500 text-[11px] font-extrabold text-white transition-all flex items-center justify-center gap-1 shadow-sm"
                    >
                      <Check size={14} />
                      <span>Dream Achieved!</span>
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
