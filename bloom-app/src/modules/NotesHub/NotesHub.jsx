import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Pin, 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  FileText,
  CornerDownRight,
  Maximize2
} from 'lucide-react';
import { useBloom } from '../../context/BloomContext';
import GlassCard from '../../components/GlassCard';

const NOTE_COLORS = [
  { hex: '#fee2e2', name: 'Pastel Red', border: 'border-red-300 dark:border-red-950', bg: 'bg-red-50/70 dark:bg-red-950/20' },
  { hex: '#fef3c7', name: 'Pastel Yellow', border: 'border-amber-300 dark:border-amber-950', bg: 'bg-amber-50/70 dark:bg-amber-950/20' },
  { hex: '#dcfce7', name: 'Pastel Green', border: 'border-emerald-300 dark:border-emerald-950', bg: 'bg-emerald-50/70 dark:bg-emerald-950/20' },
  { hex: '#e0f2fe', name: 'Pastel Blue', border: 'border-sky-300 dark:border-sky-950', bg: 'bg-sky-50/70 dark:bg-sky-950/20' },
  { hex: '#f3e8ff', name: 'Pastel Purple', border: 'border-purple-300 dark:border-purple-950', bg: 'bg-purple-50/70 dark:bg-purple-950/20' },
];

export default function NotesHub() {
  const { 
    notes, 
    addNote, 
    updateNote, 
    deleteNote, 
    searchQuery 
  } = useBloom();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [color, setColor] = useState('#fef3c7');
  const [selectedNote, setSelectedNote] = useState(null);

  // Filter notes based on search
  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pinnedNotes = filteredNotes.filter(n => n.pinned);
  const regularNotes = filteredNotes.filter(n => !n.pinned);

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!title.trim() && !content.trim()) return;
    addNote(title, content, color);
    setTitle('');
    setContent('');
    setColor('#fef3c7');
  };

  const handleTogglePin = (note, e) => {
    e.stopPropagation();
    updateNote(note.id, { pinned: !note.pinned });
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    deleteNote(id);
    if (selectedNote?.id === id) {
      setSelectedNote(null);
    }
  };

  const getColorInfo = (hexCode) => {
    return NOTE_COLORS.find(c => c.hex === hexCode) || NOTE_COLORS[1];
  };

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto overflow-y-auto h-[calc(100vh-4rem)] custom-scrollbar">
      
      {/* Quick Add Note Area */}
      <GlassCard className="max-w-xl mx-auto">
        <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
          <FileText size={18} className="text-theme-primary" />
          <span>Write a Note</span>
        </h3>
        
        <form onSubmit={handleAddNote} className="space-y-4">
          <input 
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title..."
            className="w-full px-4 py-2 rounded-2xl bg-white/30 dark:bg-black/20 border border-white/50 dark:border-white/5 focus:outline-none focus:border-theme-primary focus:ring-1 focus:ring-theme-primary/30 text-sm font-semibold placeholder-gray-400 dark:placeholder-gray-500 transition-all"
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write details..."
            rows={3}
            className="w-full px-4 py-3 rounded-2xl bg-white/30 dark:bg-black/20 border border-white/50 dark:border-white/5 focus:outline-none focus:border-theme-primary focus:ring-1 focus:ring-theme-primary/30 text-sm placeholder-gray-400 dark:placeholder-gray-500 transition-all resize-none custom-scrollbar"
          />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
            {/* Color Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase">Label</span>
              <div className="flex items-center gap-1.5">
                {NOTE_COLORS.map(c => (
                  <button
                    key={c.hex}
                    type="button"
                    onClick={() => setColor(c.hex)}
                    className={`w-6 h-6 rounded-full border-2 transition-all ${c.hex === color ? 'scale-110 border-theme-primary' : 'border-transparent hover:scale-105'}`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  />
                ))}
              </div>
            </div>

            <button 
              type="submit"
              disabled={!title.trim() && !content.trim()}
              className="w-full sm:w-auto py-2.5 px-6 rounded-2xl bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs shadow-glow disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-1.5"
            >
              <Plus size={14} />
              <span>Save Note</span>
            </button>
          </div>
        </form>
      </GlassCard>

      {/* Main Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Side (Span 1): Pinned and Important Notes */}
        <div className="lg:col-span-1 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="font-bold text-sm text-gray-400 dark:text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
              <Pin size={14} className="rotate-45" />
              <span>Pinned Notes</span>
            </h3>
            <span className="text-xs font-bold text-gray-400 dark:text-gray-500 bg-white/20 dark:bg-black/10 px-2 py-0.5 rounded-full">
              {pinnedNotes.length}
            </span>
          </div>

          <div className="space-y-4">
            {pinnedNotes.length === 0 ? (
              <div className="text-center py-8 text-xs text-gray-400 dark:text-gray-500 border border-dashed border-white/20 rounded-3xl p-4">
                No pinned notes. Tap the pin icon on a note to stick it here.
              </div>
            ) : (
              pinnedNotes.map(note => {
                const colorInfo = getColorInfo(note.color);
                return (
                  <motion.div
                    key={note.id}
                    layoutId={`note-card-${note.id}`}
                    onClick={() => setSelectedNote(note)}
                    className={`glass-card p-5 rounded-3xl cursor-pointer border-l-4 ${colorInfo.border} ${colorInfo.bg} hover:-translate-y-1 hover:shadow-md transition-all space-y-3 relative group`}
                  >
                    <button 
                      onClick={(e) => handleTogglePin(note, e)}
                      className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-white/50 dark:hover:bg-white/10 text-theme-primary transition-colors z-10"
                      title="Unpin Note"
                    >
                      <Pin size={14} className="fill-theme-primary text-theme-primary" />
                    </button>

                    <div className="pr-6">
                      <h4 className="font-bold text-gray-800 dark:text-gray-100 truncate">{note.title || 'Untitled'}</h4>
                      <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-3 mt-1.5 whitespace-pre-wrap leading-relaxed">
                        {note.content}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 text-[10px] text-gray-400 dark:text-gray-500 font-bold border-t border-black/5 dark:border-white/5">
                      <span>{new Date(note.updatedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                      <button 
                        onClick={(e) => handleDelete(note.id, e)}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-red-500/10 text-gray-400 hover:text-red-500 transition-all"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Side (Span 2): Regular Notes Grid */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="font-bold text-sm text-gray-400 dark:text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
              <FileText size={14} />
              <span>Regular Notes</span>
            </h3>
            <span className="text-xs font-bold text-gray-400 dark:text-gray-500 bg-white/20 dark:bg-black/10 px-2 py-0.5 rounded-full">
              {regularNotes.length}
            </span>
          </div>

          {regularNotes.length === 0 ? (
            <div className="text-center py-12 text-xs text-gray-400 dark:text-gray-500 border border-dashed border-white/20 rounded-3xl">
              No notes found. Keep track of your brilliant ideas here!
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {regularNotes.map(note => {
                const colorInfo = getColorInfo(note.color);
                return (
                  <motion.div
                    key={note.id}
                    layoutId={`note-card-${note.id}`}
                    onClick={() => setSelectedNote(note)}
                    className={`glass-card p-5 rounded-3xl cursor-pointer border-l-4 ${colorInfo.border} ${colorInfo.bg} hover:-translate-y-1 hover:shadow-md transition-all space-y-3 relative group`}
                  >
                    <button 
                      onClick={(e) => handleTogglePin(note, e)}
                      className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-white/50 dark:hover:bg-white/10 text-gray-400 hover:text-theme-primary transition-colors z-10 opacity-0 group-hover:opacity-100"
                      title="Pin Note"
                    >
                      <Pin size={14} className="rotate-45" />
                    </button>

                    <div className="pr-6">
                      <h4 className="font-bold text-gray-800 dark:text-gray-100 truncate">{note.title || 'Untitled'}</h4>
                      <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-3 mt-1.5 whitespace-pre-wrap leading-relaxed">
                        {note.content}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 text-[10px] text-gray-400 dark:text-gray-500 font-bold border-t border-black/5 dark:border-white/5">
                      <span>{new Date(note.updatedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                      <button 
                        onClick={(e) => handleDelete(note.id, e)}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-red-500/10 text-gray-400 hover:text-red-500 transition-all"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {/* Smooth Expanding Detail Modal */}
      <AnimatePresence>
        {selectedNote && (
          <div className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              layoutId={`note-card-${selectedNote.id}`}
              className="w-full max-w-lg rounded-3xl border border-white/20 shadow-2xl p-6 overflow-hidden flex flex-col max-h-[85vh] relative"
              style={{ backgroundColor: selectedNote.color }}
            >
              {/* Note Content (rendered for dark-mode readability) */}
              <div className="absolute inset-0 bg-white/70 dark:bg-gray-900/90 pointer-events-none z-0" />

              <div className="relative z-10 flex flex-col h-full space-y-4">
                {/* Header buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <button 
                      onClick={(e) => handleTogglePin(selectedNote, e)}
                      className="p-1.5 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 text-gray-500 hover:text-theme-primary transition-colors"
                      title={selectedNote.pinned ? "Unpin Note" : "Pin Note"}
                    >
                      <Pin size={16} className={selectedNote.pinned ? 'fill-theme-primary text-theme-primary' : 'rotate-45'} />
                    </button>
                    <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Editing Note</span>
                  </div>
                  
                  <button 
                    onClick={() => setSelectedNote(null)}
                    className="py-1 px-3 rounded-full bg-black/10 dark:bg-white/15 hover:bg-black/20 text-xs font-bold text-gray-700 dark:text-gray-200 transition-colors"
                  >
                    Done
                  </button>
                </div>

                {/* Editable Area */}
                <input 
                  type="text"
                  value={selectedNote.title}
                  onChange={(e) => updateNote(selectedNote.id, { title: e.target.value })}
                  placeholder="Note Title"
                  className="w-full bg-transparent border-b border-black/5 dark:border-white/10 pb-2 text-xl font-bold text-gray-800 dark:text-gray-100 focus:outline-none focus:border-theme-primary"
                />

                <textarea
                  value={selectedNote.content}
                  onChange={(e) => updateNote(selectedNote.id, { content: e.target.value })}
                  placeholder="Note Details..."
                  rows={10}
                  className="w-full bg-transparent flex-1 text-sm text-gray-700 dark:text-gray-300 focus:outline-none resize-none custom-scrollbar leading-relaxed"
                />

                {/* Footer details */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-black/5 dark:border-white/10 pt-4 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase">Change Color</span>
                    <div className="flex items-center gap-1">
                      {NOTE_COLORS.map(c => (
                        <button
                          key={c.hex}
                          onClick={() => updateNote(selectedNote.id, { color: c.hex })}
                          className={`w-5 h-5 rounded-full border-2 transition-all ${c.hex === selectedNote.color ? 'scale-110 border-theme-primary' : 'border-transparent hover:scale-105'}`}
                          style={{ backgroundColor: c.hex }}
                        />
                      ))}
                    </div>
                  </div>

                  <button 
                    onClick={(e) => handleDelete(selectedNote.id, e)}
                    className="py-1.5 px-3 rounded-xl hover:bg-red-500/10 text-red-500 text-xs font-bold transition-all flex items-center gap-1 ml-auto"
                  >
                    <Trash2 size={13} />
                    <span>Delete Note</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
