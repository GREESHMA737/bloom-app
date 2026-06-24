import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, 
  Trash2, 
  Lock, 
  Unlock, 
  Calendar,
  Hourglass,
  Send,
  Heart,
  ChevronLeft,
  PenTool,
  Clock,
  Sparkles
} from 'lucide-react';
import { useBloom } from '../../context/BloomContext';
import GlassCard from '../../components/GlassCard';

// 6 Premium physical paper themes
const PAPER_THEMES = [
  { 
    id: 'vintage-coffee', 
    name: 'Vintage Coffee', 
    class: 'bg-[#ecdcc2] text-[#2b1b0b] border-[#cbd5e1]', 
    lineColor: 'rgba(150, 110, 70, 0.25)', 
    emoji: '☕📜',
    bgStyle: {
      background: 'radial-gradient(circle at 10% 20%, rgba(90,40,10,0.06) 0%, transparent 20%), radial-gradient(circle at 80% 70%, rgba(90,40,10,0.06) 0%, transparent 25%), #ecdcc2',
      boxShadow: 'inset 0 0 40px rgba(0,0,0,0.08)'
    },
    decor: '🍂'
  },
  { 
    id: 'elegant-rose', 
    name: 'Elegant Rose', 
    class: 'bg-[#fff5f5] text-[#4c0519] border-[#fbcfe8]', 
    lineColor: 'rgba(244, 114, 182, 0.2)', 
    emoji: '🌹❤️',
    bgStyle: {
      background: 'linear-gradient(135deg, #fff5f5 0%, #ffeef0 100%)',
    },
    decor: '🌹'
  },
  { 
    id: 'floral-stationery', 
    name: 'Floral Wash', 
    class: 'bg-[#f5f0ff] text-[#3b0764] border-[#ddd6fe]', 
    lineColor: 'rgba(139, 92, 246, 0.18)', 
    emoji: '🌸🌿',
    bgStyle: {
      background: 'linear-gradient(135deg, #f5f0ff 0%, #eef2ff 100%)',
    },
    decor: '🌸'
  },
  { 
    id: 'old-diary', 
    name: 'Old Diary', 
    class: 'bg-[#faf7ee] text-[#1c1917] border-[#e7e5e4]', 
    lineColor: 'rgba(120, 113, 108, 0.2)', 
    emoji: '📓✍️',
    bgStyle: {
      background: '#faf7ee',
      borderLeft: '2px solid rgba(220, 38, 38, 0.35)' // Red margin line
    },
    decor: '📝'
  },
  { 
    id: 'romantic-parchment', 
    name: 'Parchment Scroll', 
    class: 'bg-[#f4ebd0] text-[#451a03] border-[#eab308]', 
    lineColor: 'rgba(180, 83, 9, 0.2)', 
    emoji: '📜✨',
    bgStyle: {
      background: 'radial-gradient(circle, #fcf6e5 20%, #f4ebd0 100%)',
      boxShadow: '0 0 30px rgba(0,0,0,0.05) inset'
    },
    decor: '✨'
  },
  { 
    id: 'minimal-cream', 
    name: 'Minimal Cream', 
    class: 'bg-[#fafaf6] text-[#1c1917] border-[#ffd700]/20', 
    lineColor: 'rgba(28, 25, 23, 0.08)', 
    emoji: '⚜️🕯️',
    bgStyle: {
      background: '#fafaf6',
      border: '4px double rgba(197, 160, 89, 0.35)'
    },
    decor: '⚜️'
  }
];

const getTomorrowDateTimeString = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setMinutes(tomorrow.getMinutes() - tomorrow.getTimezoneOffset());
  return tomorrow.toISOString().slice(0, 16);
};

export default function LettersToFuture() {
  const { 
    letters, 
    addLetter, 
    deleteLetter 
  } = useBloom();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [openDate, setOpenDate] = useState(getTomorrowDateTimeString());
  const [paperStyle, setPaperStyle] = useState('vintage-coffee');
  const [fontStyle, setFontStyle] = useState('font-stationery-caveat');
  const [viewMode, setViewMode] = useState('mailbox'); // 'mailbox' or 'writing'
  
  // Animation states
  const [isFolding, setIsFolding] = useState(false);
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [unsealStep, setUnsealStep] = useState('sealed'); // 'sealed' -> 'breaking' -> 'opening' -> 'unfolded'
  const [shakingId, setShakingId] = useState(null);
  const [petals, setPetals] = useState([]);

  // Timer Tick Trigger to update countdowns
  const [timeTick, setTimeTick] = useState(Date.now());
  useEffect(() => {
    const interval = setInterval(() => setTimeTick(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Generate random petals/particles on desk background
  useEffect(() => {
    if (viewMode === 'writing') {
      const items = Array.from({ length: 12 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        scale: Math.random() * 0.6 + 0.4,
        rot: Math.random() * 360,
        delay: Math.random() * 5
      }));
      setPetals(items);
    } else {
      setPetals([]);
    }
  }, [viewMode]);

  // Parse custom stationery metadata block from letter content
  const parseLetterContent = (rawContent) => {
    let style = 'vintage-coffee';
    let font = 'font-stationery-caveat';
    let text = rawContent || '';

    if (rawContent && rawContent.startsWith('{')) {
      try {
        const endIdx = rawContent.indexOf('}');
        const metaStr = rawContent.substring(0, endIdx + 1);
        const meta = JSON.parse(metaStr);
        style = meta.paperStyle || 'vintage-coffee';
        font = meta.fontStyle || 'font-stationery-caveat';
        text = rawContent.substring(endIdx + 1).replace(/^\n/, '');
      } catch (e) {
        // ignore
      }
    }
    return { style, font, text };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !openDate) return;

    const d = new Date(openDate);
    if (isNaN(d.getTime())) return;

    setIsFolding(true);

    // After folding animation, seal it in Supabase/localStorage
    setTimeout(() => {
      const serializedContent = JSON.stringify({ paperStyle, fontStyle }) + "\n" + content;
      addLetter(title, serializedContent, d.toISOString());
      
      setTitle('');
      setContent('');
      setOpenDate(getTomorrowDateTimeString());
      setIsFolding(false);
      setViewMode('mailbox');
    }, 2800); // sync with fold animation sequences
  };

  const getCountdown = (openDateStr) => {
    const diff = new Date(openDateStr) - timeTick;
    if (diff <= 0) return null;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
  };

  const handleLetterClick = (lettr) => {
    const isLocked = new Date(lettr.openDate) > new Date();
    if (isLocked) {
      setShakingId(lettr.id);
      setTimeout(() => setShakingId(null), 500);
      return;
    }

    setSelectedLetter(lettr);
    setUnsealStep('sealed');
  };

  const currentThemeObj = PAPER_THEMES.find(t => t.id === paperStyle) || PAPER_THEMES[0];

  // Group letters into locked/unlocked
  const lockedLetters = letters.filter(l => getCountdown(l.openDate) !== null);

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] overflow-hidden">
      
      {/* Stationery Styles Style block */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&family=Dancing+Script:wght@400;700&family=Homemade+Apple&family=Reenie+Beanie&family=Sacramento&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap');

        .font-stationery-caveat {
          font-family: 'Caveat', cursive, sans-serif;
          font-size: 1.45rem;
          line-height: 32px;
        }

        .font-stationery-dancing {
          font-family: 'Dancing Script', cursive, sans-serif;
          font-size: 1.4rem;
          line-height: 32px;
        }

        .font-stationery-apple {
          font-family: 'Homemade Apple', cursive, sans-serif;
          font-size: 1.05rem;
          line-height: 38px;
        }

        .font-stationery-reenie {
          font-family: 'Reenie Beanie', cursive, sans-serif;
          font-size: 1.7rem;
          line-height: 28px;
        }

        .font-stationery-sacramento {
          font-family: 'Sacramento', cursive, sans-serif;
          font-size: 1.7rem;
          line-height: 34px;
        }

        .bg-desk-wood {
          background-color: #1a1412;
          background-image: 
            linear-gradient(90deg, rgba(255,255,255,0.01) 1px, transparent 1px),
            linear-gradient(rgba(0,0,0,0.15) 2px, transparent 2px);
          background-size: 150px 100%, 100% 80px;
          box-shadow: inset 0 0 100px rgba(0,0,0,0.85);
        }

        /* Ruled lines helper */
        .stationery-lines {
          background-size: 100% 32px;
          line-height: 32px;
        }

        .envelope-flap {
          clip-path: polygon(0 0, 50% 55%, 100% 0);
        }

        .envelope-back {
          clip-path: polygon(0 0, 0 100%, 100% 100%, 100% 0, 50% 55%);
        }

        .envelope-seams {
          background-image: 
            linear-gradient(28deg, rgba(0,0,0,0.03) 50%, transparent 50%),
            linear-gradient(-28deg, rgba(0,0,0,0.03) 50%, transparent 50%);
        }
      `}</style>

      {/* Main Container */}
      <AnimatePresence mode="wait">
        {viewMode === 'mailbox' ? (
          /* ================= MAILBOX GRID VIEW ================= */
          <motion.div
            key="mailbox"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto h-full overflow-y-auto custom-scrollbar"
          >
            <div className="flex items-center justify-between pb-2 border-b border-black/5 dark:border-white/5">
              <div>
                <h3 className="font-extrabold text-sm text-gray-400 dark:text-gray-500 uppercase tracking-widest">My Sealed Mailbox</h3>
                <p className="text-xs text-gray-500">Physical letters to unlock in the future.</p>
              </div>

              <button
                onClick={() => setViewMode('writing')}
                className="py-2.5 px-5 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-900 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-900/60 border border-blue-300/40 font-black text-xs transition-all flex items-center gap-1.5 shadow-sm"
              >
                <PenTool size={14} />
                <span>Write New Letter</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Mailbox Envelope Grid (Left/8 Columns) */}
              <div className="lg:col-span-8">
                {letters.length === 0 ? (
                  <div className="text-center py-24 text-xs text-gray-400 dark:text-gray-500 border border-dashed border-white/20 rounded-3xl p-6 bg-white/5">
                    No letters mailed yet. Sit at your desk and write a letter to future you! ✉️✍️
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {letters.map(lettr => {
                      const countdown = getCountdown(lettr.openDate);
                      const isLocked = countdown !== null;
                      const { style } = parseLetterContent(lettr.content);
                      
                      // Detailed styles for physical envelopes
                      const envelopeThemes = {
                        'vintage-coffee': 'bg-[#ebdcb9] border-[#d4c399] text-amber-950',
                        'elegant-rose': 'bg-[#fff0f2] border-[#fbcfe8] text-rose-950',
                        'floral-stationery': 'bg-[#f4efff] border-[#ddd6fe] text-purple-950',
                        'old-diary': 'bg-[#faf8f2] border-[#e4dfd0] text-stone-900',
                        'romantic-parchment': 'bg-[#f6ebd2] border-[#ebd7b1] text-amber-900',
                        'minimal-cream': 'bg-[#fcfcfa] border-[#ebd49f] text-stone-900',
                      };
                      const envClass = envelopeThemes[style] || envelopeThemes['vintage-coffee'];

                      return (
                        <motion.div
                          key={lettr.id}
                          onClick={() => handleLetterClick(lettr)}
                          animate={shakingId === lettr.id ? {
                            x: [-6, 6, -6, 6, 0],
                            transition: { duration: 0.4 }
                          } : {}}
                          whileHover={{ y: -6, scale: 1.02, rotate: -0.5 }}
                          className={`relative aspect-[1.58/1] cursor-pointer rounded-xl border p-6 flex flex-col justify-between overflow-hidden shadow-lg group transition-all duration-300 ${envClass}`}
                        >
                          {/* Envelope Back Folds Visual (Clip path diagonals) */}
                          <div className="absolute inset-0 envelope-seams opacity-20 pointer-events-none" />

                          {/* Airmail edges pattern */}
                          <div className="absolute inset-x-0 top-0 h-1.5" style={{
                            backgroundImage: 'repeating-linear-gradient(45deg, #ef4444, #ef4444 8px, #ffffff 8px, #ffffff 16px, #3b82f6 16px, #3b82f6 24px, #ffffff 24px, #ffffff 32px)',
                            opacity: 0.85
                          }} />

                          {/* Postmark stamp */}
                          <div className="absolute top-5 right-5 w-12 h-12 border-2 border-dashed border-current/20 rounded-full flex flex-col items-center justify-center rotate-12 opacity-35 select-none pointer-events-none text-[5px] font-bold text-center uppercase tracking-wide">
                            <span className="leading-none mb-0.5">BLOOM</span>
                            <span className="scale-75">POSTAL</span>
                            <span className="text-[4px] opacity-75 mt-0.5">2026</span>
                          </div>

                          {/* Header details */}
                          <div className="space-y-1 relative z-10">
                            <span className="text-[7px] font-black uppercase tracking-widest text-current/50 block">Dearest tomorrow</span>
                            <h4 className="font-extrabold text-sm tracking-tight truncate pr-14 font-serif">{lettr.title}</h4>
                            <span className="text-[8px] flex items-center gap-1 opacity-60 font-bold font-mono">
                              <Calendar size={9} />
                              <span>Sent: {new Date(lettr.openDate).toLocaleDateString()}</span>
                            </span>
                          </div>

                          {/* Wax Seal Overlay center */}
                          <div className="relative z-10 flex flex-col items-center justify-center my-1.5">
                            {isLocked ? (
                              <div className="w-12 h-12 rounded-full bg-[#8b1a1a] border-4 border-[#731313] shadow-md flex items-center justify-center text-amber-100/90 relative group-hover:scale-105 transition-transform">
                                <Lock size={14} />
                                <div className="absolute -inset-0.5 rounded-full border border-dashed border-[#8b1a1a]/40 animate-spin-slow" />
                              </div>
                            ) : (
                              <div className="w-12 h-12 rounded-full bg-[#c27c0e] border-4 border-[#a16207] shadow-md flex items-center justify-center text-amber-50 relative animate-pulse">
                                <Unlock size={14} />
                              </div>
                            )}
                          </div>

                          {/* Footer details */}
                          <div className="relative z-10 flex items-center justify-between border-t border-current/10 pt-2.5 text-[8px] font-black uppercase tracking-wider opacity-75">
                            <span className="flex items-center gap-0.5 font-mono">
                              <span className="text-rose-500">🌸</span>
                              <span>Envelope #{lettr.id.split('-')[1]?.substring(0,4)}</span>
                            </span>
                            
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteLetter(lettr.id);
                              }}
                              className="p-1 rounded hover:bg-red-500/10 text-current transition-colors"
                              title="Destroy Letter"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Animated Side Timer Panel (Right/4 Columns) */}
              <div className="lg:col-span-4">
                <GlassCard className="p-6 bg-gradient-to-br from-amber-500/5 via-transparent to-transparent space-y-5">
                  <div className="border-b border-black/5 dark:border-white/5 pb-2 flex items-center justify-between">
                    <h4 className="font-extrabold text-xs text-gray-400 dark:text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                      <Hourglass size={14} className="text-amber-500 animate-spin-slow" />
                      <span>Timeline of Sealing</span>
                    </h4>
                    <span className="text-[10px] font-black text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full">
                      {lockedLetters.length} Locked
                    </span>
                  </div>

                  {lockedLetters.length === 0 ? (
                    <div className="text-center py-8 text-[10px] text-gray-400 dark:text-gray-500 italic">
                      No locked envelopes. Everything is open! 🔓
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-[420px] overflow-y-auto custom-scrollbar pr-1">
                      {lockedLetters.map(lettr => {
                        const countdown = getCountdown(lettr.openDate);
                        if (!countdown) return null;
                        
                        return (
                          <div 
                            key={lettr.id}
                            className="p-3 bg-black/5 dark:bg-white/5 rounded-xl border border-black/5 flex items-center justify-between gap-3 group hover:bg-black/10 transition-colors"
                          >
                            <div className="min-w-0 flex-1 space-y-1">
                              <span className="font-bold text-xs text-gray-800 dark:text-gray-200 block truncate font-serif">
                                {lettr.title}
                              </span>
                              <div className="flex items-center gap-1.5 text-[9px] text-gray-500">
                                <Clock size={10} className="text-amber-500" />
                                <span className="font-mono font-bold tracking-tight">
                                  {countdown.days}d {countdown.hours}h {countdown.minutes}m {countdown.seconds}s
                                </span>
                              </div>
                            </div>
                            
                            <div className="w-8 h-8 rounded-full bg-red-950/20 text-red-500 flex items-center justify-center shrink-0 border border-red-500/10 animate-pulse">
                              <Lock size={12} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </GlassCard>
              </div>

            </div>
          </motion.div>
        ) : (
          /* ================= IMMERSIVE WRITING DESK VIEW ================= */
          <motion.div
            key="writing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 w-full h-full bg-desk-wood flex flex-col justify-between items-center p-4 md:p-6 z-30 select-none overflow-hidden"
          >
            {/* Ambient desk animations: petals and glowing dust particles */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
              {petals.map(petal => (
                <motion.div
                  key={petal.id}
                  animate={{ 
                    y: [0, 8, 0],
                    x: [0, 4, 0],
                    rotate: [petal.rot, petal.rot + 15, petal.rot]
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 5 + petal.id, 
                    delay: petal.delay, 
                    ease: "easeInOut" 
                  }}
                  className="absolute text-xl opacity-25"
                  style={{
                    left: `${petal.x}%`,
                    top: `${petal.y}%`,
                    transform: `scale(${petal.scale})`
                  }}
                >
                  {currentThemeObj.decor}
                </motion.div>
              ))}
              <div className="absolute top-0 bottom-0 left-0 right-0 bg-gradient-to-t from-transparent via-amber-500/5 to-transparent blur-2xl animate-pulse pointer-events-none" style={{ animationDuration: '8s' }} />
            </div>

            {/* Back to mailbox and delivery header */}
            <div className="w-full max-w-3xl flex items-center justify-between relative z-10 text-stone-300">
              <button
                onClick={() => setViewMode('mailbox')}
                className="flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors shadow-md"
              >
                <ChevronLeft size={14} />
                <span>Leave Desk</span>
              </button>

              <div className="text-center font-serif italic text-xs md:text-sm text-amber-200/70">
                "Writing a letter to tomorrow... {currentThemeObj.emoji}"
              </div>
            </div>

            {/* Immersive Paper stationery area */}
            <div className="w-full max-w-2xl flex-1 flex items-center justify-center relative py-4 z-10 min-h-0">
              
              {/* The Paper Sheet Editor */}
              <AnimatePresence mode="wait">
                {!isFolding ? (
                  <motion.div
                    key="unfolded-stationery"
                    initial={{ scale: 0.9, opacity: 0, rotateY: -15 }}
                    animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                    exit={{ 
                      scale: 0.5, 
                      y: 80, 
                      opacity: 0, 
                      rotateX: 45,
                      transition: { duration: 0.8 } 
                    }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    style={currentThemeObj.bgStyle}
                    className={`w-full max-w-xl h-full max-h-[72vh] flex flex-col p-8 md:p-12 shadow-2xl relative border ${currentThemeObj.class} rounded-sm overflow-hidden`}
                  >
                    {/* Ring Binder holes on left side for diary, diary style margins */}
                    {paperStyle === 'old-diary' && (
                      <div className="absolute top-0 bottom-0 left-2 w-3 flex flex-col justify-around py-8 pointer-events-none">
                        {Array.from({ length: 8 }).map((_, h) => (
                          <div key={h} className="w-2.5 h-2.5 rounded-full bg-stone-300 border border-stone-400 shadow-inner" />
                        ))}
                      </div>
                    )}

                    {/* Paper content layout */}
                    <div className="flex flex-col h-full space-y-4 relative z-10 pl-4 min-h-0">
                      
                      {/* Letter Subject Title Input - Explicit Light Style */}
                      <input 
                        type="text" 
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Letter Subject (e.g. Open when you turn 25)"
                        className="bg-[#fafaf6] text-stone-900 border border-stone-300 rounded-xl px-3.5 py-2 text-sm font-bold focus:ring-2 focus:ring-amber-500/20 focus:outline-none w-full shadow-sm placeholder-stone-400 font-serif"
                        maxLength={50}
                        style={{ color: '#1c1917' }}
                      />

                      {/* Controls Row: Font Select & Datepicker */}
                      <div className="flex flex-wrap items-center gap-4 text-xs font-serif text-stone-800">
                        {/* Font Select */}
                        <div className="flex items-center gap-1.5">
                          <span>Font:</span>
                          <select
                            value={fontStyle}
                            onChange={(e) => setFontStyle(e.target.value)}
                            className="bg-[#fafaf6] text-stone-900 border border-stone-300 rounded-xl px-2.5 py-1 text-xs font-bold focus:outline-none cursor-pointer shadow-sm"
                          >
                            <option value="font-stationery-caveat">Caveat (Casual)</option>
                            <option value="font-stationery-dancing">Dancing Script (Elegant)</option>
                            <option value="font-stationery-apple">Homemade Apple (Ink)</option>
                            <option value="font-stationery-reenie">Reenie Beanie (Scribble)</option>
                            <option value="font-stationery-sacramento">Sacramento (Calligraphy)</option>
                          </select>
                        </div>

                        {/* Datepicker */}
                        <div className="flex items-center gap-1.5">
                          <span>Deliver on:</span>
                          <input 
                            type="datetime-local" 
                            value={openDate}
                            onChange={(e) => setOpenDate(e.target.value)}
                            style={{ colorScheme: 'light', color: '#1c1917' }}
                            className="bg-[#fafaf6] text-stone-900 border border-stone-300 rounded-xl px-2.5 py-1 focus:ring-2 focus:ring-amber-500/20 focus:outline-none text-xs font-bold w-48 shadow-sm font-sans"
                            required
                          />
                        </div>
                      </div>

                      {/* Main ruled letter body */}
                      <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Dearest future self,&#13;Pour your heart out. Tell yourself about your current struggles, friends, songs you play, and what you hope you will have learned..."
                        className={`flex-1 w-full bg-transparent border-0 focus:ring-0 focus:outline-none placeholder-stone-400/50 resize-none custom-scrollbar leading-loose stationery-lines text-sm ${fontStyle}`}
                        style={{ 
                          backgroundImage: `linear-gradient(${currentThemeObj.lineColor} 1px, transparent 1px)`,
                          color: '#1c1917' // Explicit dark text color
                        }}
                      />

                      {/* Seal button */}
                      <div className="flex justify-end pt-2">
                        <button
                          onClick={handleSubmit}
                          disabled={!title.trim() || !content.trim() || !openDate}
                          className="py-2.5 px-6 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <Send size={13} />
                          <span>Fold, Seal & Mail Letter</span>
                        </button>
                      </div>

                    </div>
                  </motion.div>
                ) : (
                  /* ================= 3D FOLDING ENVELOPE ANIMATION VIEW ================= */
                  <motion.div
                    key="folding-envelope"
                    initial={{ scale: 0.6, opacity: 0, rotate: -45 }}
                    animate={{ 
                      scale: [0.6, 1.1, 1],
                      opacity: 1, 
                      rotate: 0,
                      transition: { duration: 1.2 }
                    }}
                    className="relative w-80 h-52 flex items-center justify-center bg-[#f0ebd7] border border-[#d3cbb5] rounded-xl shadow-2xl overflow-hidden"
                  >
                    {/* Retro borders */}
                    <div className="absolute inset-0 border-[6px] border-double border-[#dcd0bf]/40" />

                    {/* Paper folding sequence visual */}
                    <motion.div 
                      initial={{ y: -60, scaleY: 0.8, opacity: 0.9 }}
                      animate={{ 
                        y: [0, 10, 20], 
                        scaleY: [0.8, 0.4, 0],
                        opacity: [0.9, 0.5, 0],
                        transition: { delay: 0.4, duration: 0.8 } 
                      }}
                      className="absolute w-52 h-44 bg-[#faf8f0] border border-stone-300 shadow-md z-10 flex flex-col p-4 space-y-1.5 pointer-events-none"
                    >
                      <div className="w-12 h-1 bg-stone-300 rounded" />
                      <div className="w-20 h-1 bg-stone-200 rounded" />
                      <div className="w-full h-1 bg-stone-100 rounded" />
                      <div className="w-full h-1 bg-stone-100 rounded" />
                    </motion.div>

                    {/* Back of Envelope flaps (drawn via CSS clip path) */}
                    <div className="absolute inset-0 bg-[#e4dfc5] border border-[#d6cfb3] envelope-back z-0" />
                    
                    {/* Top closing flap */}
                    <motion.div 
                      initial={{ rotateX: 0 }}
                      animate={{ 
                        rotateX: [0, 90, 180],
                        transition: { delay: 1.2, duration: 0.6 }
                      }}
                      className="absolute inset-x-0 top-0 h-24 bg-[#ebdcb9] border-b border-[#d6cfb3] origin-top envelope-flap z-20"
                    />

                    {/* Crimson Wax Seal overlay stamps down */}
                    <motion.div
                      initial={{ scale: 2.5, opacity: 0, rotate: 180 }}
                      animate={{ 
                        scale: 1, 
                        opacity: 1, 
                        rotate: 0,
                        transition: { delay: 1.8, duration: 0.5, type: "spring", stiffness: 200 }
                      }}
                      className="absolute w-12 h-12 rounded-full bg-[#8b1a1a] border-4 border-[#731313] shadow-md flex items-center justify-center text-amber-200 z-30"
                    >
                      <Lock size={15} />
                    </motion.div>

                    {/* Fly away stamp indicator */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ 
                        opacity: [0, 1, 0], 
                        y: [-10, -30],
                        transition: { delay: 1.9, duration: 0.7 } 
                      }}
                      className="absolute text-[10px] font-black text-amber-600 bg-white px-2.5 py-0.5 rounded border border-amber-200 z-40"
                    >
                      SEALED ✨
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>

            {/* Stationery Paper Styles Picker (Desk footer) */}
            {!isFolding && (
              <div className="w-full max-w-3xl bg-black/45 backdrop-blur-md border border-white/10 p-3.5 rounded-2xl flex flex-wrap items-center justify-center gap-4 relative z-10 text-stone-300">
                <span className="text-[10px] font-bold text-amber-100/60 uppercase tracking-widest">Select Stationery Sheet:</span>
                <div className="flex gap-2.5 overflow-x-auto max-w-full py-1">
                  {PAPER_THEMES.map(theme => (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => setPaperStyle(theme.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all shrink-0 flex items-center gap-1.5 ${
                        paperStyle === theme.id 
                          ? 'border-theme-primary bg-theme-primary/10 text-theme-primary scale-95 shadow-inner' 
                          : 'border-white/10 text-stone-300 hover:bg-white/5'
                      }`}
                    >
                      <span>{theme.emoji.substring(2)}</span>
                      <span>{theme.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

          </motion.div>
        )}
      </AnimatePresence>

      {/* Unsealed Envelope Content Modal Dialog (Unboxing layout sequence) */}
      <AnimatePresence>
        {selectedLetter && (() => {
          const { style, font, text } = parseLetterContent(selectedLetter.content);
          const theme = PAPER_THEMES.find(t => t.id === style) || PAPER_THEMES[0];
          
          return (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-lg z-50 flex items-center justify-center p-4">
              
              {unsealStep === 'sealed' ? (
                /* Envelope Sealed State */
                <motion.div
                  initial={{ scale: 0.8, opacity: 0, rotateY: -30 }}
                  animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="relative w-96 h-64 bg-[#ebdcb9] border-2 border-[#d4c399] rounded-2xl shadow-2xl overflow-hidden flex flex-col justify-between p-6 text-amber-950"
                >
                  <div className="absolute inset-0 envelope-seams opacity-20 pointer-events-none" />
                  
                  {/* Stamp */}
                  <div className="absolute top-5 right-5 w-12 h-12 border border-dashed border-amber-950/20 rounded-full flex flex-col items-center justify-center rotate-12 opacity-35 text-[5px] font-bold">
                    UNSEAL
                  </div>

                  <div className="space-y-1 relative z-10 pt-2 text-center">
                    <span className="text-[8px] font-black uppercase tracking-widest text-amber-900/50">Postbox Delivery</span>
                    <h3 className="text-lg font-extrabold font-serif pr-2">{selectedLetter.title}</h3>
                  </div>

                  {/* Wax stamp to click to open */}
                  <div className="flex flex-col items-center justify-center relative z-10">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        setUnsealStep('breaking');
                        setTimeout(() => {
                          setUnsealStep('opening');
                        }, 800);
                        setTimeout(() => {
                          setUnsealStep('unfolded');
                        }, 1800);
                      }}
                      className="w-14 h-14 rounded-full bg-[#c27c0e] border-4 border-[#a16207] shadow-lg flex items-center justify-center text-amber-100 text-xs font-bold"
                    >
                      <span>🔓</span>
                    </motion.button>
                    <span className="text-[8px] font-black uppercase tracking-widest text-[#a16207] mt-2 animate-pulse">
                      Tap Wax Seal to Open
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-[8px] font-bold border-t border-amber-950/10 pt-2 opacity-70">
                    <span>Mailed to the future</span>
                    <button 
                      onClick={() => setSelectedLetter(null)}
                      className="text-amber-900 hover:underline"
                    >
                      Keep Sealed
                    </button>
                  </div>
                </motion.div>
              ) : unsealStep === 'breaking' || unsealStep === 'opening' ? (
                /* Unseal Flap animation loading mockup */
                <div className="relative w-96 h-64 flex items-center justify-center bg-[#ebdcb9] border border-[#d4c399] rounded-2xl shadow-2xl overflow-hidden">
                  <div className="absolute inset-0 envelope-seams opacity-20 pointer-events-none" />
                  <motion.div 
                    animate={unsealStep === 'opening' ? { y: -120, opacity: 0 } : {}}
                    transition={{ duration: 0.8 }}
                    className="w-48 h-40 bg-[#faf8f0] border border-stone-300 shadow-md z-10 flex flex-col p-4 space-y-1"
                  >
                    <div className="w-12 h-1 bg-stone-300 rounded" />
                    <div className="w-full h-1 bg-stone-200 rounded" />
                  </motion.div>
                  
                  {/* Flap rotating up */}
                  <div className="absolute inset-0 bg-[#e4dfc5] envelope-back z-0" />
                  <motion.div 
                    initial={{ rotateX: 180 }}
                    animate={unsealStep === 'opening' ? { rotateX: 0 } : { rotateX: 180 }}
                    transition={{ duration: 0.6 }}
                    className="absolute inset-x-0 top-0 h-24 bg-[#ebdcb9] border-b border-[#d6cfb3] origin-top envelope-flap z-20"
                  />
                  
                  {/* Broken Wax Seal */}
                  <motion.div
                    animate={{ scale: 0, opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute w-14 h-14 rounded-full bg-[#c27c0e] border-4 border-[#a16207] flex items-center justify-center text-amber-100 z-30"
                  >
                    💥
                  </motion.div>
                </div>
              ) : (
                /* Letter Unfolded Fullscreen Layer Page */
                <motion.div 
                  initial={{ scale: 0.75, opacity: 0, y: 50 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.75, opacity: 0, y: 50 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  style={theme.bgStyle}
                  className={`w-full max-w-xl rounded-2xl p-8 md:p-12 relative overflow-hidden shadow-2xl flex flex-col max-h-[85vh] ${theme.class}`}
                >
                  {/* Spiral Ring bindings decoration on left side for diary */}
                  {style === 'old-diary' && (
                    <div className="absolute top-0 bottom-0 left-1 w-4 bg-black/5 flex flex-col justify-around py-8 pointer-events-none">
                      {Array.from({ length: 9 }).map((_, r) => (
                        <div key={r} className="w-2.5 h-2.5 rounded-full bg-stone-300 border border-stone-400 shadow-inner" />
                      ))}
                    </div>
                  )}

                  {/* Left Margin red line for school notebook style */}
                  {style === 'old-diary' && (
                    <div className="absolute top-0 bottom-0 left-7 w-[1px] bg-red-400/40 z-20" />
                  )}

                  {/* Background themed decorations */}
                  <div className="absolute top-4 right-6 text-4xl opacity-10 pointer-events-none z-0 select-none font-bold">
                    {style === 'vintage-coffee' && '☕☕'}
                    {style === 'elegant-rose' && '🌹🌹'}
                    {style === 'floral-stationery' && '🌸🌸'}
                    {style === 'old-diary' && '📓✍️'}
                    {style === 'romantic-parchment' && '📜✨'}
                    {style === 'minimal-cream' && '⚜️🕯️'}
                  </div>

                  <div className="relative z-10 flex flex-col space-y-5 pl-6 h-full min-h-0">
                    
                    {/* Letter Header */}
                    <div className="flex items-center justify-between border-b border-current/10 pb-3 font-sans opacity-85 text-stone-700">
                      <div className="flex items-center gap-1.5">
                        <Mail size={15} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Delivered Letter</span>
                      </div>
                      
                      <button 
                        onClick={() => setSelectedLetter(null)}
                        className="py-1 px-3 rounded-xl bg-black/10 hover:bg-black/15 text-xs font-bold text-current transition-colors"
                      >
                        Re-seal Letter
                      </button>
                    </div>

                    {/* Letter Typography */}
                    <div className="space-y-4 flex-1 flex flex-col min-h-0">
                      <div className="text-stone-900">
                        <h3 className="text-xl font-extrabold tracking-tight font-sans leading-none">{selectedLetter.title}</h3>
                        <div className="text-[9px] opacity-60 font-bold font-sans mt-1">
                          Delivered on {new Date(selectedLetter.openDate).toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                      </div>

                      <div className="flex-1 py-2 min-h-0 overflow-y-auto custom-scrollbar">
                        <p className={`text-sm leading-loose whitespace-pre-wrap text-stone-900 ${font}`}>
                          {text}
                        </p>
                      </div>
                    </div>

                    {/* Letter Footer */}
                    <div className="pt-3 border-t border-current/15 flex items-center justify-between font-sans opacity-85 text-stone-700">
                      <span className="text-[10px] font-medium opacity-50 italic">With all your hopes and dreams...</span>
                      
                      <button 
                        onClick={() => {
                          deleteLetter(selectedLetter.id);
                          setSelectedLetter(null);
                        }}
                        className="py-1.5 px-3 rounded-xl hover:bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-bold transition-all flex items-center gap-1"
                      >
                        <Trash2 size={13} />
                        <span>Destroy Letter</span>
                      </button>
                    </div>

                  </div>

                </motion.div>
              )}
            </div>
          );
        })()}
      </AnimatePresence>

    </div>
  );
}
