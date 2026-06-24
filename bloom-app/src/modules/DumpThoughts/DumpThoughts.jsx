import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Trash2, 
  Check, 
  Info,
  EyeOff
} from 'lucide-react';
import { useBloom } from '../../context/BloomContext';
import GlassCard from '../../components/GlassCard';

export default function DumpThoughts() {
  const { dumpThoughts, setDumpThoughts } = useBloom();
  
  const [text, setText] = useState(dumpThoughts);
  const [savingStatus, setSavingStatus] = useState('saved 🌸');
  const [typingTimer, setTypingTimer] = useState(null);

  // Sync internal text state with global context on mount
  useEffect(() => {
    setText(dumpThoughts);
  }, [dumpThoughts]);

  const handleChange = (e) => {
    const newVal = e.target.value;
    setText(newVal);
    setSavingStatus('typing...');

    // Debounce the autosave to localStorage context
    if (typingTimer) clearTimeout(typingTimer);
    
    const timer = setTimeout(() => {
      setDumpThoughts(newVal);
      setSavingStatus('saved 🌸');
    }, 800);

    setTypingTimer(timer);
  };

  const handleClear = () => {
    if (window.confirm("Ready to let these thoughts go? They will be deleted forever, leaving you clean and light. ✨")) {
      setText('');
      setDumpThoughts('');
      setSavingStatus('cleared 💨');
      setTimeout(() => setSavingStatus('saved 🌸'), 1500);
    }
  };

  const getWordCount = () => {
    if (!text.trim()) return 0;
    return text.trim().split(/\s+/).length;
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto h-[calc(100vh-4rem)] flex flex-col justify-between relative overflow-hidden">
      
      {/* Dark theme force outer wrapper */}
      <div className="absolute inset-0 bg-slate-950/90 dark:bg-black/95 z-0" />
      
      {/* Soft floating glow bubbles behind content */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none animate-float-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full bg-purple-500/10 blur-[100px] pointer-events-none animate-float-medium" />

      {/* Main content layer */}
      <div className="relative z-10 flex flex-col h-full justify-between space-y-6">
        
        {/* Header toolbar */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2">
            <EyeOff size={18} className="text-indigo-400" />
            <div>
              <h3 className="font-extrabold text-sm text-gray-100 uppercase tracking-widest flex items-center gap-1.5">
                <span>Dump Thoughts</span>
                <span className="text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full font-medium">Safe Space</span>
              </h3>
              <p className="text-[10px] text-gray-400">No filters. No judgment. Just write.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono font-bold text-gray-400 bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
              Status: {savingStatus}
            </span>
            <button
              onClick={handleClear}
              disabled={!text}
              className="p-2 rounded-xl bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-all border border-white/5 disabled:opacity-30 disabled:cursor-not-allowed"
              title="Dump & Shred Thoughts"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {/* Text Area Writing Space */}
        <div className="flex-1 flex flex-col">
          <textarea
            value={text}
            onChange={handleChange}
            placeholder="Close your eyes for a second, breathe, and start typing whatever is on your mind. Let it spill out, typos and all..."
            className="w-full flex-1 bg-transparent border-none outline-none focus:ring-0 text-gray-100 placeholder-gray-600 text-base md:text-lg font-handwriting resize-none leading-loose custom-scrollbar font-normal"
          />
        </div>

        {/* Footer info bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-white/10 shrink-0 text-xs text-gray-500 font-medium">
          <div className="flex items-center gap-1">
            <Info size={14} className="text-indigo-400" />
            <span>This text is stored entirely locally and is never sent to any server.</span>
          </div>
          
          <div className="flex items-center gap-3">
            <span>Words: <strong className="text-gray-300 font-mono">{getWordCount()}</strong></span>
            <span>Characters: <strong className="text-gray-300 font-mono">{text.length}</strong></span>
          </div>
        </div>

      </div>

    </div>
  );
}
