import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Mail, 
  Lock, 
  Settings, 
  AlertCircle, 
  CheckCircle, 
  Flower2, 
  Link as LinkIcon, 
  Info 
} from 'lucide-react';
import { 
  isSupabaseConfigured, 
  saveSupabaseConfig, 
  clearSupabaseConfig, 
  getSupabaseConfig 
} from '../utils/supabaseClient';

export default function AuthOverlay({ isOpen, onClose, onAuthSuccess, supabaseClient }) {
  const [view, setView] = useState('login'); // 'login' | 'signup' | 'config' | 'reset'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  
  // Supabase Configuration inputs
  const currentConfig = getSupabaseConfig();
  const [dbUrl, setDbUrl] = useState(currentConfig.url || '');
  const [dbKey, setDbKey] = useState(currentConfig.key || '');
  const [isConfigured, setIsConfigured] = useState(isSupabaseConfigured());

  if (!isOpen) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return setError('Please enter both email and password.');
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const { data, error: authErr } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      });

      if (authErr) throw authErr;
      setMessage('Successfully logged in!');
      setTimeout(() => {
        onAuthSuccess();
        onClose();
      }, 1000);
    } catch (err) {
      setError(err.message || 'An error occurred during log in.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!email || !password) return setError('Please enter both email and password.');
    if (password.length < 6) return setError('Password must be at least 6 characters.');
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const { data, error: authErr } = await supabaseClient.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
        },
      });

      if (authErr) throw authErr;
      
      // Supabase can return success but user requires verification
      if (data?.user && data.session === null) {
        setMessage('Registration successful! Please check your email to confirm registration.');
      } else {
        setMessage('Registration successful and logged in!');
        setTimeout(() => {
          onAuthSuccess();
          onClose();
        }, 1200);
      }
    } catch (err) {
      setError(err.message || 'An error occurred during registration.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (!email) return setError('Please enter your email address.');
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const { error: resetErr } = await supabaseClient.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin,
      });

      if (resetErr) throw resetErr;
      setMessage('Password reset link sent to your email.');
    } catch (err) {
      setError(err.message || 'Error sending password reset link.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveConfig = (e) => {
    e.preventDefault();
    if (!dbUrl || !dbKey) return setError('Please fill in both database URL and Anon key.');
    if (!dbUrl.startsWith('https://') || !dbUrl.includes('.supabase.co')) {
      return setError('Invalid Supabase Project URL.');
    }

    saveSupabaseConfig(dbUrl, dbKey);
    setIsConfigured(true);
    setMessage('Database configuration saved! Reloading...');
    setError('');
    
    setTimeout(() => {
      window.location.reload();
    }, 1200);
  };

  const handleDisconnect = () => {
    clearSupabaseConfig();
    setIsConfigured(false);
    setDbUrl('');
    setDbKey('');
    setMessage('Supabase connection cleared. Reloading...');
    
    setTimeout(() => {
      window.location.reload();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-md glass-card bg-white/95 dark:bg-gray-950/95 border border-white/20 p-6 rounded-[32px] shadow-2xl relative overflow-hidden"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 transition-colors"
        >
          <X size={18} />
        </button>

        {/* Decorative Flower logo */}
        <div className="flex justify-center mb-4 pt-2">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            className="text-blue-500 text-glow"
          >
            <Flower2 size={36} />
          </motion.div>
        </div>

        {/* Header Title */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-black text-slate-950 dark:text-white">
            {view === 'config' ? 'Supabase Settings' : 'Personal Growth Vault'}
          </h2>
          <p className="text-xs text-slate-700 dark:text-slate-300 font-bold mt-1">
            {view === 'config' 
              ? 'Connect your personal database to store your vaults'
              : 'Sync your journals, todos, and memories securely across devices'}
          </p>
        </div>

        {/* Info alerts */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs flex items-center gap-2 font-medium">
            <AlertCircle size={14} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {message && (
          <div className="mb-4 p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-500 text-xs flex items-center gap-2 font-medium">
            <CheckCircle size={14} className="shrink-0" />
            <span>{message}</span>
          </div>
        )}

        {/* View Routing */}
        <AnimatePresence mode="wait">
          {!isConfigured && view !== 'config' ? (
            <motion.div
              key="no-config"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="space-y-4"
            >
              <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs space-y-2">
                <div className="flex items-center gap-1.5 font-bold">
                  <Info size={14} />
                  <span>Supabase Database Connection Required</span>
                </div>
                <p className="leading-relaxed font-semibold">
                  Personal accounts require Supabase settings to be configured. You can input your connection keys to set up a private database wall.
                </p>
              </div>

              <button
                onClick={() => setView('config')}
                className="w-full py-2.5 px-4 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-md"
              >
                <Settings size={14} />
                <span>Configure Database Keys</span>
              </button>

              <button
                onClick={onClose}
                className="w-full py-2 px-4 rounded-xl bg-black/5 dark:bg-white/5 text-slate-800 dark:text-slate-200 font-black text-xs hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
              >
                Continue in Guest Mode (Offline)
              </button>
            </motion.div>
          ) : view === 'config' ? (
            <motion.div
              key="config-form"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
            >
              <form onSubmit={handleSaveConfig} className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-black text-slate-800 dark:text-slate-300 uppercase tracking-wider mb-1">Project URL</label>
                    <div className="relative">
                      <LinkIcon size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-700 dark:text-slate-300" />
                      <input
                        type="url"
                        value={dbUrl}
                        onChange={(e) => setDbUrl(e.target.value)}
                        placeholder="https://your-project.supabase.co"
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/40 dark:bg-black/25 border border-slate-300 dark:border-white/10 focus:outline-none focus:border-blue-500 text-xs font-black text-slate-950 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-800 dark:text-slate-300 uppercase tracking-wider mb-1">Anon API Key</label>
                    <div className="relative">
                      <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-700 dark:text-slate-300" />
                      <input
                        type="password"
                        value={dbKey}
                        onChange={(e) => setDbKey(e.target.value)}
                        placeholder="eyJhbGciOi..."
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/40 dark:bg-black/25 border border-slate-300 dark:border-white/10 focus:outline-none focus:border-blue-500 text-xs font-black text-slate-950 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 px-4 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-md"
                  >
                    Save Settings
                  </button>
                  {isConfigured && (
                    <button
                      type="button"
                      onClick={handleDisconnect}
                      className="py-2.5 px-4 rounded-xl bg-red-500/10 text-red-500 border border-red-500/10 font-bold text-xs hover:bg-red-500/15 transition-all"
                    >
                      Disconnect
                    </button>
                  )}
                </div>

                {isConfigured && (
                  <button
                    type="button"
                    onClick={() => setView('login')}
                    className="w-full py-2.5 px-4 rounded-xl bg-black/5 dark:bg-white/5 text-slate-800 dark:text-slate-200 font-black text-xs hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                  >
                    Back to Log In
                  </button>
                )}
              </form>
            </motion.div>
          ) : view === 'login' ? (
            <motion.div
              key="login-form"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
            >
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-3">
                  <div className="relative">
                    <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-700 dark:text-slate-300" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email Address"
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/40 dark:bg-black/25 border border-slate-300 dark:border-white/10 focus:outline-none focus:border-blue-500 text-xs font-black text-slate-950 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
                    />
                  </div>

                  <div className="relative">
                    <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-700 dark:text-slate-300" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/40 dark:bg-black/25 border border-slate-300 dark:border-white/10 focus:outline-none focus:border-blue-500 text-xs font-black text-slate-950 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
                    />
                  </div>
                </div>

                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => setView('reset')}
                    className="text-[10px] font-black text-slate-800 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-black text-xs transition-all flex items-center justify-center gap-1.5 shadow-md"
                >
                  {loading ? 'Logging in...' : 'Log In to Vault'}
                </button>

                <div className="text-center pt-2 text-[11px] font-black text-slate-800 dark:text-slate-300">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setView('signup')}
                    className="text-blue-600 dark:text-blue-400 hover:underline font-black"
                  >
                    Create Account
                  </button>
                </div>

                <div className="flex justify-center gap-2 pt-2 border-t border-black/5 dark:border-white/5">
                  <button
                    type="button"
                    onClick={() => setView('config')}
                    className="text-[10px] font-black text-slate-800 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white flex items-center gap-1"
                  >
                    <Settings size={12} /> Database Settings
                  </button>
                </div>
              </form>
            </motion.div>
          ) : view === 'signup' ? (
            <motion.div
              key="signup-form"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
            >
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-3">
                  <div className="relative">
                    <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-700 dark:text-slate-300" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email Address"
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/40 dark:bg-black/25 border border-slate-300 dark:border-white/10 focus:outline-none focus:border-blue-500 text-xs font-black text-slate-950 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
                    />
                  </div>

                  <div className="relative">
                    <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-700 dark:text-slate-300" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create Password (min 6 chars)"
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/40 dark:bg-black/25 border border-slate-300 dark:border-white/10 focus:outline-none focus:border-blue-500 text-xs font-black text-slate-950 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-black text-xs transition-all flex items-center justify-center gap-1.5 shadow-md"
                >
                  {loading ? 'Creating Account...' : 'Register Account'}
                </button>

                <div className="text-center pt-2 text-[11px] font-black text-slate-800 dark:text-slate-300">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setView('login')}
                    className="text-blue-600 dark:text-blue-400 hover:underline font-black"
                  >
                    Log In
                  </button>
                </div>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="reset-form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <form onSubmit={handlePasswordReset} className="space-y-4">
                <div className="space-y-3">
                  <div className="relative">
                    <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-700 dark:text-slate-300" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Your Email Address"
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/40 dark:bg-black/25 border border-slate-300 dark:border-white/10 focus:outline-none focus:border-blue-500 text-xs font-black text-slate-950 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-black text-xs transition-all flex items-center justify-center shadow-md"
                >
                  {loading ? 'Sending link...' : 'Send Reset Link'}
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => setView('login')}
                    className="text-[11px] font-black text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Back to Log In
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
