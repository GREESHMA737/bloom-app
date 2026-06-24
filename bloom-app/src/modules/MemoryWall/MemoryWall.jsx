import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Trash2, 
  MapPin, 
  Smile, 
  Calendar,
  Camera,
  X,
  Maximize2,
  Upload
} from 'lucide-react';
import { useBloom } from '../../context/BloomContext';
import GlassCard from '../../components/GlassCard';

// Preset stock images
const PHOTO_PRESETS = [
  'https://images.unsplash.com/photo-1522748906645-95d8adfd52c7?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&q=80&w=600',
];

const EMOTIONS = ['Happy', 'Inspired', 'Peaceful', 'Grateful', 'Nostalgic', 'Excited', 'Calm'];

export default function MemoryWall() {
  const { 
    memories, 
    addMemory, 
    deleteMemory,
    searchQuery
  } = useBloom();

  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [photo, setPhoto] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [emotion, setEmotion] = useState('Happy');
  const [location, setLocation] = useState('');
  
  const [selectedMemory, setSelectedMemory] = useState(null);
  const [addFormOpen, setAddFormOpen] = useState(false);
  const [photoSourceTab, setPhotoSourceTab] = useState('upload');
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFont, setSelectedFont] = useState(() => localStorage.getItem('bloom-memory-font') || 'caveat');

  const handleFontChange = (fontKey) => {
    setSelectedFont(fontKey);
    localStorage.setItem('bloom-memory-font', fontKey);
  };

  const getFontClass = () => {
    switch (selectedFont) {
      case 'caveat': return 'font-handwriting-caveat';
      case 'pacifico': return 'font-handwriting-pacifico';
      case 'patrick': return 'font-handwriting-patrick';
      case 'clean': return 'font-clean-inter';
      default: return 'font-handwriting-caveat';
    }
  };

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

  // Filter based on search query
  const filteredMemories = memories.filter(mem => 
    mem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    mem.caption.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (mem.location && mem.location.toLowerCase().includes(searchQuery.toLowerCase())) ||
    mem.emotion.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !caption.trim()) return;

    addMemory(title, caption, photo, date, emotion, location);
    
    // Clear inputs
    setTitle('');
    setCaption('');
    setPhoto('');
    setDate(new Date().toISOString().split('T')[0]);
    setEmotion('Happy');
    setLocation('');
    setPhotoSourceTab('upload');
    setAddFormOpen(false);
  };

  const activeMemories = filteredMemories.length > 0 ? filteredMemories : [
    {
      id: 'placeholder-1',
      title: 'Your First Memory 🌸',
      caption: 'Log your first memory to clip it on the wall! You can upload custom images from your desktop or gallery, choose presets, or paste links, and catalog your emotions.',
      photo: 'https://images.unsplash.com/photo-1522748906645-95d8adfd52c7?auto=format&fit=crop&q=80&w=600',
      date: new Date().toISOString().split('T')[0],
      emotion: 'Inspired',
      location: 'My Vault',
      isPlaceholder: true
    }
  ];

  const getEmotionStyles = (emo) => {
    const defaultStyles = {
      tape: 'bg-pink-400/40 text-pink-900 border-pink-400/30 dark:bg-pink-500/30 dark:text-pink-100',
      glow: 'shadow-[0_4px_20px_rgba(236,72,153,0.08)] hover:shadow-[0_12px_30px_rgba(236,72,153,0.18)]',
      border: 'border-pink-500/20 dark:border-pink-500/30',
      badge: 'bg-pink-500/10 text-pink-700 dark:bg-pink-500/20 dark:text-pink-300'
    };

    switch (emo?.toLowerCase()) {
      case 'happy':
        return {
          tape: 'bg-amber-400/50 text-amber-950 border-amber-400/20 dark:bg-amber-500/30 dark:text-amber-100',
          glow: 'shadow-[0_4px_20px_rgba(245,158,11,0.12)] hover:shadow-[0_12px_30px_rgba(245,158,11,0.22)]',
          border: 'border-amber-500/20 dark:border-amber-500/35',
          badge: 'bg-amber-500/10 text-amber-800 dark:bg-amber-500/20 dark:text-amber-200'
        };
      case 'inspired':
        return {
          tape: 'bg-violet-400/50 text-violet-950 border-violet-400/20 dark:bg-violet-500/30 dark:text-violet-100',
          glow: 'shadow-[0_4px_20px_rgba(139,92,246,0.12)] hover:shadow-[0_12px_30px_rgba(139,92,246,0.22)]',
          border: 'border-violet-500/20 dark:border-violet-500/35',
          badge: 'bg-violet-500/10 text-violet-800 dark:bg-violet-500/20 dark:text-violet-200'
        };
      case 'peaceful':
        return {
          tape: 'bg-emerald-400/50 text-emerald-950 border-emerald-400/20 dark:bg-emerald-500/30 dark:text-emerald-100',
          glow: 'shadow-[0_4px_20px_rgba(16,185,129,0.12)] hover:shadow-[0_12px_30px_rgba(16,185,129,0.22)]',
          border: 'border-emerald-500/20 dark:border-emerald-500/35',
          badge: 'bg-emerald-500/10 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-200'
        };
      case 'grateful':
        return {
          tape: 'bg-rose-400/50 text-rose-950 border-rose-400/20 dark:bg-rose-500/30 dark:text-rose-100',
          glow: 'shadow-[0_4px_20px_rgba(244,63,94,0.12)] hover:shadow-[0_12px_30px_rgba(244,63,94,0.22)]',
          border: 'border-rose-500/20 dark:border-rose-500/35',
          badge: 'bg-rose-500/10 text-rose-800 dark:bg-rose-500/20 dark:text-rose-200'
        };
      case 'nostalgic':
        return {
          tape: 'bg-orange-400/50 text-orange-950 border-orange-400/20 dark:bg-orange-500/30 dark:text-orange-100',
          glow: 'shadow-[0_4px_20px_rgba(249,115,22,0.12)] hover:shadow-[0_12px_30px_rgba(249,115,22,0.22)]',
          border: 'border-orange-500/20 dark:border-orange-500/35',
          badge: 'bg-orange-500/10 text-orange-800 dark:bg-orange-500/20 dark:text-orange-200'
        };
      case 'excited':
        return {
          tape: 'bg-red-400/50 text-red-950 border-red-400/20 dark:bg-red-500/30 dark:text-red-100',
          glow: 'shadow-[0_4px_20px_rgba(239,68,68,0.12)] hover:shadow-[0_12px_30px_rgba(239,68,68,0.22)]',
          border: 'border-red-500/20 dark:border-red-500/35',
          badge: 'bg-red-500/10 text-red-800 dark:bg-red-500/20 dark:text-red-200'
        };
      case 'calm':
        return {
          tape: 'bg-sky-400/50 text-sky-950 border-sky-400/20 dark:bg-sky-500/30 dark:text-sky-100',
          glow: 'shadow-[0_4px_20px_rgba(14,165,233,0.12)] hover:shadow-[0_12px_30px_rgba(14,165,233,0.22)]',
          border: 'border-sky-500/20 dark:border-sky-500/35',
          badge: 'bg-sky-500/10 text-sky-800 dark:bg-sky-500/20 dark:text-sky-200'
        };
      default:
        return defaultStyles;
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto overflow-y-auto h-[calc(100vh-4rem)] custom-scrollbar">
      
      {/* Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-extrabold text-sm text-gray-400 dark:text-gray-500 uppercase tracking-widest">Memory Wall</h3>
          <p className="text-xs text-gray-500">Capture visual moments and catalog how they made you feel.</p>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto">
          {/* Font Selector */}
          <div className="flex items-center bg-white/40 dark:bg-black/25 border border-white/60 dark:border-white/10 rounded-2xl px-3 py-1.5 gap-2 shadow-sm">
            <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Font:</span>
            <select
              value={selectedFont}
              onChange={(e) => handleFontChange(e.target.value)}
              className="bg-transparent text-[11px] font-bold text-gray-700 dark:text-gray-300 focus:outline-none cursor-pointer pr-1"
            >
              <option value="caveat" className="dark:bg-gray-900 dark:text-white">Caveat (Curly)</option>
              <option value="pacifico" className="dark:bg-gray-900 dark:text-white">Pacifico (Retro)</option>
              <option value="patrick" className="dark:bg-gray-900 dark:text-white">Patrick (Cute)</option>
              <option value="clean" className="dark:bg-gray-900 dark:text-white">Clean (Modern)</option>
            </select>
          </div>

          <button
            onClick={() => setAddFormOpen(!addFormOpen)}
            className="py-2.5 px-5 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-900 dark:text-blue-200 border border-blue-300/40 font-black text-xs transition-all flex items-center gap-1.5 shadow-sm"
          >
            {addFormOpen ? <X size={14} /> : <Plus size={14} />}
            <span>{addFormOpen ? 'Close Form' : 'Log Memory'}</span>
          </button>
        </div>
      </div>

      {/* Add Memory Form Section */}
      <AnimatePresence>
        {addFormOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <GlassCard className="max-w-2xl mx-auto bg-gradient-to-br from-pink-500/5 via-transparent to-transparent">
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase mb-1">Memory Title</label>
                    <input 
                      type="text" 
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Cozy Brew Coffee Date"
                      className="w-full px-3 py-2 rounded-xl bg-white/50 dark:bg-black/30 border border-gray-300 dark:border-white/20 focus:outline-none focus:border-theme-primary text-xs font-semibold placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white transition-all"
                      maxLength={50}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase mb-1">Location (Optional)</label>
                    <input 
                      type="text" 
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Seattle, WA"
                      className="w-full px-3 py-2 rounded-xl bg-white/50 dark:bg-black/30 border border-gray-300 dark:border-white/20 focus:outline-none focus:border-theme-primary text-xs font-semibold placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white transition-all"
                      maxLength={50}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase mb-1">Date</label>
                      <input 
                        type="date" 
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-white/50 dark:bg-black/30 border border-gray-300 dark:border-white/20 focus:outline-none focus:border-theme-primary text-xs font-semibold text-gray-900 dark:text-white transition-all"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase mb-1">Vibe/Emotion</label>
                      <select
                        value={emotion}
                        onChange={(e) => setEmotion(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-white/50 dark:bg-black/30 border border-gray-300 dark:border-white/20 focus:outline-none focus:border-theme-primary text-xs font-semibold text-gray-900 dark:text-white transition-all"
                      >
                        {EMOTIONS.map(em => (
                          <option key={em} value={em} className="bg-white dark:bg-gray-950 text-gray-800 dark:text-white">{em}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase mb-2">Memory Photo</label>
                    
                    {/* Tab Navigation for Photo Selection */}
                    <div className="flex gap-2 mb-3 border-b border-black/10 dark:border-white/10 pb-2">
                      {['upload', 'preset', 'url'].map((tab) => (
                        <button
                          key={tab}
                          type="button"
                          onClick={() => setPhotoSourceTab(tab)}
                          className={`text-[10px] font-bold uppercase pb-1 border-b-2 px-1 transition-all ${
                            photoSourceTab === tab
                              ? 'border-theme-primary text-theme-primary'
                              : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                          }`}
                        >
                          {tab === 'upload' && 'Upload File'}
                          {tab === 'preset' && 'Choose Preset'}
                          {tab === 'url' && 'Paste Link'}
                        </button>
                      ))}
                    </div>

                    {/* Tab Contents */}
                    {photoSourceTab === 'upload' && (
                      <div className="space-y-3">
                        <div 
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onDrop={handleDrop}
                          onClick={() => document.getElementById('memory-file-upload').click()}
                          className={`flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-6 cursor-pointer bg-white/30 dark:bg-black/20 transition-all ${
                            isDragging 
                              ? 'border-theme-primary bg-theme-primary/10 scale-[0.98]' 
                              : 'border-gray-300 dark:border-white/10 hover:border-theme-primary/60 hover:bg-white/40 dark:hover:bg-black/30'
                          }`}
                        >
                          <Upload size={24} className={`mb-2 transition-colors ${isDragging ? 'text-theme-primary' : 'text-gray-450 dark:text-gray-300'}`} />
                          <span className="text-[11px] font-bold text-gray-800 dark:text-white text-center">
                            {isDragging ? 'Drop your memory photo here!' : 'Drag & drop image here, or click to upload'}
                          </span>
                          <span className="text-[9px] text-gray-500 dark:text-gray-400 mt-1">
                            Supports PNG, JPG, JPEG (automatically optimized)
                          </span>
                        </div>
                        <input 
                          id="memory-file-upload"
                          type="file" 
                          accept="image/*" 
                          onChange={handleImageUpload} 
                          className="hidden" 
                        />
                        
                        {photo && photo.startsWith('data:image') && (
                          <div className="flex items-center gap-2 bg-black/40 p-2 rounded-xl border border-white/10">
                            <img src={photo} className="w-12 h-12 object-cover rounded-lg" alt="Uploaded thumbnail" />
                            <div className="flex-1 min-w-0">
                              <p className="text-[10px] font-bold text-white truncate">Uploaded image loaded</p>
                              <p className="text-[9px] text-gray-300">Compressed & ready</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => setPhoto('')}
                              className="p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 text-red-500 transition-colors"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {photoSourceTab === 'preset' && (
                      <div className="space-y-2">
                        <div className="flex gap-2 overflow-x-auto py-1">
                          {PHOTO_PRESETS.map((preset, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setPhoto(preset)}
                              className={`w-12 h-12 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                                photo === preset ? 'border-theme-primary scale-95 shadow-md' : 'border-transparent'
                              }`}
                            >
                              <img src={preset} className="w-full h-full object-cover" alt={`Preset ${idx + 1}`} />
                            </button>
                          ))}
                        </div>
                        {photo && !photo.startsWith('data:image') && PHOTO_PRESETS.includes(photo) && (
                          <p className="text-[9px] font-bold text-theme-primary">Preset selected</p>
                        )}
                      </div>
                    )}

                    {photoSourceTab === 'url' && (
                      <div className="space-y-2">
                        <input 
                          type="text" 
                          value={photo.startsWith('data:image') ? '' : photo}
                          onChange={(e) => setPhoto(e.target.value)}
                          placeholder="Paste image URL here..."
                          className="w-full px-3 py-2 rounded-xl bg-white/50 dark:bg-black/30 border border-gray-300 dark:border-white/20 focus:outline-none focus:border-theme-primary text-xs font-semibold placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white transition-all"
                        />
                        {photo && !photo.startsWith('data:image') && !PHOTO_PRESETS.includes(photo) && (
                          <div className="flex items-center gap-2 bg-black/40 p-2 rounded-xl border border-white/10">
                            <img src={photo} className="w-12 h-12 object-cover rounded-lg" alt="Custom URL preview" onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&q=80&w=800'; }} />
                            <div className="flex-1 min-w-0">
                              <p className="text-[10px] font-bold text-white truncate">URL Image Preview</p>
                              <p className="text-[9px] text-gray-300">Verify image loads correctly</p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase mb-1">Caption / Thoughts</label>
                    <textarea 
                      value={caption}
                      onChange={(e) => setCaption(e.target.value)}
                      placeholder="Tell the story of this memory..."
                      rows={3}
                      className="w-full px-3 py-2 rounded-xl bg-white/50 dark:bg-black/30 border border-gray-300 dark:border-white/20 focus:outline-none focus:border-theme-primary text-xs placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white transition-all resize-none custom-scrollbar"
                      maxLength={300}
                    />
                  </div>
                </div>

                <div className="md:col-span-2 pt-2 border-t border-black/5 dark:border-white/5 flex justify-end">
                  <button 
                    type="submit"
                    disabled={!title.trim() || !caption.trim()}
                    className="py-2.5 px-6 rounded-2xl bg-theme-primary text-white font-bold text-xs hover:opacity-95 shadow-glow disabled:opacity-50 transition-all"
                  >
                    Save to Memory Wall
                  </button>
                </div>

              </form>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom styles for the physical wall & handwriting font */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&family=Pacifico&family=Patrick+Hand&family=Inter:wght@400;700&display=swap');
        
        .font-handwriting-caveat {
          font-family: 'Caveat', cursive, sans-serif;
          font-size: 1.25rem;
          letter-spacing: 0.02em;
        }

        .font-handwriting-pacifico {
          font-family: 'Pacifico', cursive, sans-serif;
          font-size: 0.95rem;
          line-height: 1.3;
        }

        .font-handwriting-patrick {
          font-family: 'Patrick Hand', cursive, sans-serif;
          font-size: 1.1rem;
          letter-spacing: 0.03em;
        }

        .font-clean-inter {
          font-family: 'Inter', sans-serif;
          font-size: 0.9rem;
          font-weight: 700;
          letter-spacing: 0.02em;
        }

        .bg-scrapbook-canvas {
          background-color: #FAF8F5;
          background-image: 
            radial-gradient(circle, #e6e4dc 1px, transparent 1px),
            linear-gradient(rgba(240, 238, 230, 0.4) 1.5px, transparent 1.5px);
          background-size: 24px 24px, 100% 24px;
          box-shadow: inset 0 0 40px rgba(0,0,0,0.03);
          border: 1px solid rgba(139, 92, 246, 0.08);
        }

        .dark .bg-scrapbook-canvas {
          background-color: #121016;
          background-image: 
            radial-gradient(circle, #201c2b 1px, transparent 1px),
            linear-gradient(rgba(25, 22, 34, 0.4) 1.5px, transparent 1.5px);
          background-size: 24px 24px, 100% 24px;
          box-shadow: inset 0 0 50px rgba(0,0,0,0.7);
          border: 1px solid rgba(167, 139, 250, 0.08);
        }

        .washi-tape {
          clip-path: polygon(1% 0%, 99% 0%, 96% 50%, 99% 100%, 1% 100%, 4% 50%);
          backdrop-filter: blur(1px);
        }
      `}</style>

      {/* Cozy digital scrapbook binder canvas */}
      <div className="relative rounded-[32px] overflow-hidden bg-scrapbook-canvas p-6 md:p-10 shadow-xl min-h-[580px] mb-6">
        
        {/* Scrapbook Spiral Rings Decoration on top */}
        <div className="absolute top-0 left-0 right-0 h-4 flex justify-center gap-6 pointer-events-none z-20">
          {Array.from({ length: 14 }).map((_, binderIdx) => (
            <div key={binderIdx} className="w-1.5 h-6 bg-gradient-to-b from-gray-400 to-gray-500 rounded-full shadow-md border-t border-white/20 -translate-y-2 opacity-50" />
          ))}
        </div>

        {/* Pinterest Masonry layout grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6 pt-6 relative z-10">
          {activeMemories.map((mem, index) => {
            const rotValue = ((mem.title.charCodeAt(0) + index) % 6) - 3; // slight scatter tilt
            const vibe = getEmotionStyles(mem.emotion);

            return (
              <motion.div
                key={mem.id}
                layoutId={`memory-card-${mem.id}`}
                onClick={() => setSelectedMemory(mem)}
                className={`break-inside-avoid relative cursor-pointer group hover:z-30 p-4 rounded-3xl glass-panel ${vibe.glow} ${vibe.border} border-t-4 transition-all duration-300 flex flex-col space-y-3 bg-white/70 dark:bg-gray-950/75 backdrop-blur-md`}
                style={{ 
                  transform: `rotate(${rotValue}deg)`,
                  marginBottom: '24px' // Gutter spacing
                }}
                whileHover={{ scale: 1.03, rotate: 0, y: -4 }}
                transition={{ type: "spring", stiffness: 350, damping: 22 }}
              >
                {/* Washi Tape Accent */}
                <div 
                  className={`absolute -top-3 left-1/2 -translate-x-1/2 washi-tape px-4 py-1.5 text-[9px] font-black uppercase tracking-widest border z-20 shadow-sm rotate-[1deg] ${vibe.tape}`}
                >
                  {mem.emotion}
                </div>

                {/* Polaroid photo container with border */}
                <div className="w-full rounded-2xl overflow-hidden bg-black/10 border border-black/5 dark:border-white/5 relative aspect-square shadow-inner">
                  <img 
                    src={mem.photo} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                    alt={mem.title} 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Text Caption details (High Readability) */}
                <div className="space-y-1.5 pt-1">
                  <h4 className="font-extrabold text-sm text-gray-900 dark:text-gray-100 leading-snug tracking-tight truncate">
                    {mem.title}
                  </h4>
                  
                  {mem.caption && (
                    <p className={`text-xs text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed ${getFontClass()}`}>
                      {mem.caption}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-[9px] text-gray-500 dark:text-gray-400 font-bold border-t border-black/5 dark:border-white/5 pt-2 mt-2">
                    <span className="flex items-center gap-0.5">
                      <Calendar size={10} />
                      {new Date(mem.date).toLocaleDateString([], { month: 'short', day: 'numeric', year: '2-digit' })}
                    </span>
                    {mem.location && (
                      <span className="flex items-center gap-0.5 max-w-[90px] truncate">
                        <MapPin size={10} className="shrink-0" />
                        {mem.location}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Expanded Memory Modal Dialog */}
      <AnimatePresence>
        {selectedMemory && (() => {
          const vibe = getEmotionStyles(selectedMemory.emotion);
          return (
            <div className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <motion.div 
                layoutId={`memory-card-${selectedMemory.id}`}
                className={`w-full max-w-3xl rounded-[32px] glass-panel bg-white/95 dark:bg-gray-900/95 border-2 ${vibe.border} p-0 overflow-hidden flex flex-col md:flex-row max-h-[85vh] shadow-2xl relative`}
              >
                
                {/* Washi Tape inside modal */}
                <div className={`absolute top-4 left-6 washi-tape px-4 py-1.5 text-[10px] font-black uppercase tracking-widest border z-20 ${vibe.tape} rotate-[-1deg]`}>
                  vibe: {selectedMemory.emotion}
                </div>

                {/* Photo Box Left Side (Span 1/2) */}
                <div className="w-full md:w-1/2 h-64 md:h-auto min-h-[250px] relative bg-black/5 border-r border-black/5 dark:border-white/5 flex items-center shadow-inner">
                  <img 
                    src={selectedMemory.photo} 
                    className="w-full h-full object-cover" 
                    alt={selectedMemory.title} 
                  />
                </div>

                {/* Text Details Right Side (Span 1/2) */}
                <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-black/5 dark:border-white/10 pb-3 mt-4 md:mt-0">
                      <div className="flex items-center gap-1.5">
                        <Camera size={15} className="text-theme-primary" />
                        <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider">Memory Log</span>
                      </div>
                      
                      <button 
                        onClick={() => setSelectedMemory(null)}
                        className="py-1 px-3.5 rounded-full bg-black/10 dark:bg-white/10 hover:bg-black/15 text-xs font-bold text-gray-700 dark:text-gray-200 transition-colors"
                      >
                        Close
                      </button>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-xl font-black text-gray-900 dark:text-white leading-tight">{selectedMemory.title}</h3>
                      <div className="flex flex-wrap gap-2 text-[10px] font-extrabold text-gray-500 dark:text-gray-400 mt-1">
                        <span className="flex items-center gap-0.5 bg-gray-100 dark:bg-white/5 px-2.5 py-1 rounded-xl">
                          <Calendar size={10} /> {new Date(selectedMemory.date).toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })}
                        </span>
                        {selectedMemory.location && (
                          <span className="flex items-center gap-0.5 bg-gray-100 dark:bg-white/5 px-2.5 py-1 rounded-xl">
                            <MapPin size={10} /> {selectedMemory.location}
                          </span>
                        )}
                        <span className={`flex items-center gap-0.5 px-2.5 py-1 rounded-xl ${vibe.badge}`}>
                          {selectedMemory.emotion}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-black/20 border border-amber-200/30 dark:border-white/5 min-h-[140px] max-h-[200px] overflow-y-auto custom-scrollbar">
                      <p className={`text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap ${getFontClass()}`}>
                        {selectedMemory.caption}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-black/5 dark:border-white/10 flex justify-end">
                    {!selectedMemory.isPlaceholder ? (
                      <button 
                        onClick={() => {
                          deleteMemory(selectedMemory.id);
                          setSelectedMemory(null);
                        }}
                        className="py-2 px-4 rounded-xl hover:bg-red-500/10 text-red-500 text-xs font-bold transition-all flex items-center gap-1"
                      >
                        <Trash2 size={13} />
                        <span>Discard Memory</span>
                      </button>
                    ) : (
                      <span className="text-[10px] text-gray-400 font-bold italic">Placeholder Preview</span>
                    )}
                  </div>
                </div>

              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>

    </div>
  );
}

