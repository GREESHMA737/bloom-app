import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Trash2, 
  Check, 
  Edit3, 
  Clock, 
  Sparkles,
  Calendar,
  AlertCircle,
  Flower
} from 'lucide-react';
import { useBloom } from '../../context/BloomContext';
import GlassCard from '../../components/GlassCard';
import confetti from 'canvas-confetti';

const FLOWER_EMOJIS = ['🌸', '🌹', '🌺', '🌻', '🌼', '🌷', '💐'];

export default function TodoGarden() {
  const { 
    todos, 
    addTodo, 
    toggleTodo, 
    deleteTodo, 
    editTodo,
    searchQuery 
  } = useBloom();

  const [text, setText] = useState('');
  const [priority, setPriority] = useState('medium');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [editPriority, setEditPriority] = useState('medium');

  // Filter based on search query
  const filteredTodos = todos.filter(todo => 
    todo.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const incompleteTodos = filteredTodos.filter(todo => !todo.completed);
  const completedTodos = filteredTodos.filter(todo => todo.completed);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    addTodo(text, priority);
    setText('');
    setPriority('medium');
  };

  const handleToggle = (id, wasCompleted) => {
    toggleTodo(id);
    if (!wasCompleted) {
      // Trigger a confetti burst when completing a task
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#a78bfa', '#f472b6', '#34d399', '#38bdf8', '#fb923c']
      });
    }
  };

  const startEdit = (todo) => {
    setEditingId(todo.id);
    setEditText(todo.text);
    setEditPriority(todo.priority);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editText.trim()) return;
    editTodo(editingId, editText, editPriority);
    setEditingId(null);
  };

  // Get flower icon details depending on priority
  const getPriorityColor = (pri) => {
    switch (pri) {
      case 'high': return 'text-red-500 bg-red-100 dark:bg-red-950/40 border-red-200 dark:border-red-900/30';
      case 'medium': return 'text-orange-500 bg-orange-100 dark:bg-orange-950/40 border-orange-200 dark:border-orange-900/30';
      default: return 'text-blue-500 bg-blue-100 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900/30';
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-6xl mx-auto overflow-y-auto h-[calc(100vh-4rem)] custom-scrollbar">
      
      {/* Visual Garden Area */}
      <GlassCard className="relative overflow-hidden bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent border-emerald-500/20">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-xl font-bold flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <Flower className="animate-pulse" />
              <span>Your Personal Growth Garden</span>
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Seeds 🌱 grow into beautiful flowers 🌸 when tasks are conquered. Keep watering your habits!
            </p>
          </div>
          <div className="text-xs font-bold text-emerald-600 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
            {completedTodos.length} / {todos.length} Conquered
          </div>
        </div>

        {/* Garden Grid */}
        <div className="bg-white/30 dark:bg-black/20 rounded-3xl p-6 border border-white/40 dark:border-white/5 min-h-[140px] flex flex-wrap gap-6 justify-center items-end">
          {todos.length === 0 ? (
            <div className="text-center py-6 text-xs text-gray-400 dark:text-gray-500">
              Your garden is empty. Add a task to sow your first seed! 🌱
            </div>
          ) : (
            todos.map((todo, idx) => {
              // Assign a stable flower based on index
              const flower = FLOWER_EMOJIS[idx % FLOWER_EMOJIS.length];
              
              return (
                <motion.div 
                  key={todo.id}
                  layout
                  className="flex flex-col items-center group relative cursor-pointer"
                  title={todo.text}
                >
                  <AnimatePresence mode="wait">
                    {todo.completed ? (
                      <motion.div
                        key="flower"
                        initial={{ scale: 0, rotate: -45 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0 }}
                        className="text-4xl filter drop-shadow-md select-none hover:scale-125 transition-transform duration-200"
                      >
                        {flower}
                      </motion.div>
                    ) : (
                      <motion.div
                        key="seed"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="text-2xl filter drop-shadow-md select-none hover:scale-110 transition-transform duration-200"
                      >
                        🌱
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  {/* Decorative Pot */}
                  <div className="w-8 h-5 bg-amber-700/80 rounded-b-lg mt-1 border-t border-amber-600 relative">
                    <div className="absolute top-0 inset-x-0 h-1 bg-amber-600 rounded-t-sm" />
                  </div>

                  {/* Tooltip */}
                  <div className="absolute bottom-full mb-2 hidden group-hover:block z-10 w-32 text-center bg-gray-900/90 dark:bg-white/90 text-white dark:text-black text-[10px] p-1.5 rounded-lg font-medium shadow-md backdrop-blur-sm pointer-events-none line-clamp-2">
                    {todo.text}
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Form Column (Span 1) */}
        <div className="lg:col-span-1 space-y-6">
          <GlassCard>
            <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-1.5">
              <span>Sow a Seed</span>
              <Sparkles size={16} className="text-theme-primary" />
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase mb-1.5">Task Description</label>
                <input 
                  type="text" 
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="e.g. Meditate for 10 minutes"
                  className="w-full px-4 py-2.5 rounded-2xl bg-white/40 dark:bg-black/20 border border-white/60 dark:border-white/10 focus:outline-none focus:border-theme-primary focus:ring-1 focus:ring-theme-primary/30 text-sm placeholder-gray-400 dark:placeholder-gray-500 transition-all"
                  maxLength={100}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase mb-1.5">Priority</label>
                <div className="grid grid-cols-3 gap-2">
                  {['low', 'medium', 'high'].map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={`py-2 px-3 text-xs font-bold rounded-xl border capitalize transition-all ${
                        priority === p 
                          ? 'bg-theme-primary text-white border-theme-primary' 
                          : 'bg-white/30 dark:bg-white/5 border-white/60 dark:border-white/10 hover:border-theme-primary'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                type="submit"
                disabled={!text.trim()}
                className="w-full py-3 px-4 rounded-2xl bg-theme-primary text-white font-bold text-sm hover:opacity-95 shadow-glow disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                <Plus size={16} />
                <span>Plant Seed</span>
              </button>
            </form>
          </GlassCard>
        </div>

        {/* Right Tasks List Column (Span 2) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Seeds List */}
          <GlassCard>
            <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
              <Clock size={18} className="text-theme-primary" />
              <span>Growing Seeds</span>
              <span className="text-xs bg-theme-primary/10 text-theme-primary px-2.5 py-0.5 rounded-full font-bold">
                {incompleteTodos.length}
              </span>
            </h3>

            <div className="space-y-3">
              <AnimatePresence initial={false}>
                {incompleteTodos.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-8 text-xs text-gray-400 dark:text-gray-500"
                  >
                    No pending seeds growing. Great job! 🌱
                  </motion.div>
                ) : (
                  incompleteTodos.map(todo => (
                    <motion.div
                      key={todo.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="flex items-center justify-between p-4 rounded-2xl bg-white/20 dark:bg-white/5 border border-white/40 dark:border-white/5 hover:border-theme-primary transition-all group"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {/* Custom Animated Checkbox */}
                        <button
                          onClick={() => handleToggle(todo.id, todo.completed)}
                          className="w-6 h-6 rounded-full border border-gray-300 dark:border-gray-600 hover:border-theme-primary flex items-center justify-center bg-white/50 dark:bg-black/20 transition-all group-hover:scale-105 shrink-0"
                        >
                          <Check size={12} className="opacity-0 group-hover:opacity-30 text-theme-primary" />
                        </button>

                        <div className="flex flex-col gap-1 min-w-0">
                          <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate pr-4">{todo.text}</span>
                          <div className="flex items-center gap-1.5">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getPriorityColor(todo.priority)}`}>
                              {todo.priority}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button 
                          onClick={() => startEdit(todo)}
                          className="p-2 rounded-lg hover:bg-white/40 dark:hover:bg-white/10 text-gray-500 hover:text-theme-primary transition-colors"
                          title="Edit Task"
                        >
                          <Edit3 size={15} />
                        </button>
                        <button 
                          onClick={() => deleteTodo(todo.id)}
                          className="p-2 rounded-lg hover:bg-red-500/10 dark:hover:bg-red-500/20 text-gray-500 hover:text-red-500 transition-colors"
                          title="Delete Task"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </GlassCard>

          {/* Things I Conquered List */}
          <GlassCard>
            <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
              <Sparkles size={18} className="text-emerald-500" />
              <span>🌟 Things I Conquered</span>
              <span className="text-xs bg-emerald-500/10 text-emerald-500 px-2.5 py-0.5 rounded-full font-bold">
                {completedTodos.length}
              </span>
            </h3>

            <div className="space-y-3">
              <AnimatePresence initial={false}>
                {completedTodos.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-8 text-xs text-gray-400 dark:text-gray-500"
                  >
                    Nothing conquered yet today. Complete a task to list it here!
                  </motion.div>
                ) : (
                  completedTodos.map(todo => (
                    <motion.div
                      key={todo.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="flex items-center justify-between p-4 rounded-2xl bg-emerald-500/5 dark:bg-emerald-500/5 border border-emerald-500/10 dark:border-emerald-500/10 group"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {/* Checkbox completed state */}
                        <button
                          onClick={() => handleToggle(todo.id, todo.completed)}
                          className="w-6 h-6 rounded-full bg-emerald-500 hover:bg-emerald-600 flex items-center justify-center transition-all shrink-0 text-white"
                        >
                          <Check size={12} />
                        </button>

                        <div className="flex flex-col gap-1 min-w-0">
                          <span className="text-sm line-through font-semibold text-gray-500 dark:text-gray-400 truncate pr-4">{todo.text}</span>
                          {todo.completedAt && (
                            <span className="text-[9px] text-gray-400 dark:text-gray-500 flex items-center gap-1 font-bold">
                              <Calendar size={10} />
                              <span>Completed {new Date(todo.completedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                            </span>
                          )}
                        </div>
                      </div>

                      <button 
                        onClick={() => deleteTodo(todo.id)}
                        className="p-2 rounded-lg hover:bg-red-500/10 dark:hover:bg-red-500/20 text-gray-400 hover:text-red-500 transition-colors shrink-0"
                        title="Delete Completed Task"
                      >
                        <Trash2 size={15} />
                      </button>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Edit Task Modal Dialog */}
      {editingId && (
        <div className="fixed inset-0 bg-black/30 dark:bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md rounded-3xl glass-card bg-white/95 dark:bg-gray-900/95 border border-white/20 p-6 space-y-4"
          >
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Edit Garden Seed</h3>
            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase mb-1.5">Task Description</label>
                <input 
                  type="text" 
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-white/40 dark:bg-black/20 border border-white/60 dark:border-white/10 focus:outline-none focus:border-theme-primary focus:ring-1 focus:ring-theme-primary/30 text-sm transition-all"
                  maxLength={100}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase mb-1.5">Priority</label>
                <div className="grid grid-cols-3 gap-2">
                  {['low', 'medium', 'high'].map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setEditPriority(p)}
                      className={`py-2 px-3 text-xs font-bold rounded-xl border capitalize transition-all ${
                        editPriority === p 
                          ? 'bg-theme-primary text-white border-theme-primary' 
                          : 'bg-white/30 dark:bg-white/5 border-white/60 dark:border-white/10 hover:border-theme-primary'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingId(null)}
                  className="w-1/2 py-3 px-4 rounded-2xl border border-gray-200 dark:border-gray-800 text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!editText.trim()}
                  className="w-1/2 py-3 px-4 rounded-2xl bg-theme-primary text-white font-bold text-xs hover:opacity-95 shadow-glow transition-all"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

    </div>
  );
}
