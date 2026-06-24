import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Trash2, 
  Lock, 
  Unlock, 
  Calendar,
  Hourglass,
  Camera,
  Image as ImageIcon,
  Key,
  X,
  ChevronLeft,
  Settings,
  Clock,
  Upload
} from 'lucide-react';
import { useBloom } from '../../context/BloomContext';
import GlassCard from '../../components/GlassCard';

// Stock presets for capsules
const CAPSULE_PRESETS = [
  'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=600',
];

// 6 Premium paper themes
const PAPER_THEMES = [
  { id: 'vintage-coffee', name: 'Coffee ☕', class: 'bg-[#ecdcc2] text-[#2b1b0b]', emoji: '☕📜' },
  { id: 'elegant-rose', name: 'Rose 🌹', class: 'bg-[#fff5f5] text-[#4c0519]', emoji: '🌹❤️' },
  { id: 'floral-stationery', name: 'Floral 🌸', class: 'bg-[#f5f0ff] text-[#3b0764]', emoji: '🌸🌿' },
  { id: 'old-diary', name: 'Diary 📓', class: 'bg-[#faf7ee] text-[#1c1917]', emoji: '📓✍️' },
  { id: 'romantic-parchment', name: 'Scroll 📜', class: 'bg-[#f4ebd0] text-[#451a03]', emoji: '📜✨' },
  { id: 'minimal-cream', name: 'Cream ⚜️', class: 'bg-[#fafaf6] text-[#1c1917]', emoji: '⚜️🕯️' }
];

// 4 Container Vault box models
const CONTAINER_THEMES = [
  { id: 'vintage-chest', name: 'Treasure Chest 🪵', emoji: '🪵🔑' },
  { id: 'glass-jar', name: 'Apothecary Jar 🫙', emoji: '🫙✨' },
  { id: 'envelope', name: 'String Parcel ✉️', emoji: '✉️📦' },
  { id: 'steel-lockbox', name: 'Steel Lockbox 🔒', emoji: '🔒🎛️' }
];

const getTomorrowDateTimeString = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setMinutes(tomorrow.getMinutes() - tomorrow.getTimezoneOffset());
  return tomorrow.toISOString().slice(0, 16);
};

export default function TimeCapsule() {
  const { 
    timeCapsules, 
    addTimeCapsule, 
    deleteCapsule 
  } = useBloom();

  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [photo, setPhoto] = useState('');
  const [unlockDate, setUnlockDate] = useState(getTomorrowDateTimeString());
  const [paperStyle, setPaperStyle] = useState('vintage-coffee');
  const [capsuleStyle, setCapsuleStyle] = useState('vintage-chest');
  const [fontStyle, setFontStyle] = useState('font-stationery-caveat');
  const [viewMode, setViewMode] = useState('vault'); // 'vault' or 'burying'
  
  // Animation states
  const [isBurying, setIsBurying] = useState(false);
  const [activeCapsule, setActiveCapsule] = useState(null);
  const [unboxStep, setUnboxStep] = useState('locked'); // 'locked' -> 'opening' -> 'unboxed'
  const [shakingId, setShakingId] = useState(null);
  const [petals, setPetals] = useState([]);
  const [photoSourceTab, setPhotoSourceTab] = useState('upload'); // Default to local gallery upload
  const [isDragging, setIsDragging] = useState(false);

  const processFile = (file) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxDim = 800;
        
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
        setPhoto(dataUrl);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      processFile(file);
    }
  };

  // Timer Tick Trigger to update countdowns
  const [timeTick, setTimeTick] = useState(Date.now());
  useEffect(() => {
    const interval = setInterval(() => setTimeTick(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Generate random petals/particles on desk background
  useEffect(() => {
    if (viewMode === 'burying') {
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

  // Parse container preference from message field
  const parseCapsuleMessage = (rawMessage) => {
    let pStyle = 'vintage-coffee';
    let cStyle = 'vintage-chest';
    let font = 'font-stationery-caveat';
    let text = rawMessage || '';

    if (rawMessage && rawMessage.startsWith('{')) {
      try {
        const endIdx = rawMessage.indexOf('}');
        const metaStr = rawMessage.substring(0, endIdx + 1);
        const meta = JSON.parse(metaStr);
        pStyle = meta.paperStyle || 'vintage-coffee';
        cStyle = meta.capsuleStyle || 'vintage-chest';
        font = meta.fontStyle || 'font-stationery-caveat';
        text = rawMessage.substring(endIdx + 1).replace(/^\n/, '');
      } catch (e) {
        // ignore
      }
    }
    return { pStyle, cStyle, font, text };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !message.trim() || !unlockDate) return;
    
    const d = new Date(unlockDate);
    if (isNaN(d.getTime())) return;
    
    setIsBurying(true);

    setTimeout(() => {
      // Serialize paper, box, and font selections inside message field
      const serializedMessage = JSON.stringify({ paperStyle, capsuleStyle, fontStyle }) + "\n" + message;
      addTimeCapsule(title, serializedMessage, photo ? [photo] : [], d.toISOString());
      
      setTitle('');
      setMessage('');
      setPhoto('');
      setUnlockDate(getTomorrowDateTimeString());
      setIsBurying(false);
      setViewMode('vault');
    }, 2800); // Burying animation sequence duration
  };

  const getCountdown = (unlockDateStr) => {
    const diff = new Date(unlockDateStr) - timeTick;
    if (diff <= 0) return null;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
  };

  const handleCapsuleClick = (capsule) => {
    const isLocked = new Date(capsule.unlockDate) > new Date();
    if (isLocked) {
      setShakingId(capsule.id);
      setTimeout(() => setShakingId(null), 500);
      return;
    }

    setActiveCapsule(capsule);
    setUnboxStep('locked');
  };

  const currentPaperObj = PAPER_THEMES.find(t => t.id === paperStyle) || PAPER_THEMES[0];

  // Locked capsules listing
  const lockedCapsules = timeCapsules.filter(c => getCountdown(c.unlockDate) !== null);

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] overflow-hidden">
      
      {/* Styles for Time Capsule Containers */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&family=Dancing+Script:wght@400;700&family=Homemade+Apple&family=Reenie+Beanie&family=Sacramento&display=swap');

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

        /* 1. Vintage Chest visual card */
        .cap-card-vintage-chest {
          background: linear-gradient(180deg, #422006 0%, #271203 100%);
          border: 2px solid #5a3014;
          box-shadow: 0 12px 24px rgba(0,0,0,0.45);
        }

        /* 2. Glass Jar visual card */
        .cap-card-glass-jar {
          background: radial-gradient(circle at 50% 20%, rgba(20, 184, 166, 0.12) 0%, rgba(20, 184, 166, 0.01) 85%);
          backdrop-filter: blur(4px);
          border: 2px solid rgba(20, 184, 166, 0.3);
          box-shadow: 0 12px 24px rgba(20, 184, 166, 0.04);
        }

        /* 3. Kraft Parcel envelope visual card */
        .cap-card-envelope {
          background: #dfc49f;
          border: 2px solid #cdb28c;
          box-shadow: 0 12px 24px rgba(0,0,0,0.18);
        }

        /* 4. Steel Lockbox safe visual card */
        .cap-card-steel-lockbox {
          background: linear-gradient(135deg, #475569 0%, #1e293b 100%);
          border: 2px solid #64748b;
          box-shadow: 0 12px 24px rgba(0,0,0,0.35);
        }

        /* Cork details */
        .cork-top {
          background-color: #8c603f;
          border: 1px solid #704c32;
        }

        /* Polaroid card border */
        .polaroid-frame {
          background-color: #fafaf6;
          border: 1px solid rgba(0,0,0,0.06);
          box-shadow: 0 8px 16px rgba(0,0,0,0.12);
        }

        /* Washi tape mockup */
        .washi-tape-polaroid {
          background-color: rgba(236, 72, 153, 0.35);
          clip-path: polygon(2% 0%, 98% 0%, 95% 50%, 98% 100%, 2% 100%, 5% 50%);
        }
      `}</style>

      {/* Main Switcher */}
      <AnimatePresence mode="wait">
        {viewMode === 'vault' ? (
          /* ================= VAULTS GALLERY VIEW ================= */
          <motion.div
            key="vaults-gallery"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto h-full overflow-y-auto custom-scrollbar"
          >
            <div className="flex items-center justify-between pb-2 border-b border-black/5 dark:border-white/5">
              <div>
                <h3 className="font-extrabold text-sm text-gray-400 dark:text-gray-500 uppercase tracking-widest">Sealed Vaults</h3>
                <p className="text-xs text-gray-500">Lock away memories, scrolls, and attachments in themed vaults.</p>
              </div>

              <button
                onClick={() => setViewMode('burying')}
                className="py-2.5 px-5 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-900 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-900/60 border border-blue-300/40 font-black text-xs transition-all flex items-center gap-1.5 shadow-sm"
              >
                <Plus size={14} />
                <span>Bury New Capsule</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Vault Chest Grid (Left/8 Columns) */}
              <div className="lg:col-span-8">
                {timeCapsules.length === 0 ? (
                  <div className="text-center py-24 text-xs text-gray-400 dark:text-gray-500 border border-dashed border-white/20 rounded-3xl p-6 bg-white/5">
                    No capsules sealed yet. Secure a note and bury it in your vault! ⏳🔒
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {timeCapsules.map(cap => {
                      const countdown = getCountdown(cap.unlockDate);
                      const isLocked = countdown !== null;
                      const { cStyle } = parseCapsuleMessage(cap.message);

                      return (
                        <motion.div
                          key={cap.id}
                          onClick={() => handleCapsuleClick(cap)}
                          animate={shakingId === cap.id ? {
                            x: [-6, 6, -6, 6, 0],
                            transition: { duration: 0.4 }
                          } : {}}
                          whileHover={{ y: -6, scale: 1.02 }}
                          className={`p-5 rounded-2xl cursor-pointer border flex flex-col justify-between min-h-[210px] text-center space-y-4 hover:shadow-xl transition-all relative overflow-hidden cap-card-${cStyle}`}
                        >
                          {/* Chest wood/metal decorations */}
                          {cStyle === 'vintage-chest' && (
                            <>
                              <div className="absolute top-2 left-2 w-4 h-4 bg-[#b45309]/30 rounded-br-md border-r border-b border-[#ffd700]/15" />
                              <div className="absolute top-2 right-2 w-4 h-4 bg-[#b45309]/30 rounded-bl-md border-l border-b border-[#ffd700]/15" />
                            </>
                          )}

                          {/* Jar cork lid */}
                          {cStyle === 'glass-jar' && (
                            <>
                              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-14 h-2.5 cork-top rounded-b-sm opacity-90 z-20" />
                              <div className="absolute inset-x-10 bottom-6 top-8 pointer-events-none bg-teal-400/5 rounded-full blur-xl animate-pulse" />
                            </>
                          )}

                          {/* Envelope parcel twine ties */}
                          {cStyle === 'envelope' && (
                            <>
                              <div className="absolute top-0 bottom-0 left-[48%] w-0.5 bg-amber-900/15" />
                              <div className="absolute left-0 right-0 top-[45%] h-0.5 bg-amber-900/15" />
                            </>
                          )}

                          {/* Lockbox hazard warning strip */}
                          {cStyle === 'steel-lockbox' && (
                            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-red-500 via-amber-500 to-red-500 opacity-60" />
                          )}

                          <div className="space-y-1 pt-1.5 relative z-10 text-stone-200">
                            <h4 className={`font-extrabold text-sm truncate ${cStyle === 'vintage-chest' || cStyle === 'steel-lockbox' ? 'text-amber-100 font-serif' : 'text-stone-900 dark:text-stone-100 font-serif'}`}>{cap.title}</h4>
                            <div className={`text-[9px] flex items-center justify-center gap-1 font-bold ${cStyle === 'vintage-chest' || cStyle === 'steel-lockbox' ? 'text-amber-200/50' : 'text-stone-500 dark:text-stone-400'}`}>
                              <Calendar size={11} />
                              <span>Lock: {new Date(cap.unlockDate).toLocaleDateString()}</span>
                            </div>
                          </div>

                          {/* Status lock dial icon */}
                          <div className="relative z-10 flex flex-col items-center justify-center py-2">
                            {isLocked ? (
                              <div className="flex flex-col items-center gap-1.5">
                                <div className={`w-11 h-11 rounded-full border-4 flex items-center justify-center relative ${
                                  cStyle === 'vintage-chest' || cStyle === 'steel-lockbox'
                                    ? 'border-amber-400/20 text-amber-300'
                                    : 'border-stone-400/30 text-stone-500'
                                }`}>
                                  <Lock size={12} />
                                  <div className="absolute inset-0.5 rounded-full border border-dashed border-current/15 animate-spin-slow" />
                                </div>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center gap-1">
                                <div className="w-11 h-11 rounded-full border-4 border-emerald-400/40 bg-emerald-500/10 flex items-center justify-center text-emerald-500 animate-pulse">
                                  <Unlock size={12} />
                                </div>
                                <span className="text-[7px] font-black uppercase text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                                  Ready
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Footer Actions */}
                          <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-2.5 text-[9px] font-bold uppercase tracking-wider text-stone-400">
                            <span>{cStyle.replace('-', ' ')}</span>
                            
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteCapsule(cap.id);
                              }}
                              className="p-1 rounded hover:bg-red-500/10 text-current transition-colors"
                              title="Discard Capsule"
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
                      {lockedCapsules.length} Locked
                    </span>
                  </div>

                  {lockedCapsules.length === 0 ? (
                    <div className="text-center py-8 text-[10px] text-gray-400 dark:text-gray-500 italic">
                      No locked capsules. Everything is open! 🔓
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-[420px] overflow-y-auto custom-scrollbar pr-1">
                      {lockedCapsules.map(cap => {
                        const countdown = getCountdown(cap.unlockDate);
                        if (!countdown) return null;
                        
                        return (
                          <div 
                            key={cap.id}
                            className="p-3 bg-black/5 dark:bg-white/5 rounded-xl border border-black/5 flex items-center justify-between gap-3 group hover:bg-black/10 transition-colors"
                          >
                            <div className="min-w-0 flex-1 space-y-1">
                              <span className="font-bold text-xs text-gray-800 dark:text-gray-200 block truncate font-serif">
                                {cap.title}
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
          /* ================= IMMERSIVE BURYING WORKSPACE ================= */
          <motion.div
            key="burying-workspace"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 w-full h-full bg-desk-wood flex flex-col justify-between items-center p-4 md:p-6 z-30 select-none overflow-hidden"
          >
            {/* Ambient workspace particles */}
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
                  {currentPaperObj.emoji}
                </motion.div>
              ))}
              <div className="absolute inset-0 bg-gradient-to-t from-transparent via-amber-500/5 to-transparent blur-2xl animate-pulse pointer-events-none" />
            </div>

            {/* Header Toolbar */}
            <div className="w-full max-w-3xl flex items-center justify-between relative z-10 text-stone-300">
              <button
                onClick={() => setViewMode('vault')}
                className="flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors shadow-md"
              >
                <ChevronLeft size={14} />
                <span>Return to Vaults</span>
              </button>

              <div className="text-center font-serif italic text-xs md:text-sm text-amber-200/70">
                "Burying a Capsule of Memories... ⏳🔒"
              </div>
            </div>

            {/* Stationery Paper sheet container */}
            <div className="w-full max-w-5xl flex-1 flex flex-col md:flex-row items-center justify-center gap-6 relative py-4 z-10 min-h-0">
              
              <AnimatePresence mode="wait">
                {!isBurying ? (
                  <>
                    {/* Paper Sheet Editor (Left side/60% width) */}
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0, rotateY: -10 }}
                      animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                      exit={{ scale: 0.5, y: 100, opacity: 0, transition: { duration: 0.8 } }}
                      className={`w-full max-w-xl h-full max-h-[70vh] flex flex-col p-8 md:p-12 shadow-2xl border ${currentPaperObj.class} rounded-sm overflow-hidden relative`}
                    >
                      {/* Red margin border line for diary */}
                      {paperStyle === 'old-diary' && (
                        <div className="absolute top-0 bottom-0 left-7 w-[1px] bg-red-400/40 z-20" />
                      )}

                      <div className="flex flex-col h-full space-y-4 relative z-10 pl-4 min-h-0">
                        {/* Title input - Explicit visibility styling */}
                        <input 
                          type="text" 
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="Capsule Title (e.g. MyCS Grad memories)"
                          className="bg-[#fafaf6] text-stone-900 border border-stone-300 rounded-xl px-3.5 py-2 text-sm font-bold focus:ring-2 focus:ring-amber-500/20 focus:outline-none w-full shadow-sm placeholder-stone-400 font-serif"
                          maxLength={50}
                          style={{ color: '#1c1917' }}
                        />

                        {/* Controls Row: Font Select & Datepicker */}
                        <div className="flex flex-wrap items-center gap-4 text-xs font-serif text-stone-850">
                          {/* Font Selector */}
                          <div className="flex items-center gap-1.5">
                            <span>Font:</span>
                            <select
                              value={fontStyle}
                              onChange={(e) => setFontStyle(e.target.value)}
                              className="bg-[#fafaf6] text-stone-900 border border-stone-300 rounded-xl px-2.5 py-1 text-xs font-bold focus:outline-none cursor-pointer shadow-sm animate-fade-in"
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
                            <span>Lock until:</span>
                            <input 
                              type="datetime-local" 
                              value={unlockDate}
                              onChange={(e) => setUnlockDate(e.target.value)}
                              style={{ colorScheme: 'light', color: '#1c1917' }}
                              className="bg-[#fafaf6] text-stone-900 border border-stone-300 rounded-xl px-2.5 py-1 focus:ring-2 focus:ring-amber-500/20 focus:outline-none text-xs font-bold w-48 shadow-sm font-sans"
                              required
                            />
                          </div>
                        </div>

                        {/* Message textarea */}
                        <textarea
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Write down the details, tips, and secrets you want to bury..."
                          className={`flex-1 w-full bg-transparent border-0 focus:ring-0 focus:outline-none placeholder-stone-400/50 resize-none custom-scrollbar leading-loose stationery-lines text-sm min-h-0 ${fontStyle}`}
                          style={{ 
                            backgroundImage: `linear-gradient(rgba(178, 159, 133, 0.25) 1px, transparent 1px)`,
                            color: '#1c1917'
                          }}
                        />

                        {/* Polaroid thumbnail attachment preview if link exists */}
                        {photo && (
                          <div className="absolute bottom-12 right-12 w-24 aspect-square p-1.5 pb-4 polaroid-frame rotate-[6deg] z-25 hover:rotate-0 hover:scale-110 transition-all cursor-pointer">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-2.5 washi-tape-polaroid -translate-y-1.5 rotate-[-3deg]" />
                            <img src={photo} className="w-full h-full object-cover" alt="Attached thumbnail" onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&q=80&w=400'; }} />
                          </div>
                        )}

                        {/* Actions block */}
                        <div className="flex justify-between items-center pt-2">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] uppercase font-bold text-stone-700">Container:</span>
                            <select
                              value={capsuleStyle}
                              onChange={(e) => setCapsuleStyle(e.target.value)}
                              className="bg-[#fafaf6] text-stone-900 border border-stone-300 rounded-xl px-2.5 py-1 text-xs font-bold focus:outline-none cursor-pointer shadow-sm"
                            >
                              {CONTAINER_THEMES.map(t => (
                                <option key={t.id} value={t.id}>{t.name}</option>
                              ))}
                            </select>
                          </div>
                          
                          <button
                            onClick={handleSubmit}
                            disabled={!title.trim() || !message.trim() || !unlockDate}
                            className="py-2.5 px-6 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            <Lock size={13} />
                            <span>Bury Capsule Vault</span>
                          </button>
                        </div>
                      </div>
                    </motion.div>

                    {/* Image / Attachment Manager (Right side/35% width) */}
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0, rotateY: 10 }}
                      animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="w-full max-w-xs h-full max-h-[70vh] flex flex-col justify-between text-stone-200"
                    >
                      <GlassCard className="p-5 flex-1 flex flex-col justify-between overflow-y-auto custom-scrollbar">
                        <div className="space-y-4">
                          <h4 className="font-extrabold text-xs text-stone-200 uppercase tracking-widest flex items-center gap-1.5 border-b border-white/10 pb-2">
                            <Camera size={13} className="text-theme-primary animate-pulse" />
                            <span>Attach Photo Artifact</span>
                          </h4>

                          {/* Media tab selector */}
                          <div className="flex gap-2 border-b border-white/5 pb-2">
                            {['upload', 'preset', 'url'].map((tab) => (
                              <button
                                key={tab}
                                type="button"
                                onClick={() => setPhotoSourceTab(tab)}
                                className={`text-[10px] font-bold uppercase pb-1 border-b-2 px-1 transition-all ${
                                  photoSourceTab === tab
                                    ? 'border-theme-primary text-theme-primary'
                                    : 'border-transparent text-gray-400 hover:text-white'
                                }`}
                              >
                                {tab === 'upload' && 'Gallery Upload'}
                                {tab === 'preset' && 'Presets'}
                                {tab === 'url' && 'Image Link'}
                              </button>
                            ))}
                          </div>

                          {photoSourceTab === 'upload' ? (
                            <div className="space-y-2">
                              <p className="text-[10px] text-gray-400">Upload custom image from your gallery/device:</p>
                              <div 
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all duration-300 ${
                                  isDragging 
                                    ? 'border-theme-primary bg-theme-primary/10' 
                                    : 'border-white/10 bg-black/20 hover:bg-black/30'
                                }`}
                              >
                                <input 
                                  type="file" 
                                  id="capsule-photo-upload" 
                                  accept="image/*" 
                                  onChange={handleImageUpload} 
                                  className="hidden" 
                                />
                                <label htmlFor="capsule-photo-upload" className="cursor-pointer space-y-2 block">
                                  <Upload size={20} className="mx-auto text-gray-400 dark:text-gray-500" />
                                  <span className="block text-[10px] font-bold text-gray-300">
                                    Click or Drag file to upload
                                  </span>
                                  <span className="block text-[8px] text-gray-500">
                                    PNG, JPG up to 5MB (Auto resized)
                                  </span>
                                </label>
                              </div>
                            </div>
                          ) : photoSourceTab === 'preset' ? (
                            <div className="space-y-2">
                              <p className="text-[10px] text-gray-400">Choose from catalog presets:</p>
                              <div className="grid grid-cols-3 gap-2">
                                {CAPSULE_PRESETS.map((presetUrl, idx) => (
                                  <button
                                    key={idx}
                                    type="button"
                                    onClick={() => setPhoto(presetUrl)}
                                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                                      photo === presetUrl ? 'border-theme-primary scale-95 shadow-md' : 'border-transparent'
                                    }`}
                                  >
                                    <img src={presetUrl} className="w-full h-full object-cover" alt="Preset item" />
                                  </button>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <p className="text-[10px] text-gray-400 font-bold">Paste custom Unsplash/web URL:</p>
                              <input 
                                type="text" 
                                value={photo}
                                onChange={(e) => setPhoto(e.target.value)}
                                placeholder="Paste image link here..."
                                className="w-full px-3 py-2 rounded-xl bg-black/30 border border-white/10 focus:outline-none focus:border-theme-primary text-xs font-semibold placeholder-gray-500 text-stone-200 transition-all"
                              />
                            </div>
                          )}
                        </div>

                        {photo && (
                          <div className="mt-6 p-2 rounded-xl bg-black/20 border border-white/5 flex flex-col items-center">
                            <div className="text-[8px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-0.5 mb-2">
                              <span>✓ Pinned to paper sheet</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => setPhoto('')}
                              className="py-1 px-3 text-[10px] rounded bg-red-950/20 text-red-400 border border-red-900/20 hover:bg-red-500/10 transition-colors w-full text-center font-bold"
                            >
                              Remove Attachment
                            </button>
                          </div>
                        )}
                      </GlassCard>
                    </motion.div>
                  </>
                ) : (
                  /* ================= BURYING CHEST BOX ANIMATION ================= */
                  <motion.div
                    key="burying-box-animation"
                    initial={{ scale: 0.6, opacity: 0, rotateY: 90 }}
                    animate={{ 
                      scale: [0.6, 1.1, 1],
                      opacity: 1, 
                      rotateY: 0,
                      transition: { duration: 1.2 }
                    }}
                    className="relative w-72 h-64 flex flex-col items-center justify-center p-6 border border-stone-800 rounded-2xl shadow-2xl overflow-hidden bg-stone-950"
                  >
                    {/* Glowing light rays */}
                    <div className="absolute inset-x-8 bottom-6 top-10 pointer-events-none bg-amber-400/10 rounded-full blur-xl animate-pulse" />

                    {/* Paper folding and falling inside chest */}
                    <motion.div 
                      initial={{ y: -70, scale: 0.9, opacity: 0.9 }}
                      animate={{ 
                        y: [0, 20, 50], 
                        scale: [0.9, 0.5, 0.1],
                        opacity: [0.9, 0.4, 0],
                        transition: { delay: 0.5, duration: 0.8 } 
                      }}
                      className="absolute w-40 h-48 bg-[#faf8f0] border border-stone-300 shadow-md z-10 flex flex-col p-4 space-y-1.5 pointer-events-none"
                    >
                      <div className="w-12 h-1 bg-stone-300 rounded" />
                      <div className="w-full h-1 bg-stone-200 rounded" />
                      <div className="w-full h-1 bg-stone-100 rounded" />
                    </motion.div>

                    {/* Chest container frame box */}
                    <div className="w-44 h-28 bg-[#3d200a] border-2 border-[#522d13] rounded shadow-2xl relative z-0 flex flex-col justify-between py-1 px-2 mt-16">
                      <div className="absolute top-0 left-0 right-0 h-4 bg-black/35 rounded-t-sm" />
                      <div className="w-6 h-6 rounded bg-yellow-600/70 border border-yellow-700 shadow-md self-center mt-3 flex items-center justify-center text-[8px] z-10 text-yellow-100">
                        <Lock size={10} />
                      </div>
                      <span className="text-[6px] font-black uppercase text-amber-500/50 text-center tracking-widest mb-1 z-10">Vault Container</span>
                    </div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ 
                        opacity: [0, 1, 0], 
                        y: [-10, -30],
                        transition: { delay: 1.8, duration: 0.8 } 
                      }}
                      className="absolute text-[10px] font-black text-amber-500 bg-black/40 px-2.5 py-0.5 rounded border border-amber-500/20 z-40"
                    >
                      VAULT LOCKED 🔐
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>

            {/* Stationery Selector footer */}
            {!isBurying && (
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

      {/* Unlocked Capsule Vault Modal Dialog (Treasure Box unboxing sequence) */}
      <AnimatePresence>
        {activeCapsule && (() => {
          const { pStyle, cStyle, font, text } = parseCapsuleMessage(activeCapsule.message);
          const pTheme = PAPER_THEMES.find(t => t.id === pStyle) || PAPER_THEMES[0];
          
          return (
            <div className="fixed inset-0 bg-black/75 backdrop-blur-lg z-50 flex items-center justify-center p-4">
              
              {unboxStep === 'locked' ? (
                /* Unsealing locked container modal view */
                <motion.div
                  initial={{ scale: 0.8, opacity: 0, rotateY: 30 }}
                  animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="w-96 p-6 rounded-2xl bg-stone-900 border border-stone-800 shadow-2xl flex flex-col items-center justify-center text-center space-y-5 relative"
                >
                  <div className="absolute inset-x-8 top-12 bottom-6 bg-amber-500/5 blur-xl pointer-events-none rounded-full" />
                  
                  {/* Container title badge */}
                  <div>
                    <span className="text-[8px] font-black uppercase tracking-widest text-amber-500/50">LOCKED CONTAINER</span>
                    <h3 className="text-lg font-extrabold text-amber-100 font-serif mt-1">{activeCapsule.title}</h3>
                  </div>

                  {/* Vault 3D item placeholder */}
                  <div className="w-40 h-24 bg-[#3d200a] border-2 border-[#522d13] rounded shadow-xl relative flex items-center justify-center">
                    <div className="absolute top-0 left-0 right-0 h-3 bg-black/35 rounded-t-sm" />
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 10 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        setUnboxStep('opening');
                        setTimeout(() => {
                          setUnboxStep('unboxed');
                        }, 1800);
                      }}
                      className="w-10 h-10 rounded-full bg-yellow-600/90 border border-yellow-500 text-yellow-100 shadow-md flex items-center justify-center text-sm font-bold relative z-10"
                    >
                      🔑
                    </motion.button>
                  </div>

                  <span className="text-[8px] font-black text-amber-500/80 uppercase tracking-widest animate-pulse">
                    Click Key lock to Unseal
                  </span>

                  <div className="w-full flex justify-between text-[8px] font-bold border-t border-white/5 pt-3">
                    <span className="text-gray-500">Bury date unlocked</span>
                    <button 
                      onClick={() => setActiveCapsule(null)}
                      className="text-stone-400 hover:text-white"
                    >
                      Keep Buried
                    </button>
                  </div>
                </motion.div>
              ) : unboxStep === 'opening' ? (
                /* Glowing open chest lid sequence */
                <div className="flex flex-col items-center justify-center space-y-4">
                  <motion.div 
                    animate={{ 
                      scale: [1, 1.2, 0.5],
                      rotateX: [0, 90, 0],
                      opacity: [1, 1, 0]
                    }}
                    transition={{ duration: 1.6, ease: "easeInOut" }}
                    className="w-40 h-28 bg-[#3d200a] border-2 border-[#522d13] rounded shadow-2xl relative flex flex-col justify-between py-1 px-2"
                  >
                    {/* Glowing yellow lights overflowing */}
                    <div className="absolute inset-0 bg-yellow-400/20 blur-md rounded animate-pulse" />
                    <div className="w-12 h-1 bg-yellow-400 self-center shadow-lg" />
                    <span className="text-[8px] text-yellow-400 text-center font-bold animate-ping mt-4">UNSEALING...</span>
                  </motion.div>
                  <span className="text-xs text-amber-400 font-bold tracking-widest animate-pulse">Opening Capsule Chest... 💫</span>
                </div>
              ) : (
                /* Unboxed Vault contents overlay page */
                <motion.div 
                  initial={{ scale: 0.75, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.75, opacity: 0 }}
                  transition={{ duration: 0.55, ease: "easeOut" }}
                  className="w-full max-w-4xl rounded-[32px] p-4 md:p-8 flex flex-col items-center justify-center relative min-h-[480px] max-h-[92vh] overflow-y-auto custom-scrollbar"
                >
                  
                  {/* Visual backdrop unsealing light animation */}
                  <div className="absolute w-[350px] h-[350px] bg-radial from-amber-400/20 via-amber-500/5 to-transparent rounded-full blur-[80px] top-[15%] pointer-events-none z-0" />

                  <div className="w-full max-w-3xl flex items-center justify-between pb-3 border-b border-white/10 relative z-20 text-stone-300 mb-4">
                    <div className="flex items-center gap-2">
                      <Unlock size={18} className="text-emerald-500 animate-pulse" />
                      <span className="text-xs font-black uppercase tracking-wider">Unsealed Capsule Details</span>
                    </div>
                    <button 
                      onClick={() => setActiveCapsule(null)}
                      className="py-1 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold transition-colors"
                    >
                      Close Vault
                    </button>
                  </div>

                  <div className="w-full flex flex-col md:flex-row gap-6 relative z-10 items-stretch">
                    
                    {/* Left Column: The Large Unfolded Stationery Sheet */}
                    <div 
                      style={{
                        background: pStyle === 'vintage-coffee' 
                          ? 'radial-gradient(circle at 10% 20%, rgba(90,40,10,0.06) 0%, transparent 20%), #ecdcc2'
                          : pStyle === 'romantic-parchment'
                            ? 'radial-gradient(circle, #fcf6e5 20%, #f4ebd0 100%)'
                            : pStyle === 'old-diary'
                              ? '#faf7ee'
                              : pStyle === 'elegant-rose'
                                ? '#fff5f5'
                                : pStyle === 'floral-stationery'
                                  ? '#f5f0ff'
                                  : '#fafaf6',
                        borderLeft: pStyle === 'old-diary' ? '2px solid rgba(220, 68, 68, 0.35)' : '',
                        border: pStyle === 'minimal-cream' ? '4px double rgba(197, 160, 89, 0.35)' : ''
                      }}
                      className={`flex-1 rounded-xl p-8 md:p-10 shadow-2xl relative border min-h-[300px] flex flex-col justify-between ${pTheme.class}`}
                    >
                      {/* Ring holes for notebook */}
                      {pStyle === 'old-diary' && (
                        <div className="absolute top-0 bottom-0 left-1 w-4 bg-black/5 flex flex-col justify-around py-8 pointer-events-none">
                          {Array.from({ length: 8 }).map((_, r) => (
                            <div key={r} className="w-2.5 h-2.5 rounded-full bg-stone-300 border border-stone-400 shadow-inner" />
                          ))}
                        </div>
                      )}

                      <div className="space-y-4 pl-4 h-full flex flex-col justify-between text-stone-900">
                        <div className="space-y-1">
                          <h3 className="text-xl font-extrabold tracking-tight font-sans leading-none">{activeCapsule.title}</h3>
                          <div className="text-[9px] opacity-60 font-bold font-sans mt-1">
                            Locked on {new Date(activeCapsule.unlockDate).toLocaleDateString()}
                          </div>
                        </div>

                        {/* Ruled letter body lines */}
                        <div className="flex-1 py-4 overflow-y-auto custom-scrollbar">
                          <p className={`text-sm leading-loose whitespace-pre-wrap text-stone-900 ${font}`}>
                            {text}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-black/10 flex items-center justify-between text-[10px] opacity-60 font-serif font-bold italic text-stone-700">
                          <span>Logged for tomorrow...</span>
                          
                          <button 
                            onClick={() => {
                              deleteCapsule(activeCapsule.id);
                              setActiveCapsule(null);
                            }}
                            className="py-1.5 px-3 rounded-lg hover:bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-bold transition-all flex items-center gap-1"
                          >
                            <Trash2 size={13} />
                            <span>Discard Capsule</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Pinned photo polaroid details (scales & rotates dynamically) */}
                    {activeCapsule.photos && activeCapsule.photos.length > 0 && (
                      <motion.div
                        initial={{ scale: 0.5, rotate: -25, opacity: 0 }}
                        animate={{ 
                          scale: 1, 
                          rotate: 6, 
                          opacity: 1,
                          transition: { delay: 0.6, type: "spring", stiffness: 200 } 
                        }}
                        className="w-full md:w-60 shrink-0 p-3 pb-8 rounded-sm polaroid-frame self-center rotate-[6deg] relative z-20 pointer-events-auto"
                      >
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-4 washi-tape-polaroid -translate-y-2.5 rotate-[2deg] opacity-85" />
                        <div className="aspect-square w-full overflow-hidden bg-black/10 shadow-inner rounded-md">
                          <img 
                            src={activeCapsule.photos[0]} 
                            className="w-full h-full object-cover" 
                            alt="Unboxed artifact" 
                          />
                        </div>
                        <div className="mt-3 text-center text-stone-900 font-stationery-handwriting text-xs leading-none">
                          Memory Polaroid 📸
                        </div>
                      </motion.div>
                    )}

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
