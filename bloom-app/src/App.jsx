import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BloomProvider } from './context/BloomContext';
import Sidebar from './components/Sidebar';
import TopNavbar from './components/TopNavbar';
import Dashboard from './modules/Dashboard/Dashboard';
import TodoGarden from './modules/TodoGarden/TodoGarden';
import NotesHub from './modules/NotesHub/NotesHub';
import JournalDiary from './modules/JournalDiary/JournalDiary';
import BucketList from './modules/BucketList/BucketList';
import TimeCapsule from './modules/TimeCapsule/TimeCapsule';
import DumpThoughts from './modules/DumpThoughts/DumpThoughts';
import MemoryWall from './modules/MemoryWall/MemoryWall';
import LettersToFuture from './modules/LettersToFuture/LettersToFuture';
import GratitudeJar from './modules/GratitudeJar/GratitudeJar';
import AuthOverlay from './components/AuthOverlay';
import { supabase } from './utils/supabaseClient';

function AppContent() {
  const [activeView, setActiveView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard setActiveView={setActiveView} />;
      case 'todo':
        return <TodoGarden />;
      case 'notes':
        return <NotesHub />;
      case 'journal':
        return <JournalDiary />;
      case 'bucket':
        return <BucketList />;
      case 'capsule':
        return <TimeCapsule />;
      case 'thoughts':
        return <DumpThoughts />;
      case 'memory':
        return <MemoryWall />;
      case 'letters':
        return <LettersToFuture />;
      case 'gratitude':
        return <GratitudeJar />;
      default:
        return <Dashboard setActiveView={setActiveView} />;
    }
  };

  return (
    <div className="flex min-h-screen overflow-hidden">
      {/* Sidebar Navigation */}
      <Sidebar 
        activeView={activeView} 
        setActiveView={setActiveView} 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
      />
      
      {/* Main Container Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header Navbar */}
        <TopNavbar 
          onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
          activeView={activeView}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          setActiveView={setActiveView}
          authModalOpen={authModalOpen}
          setAuthModalOpen={setAuthModalOpen}
        />
        
        {/* Render Active view tab inside animated Framer Motion wrappers */}
        <main className="flex-1 relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="w-full h-full"
            >
              {renderActiveView()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Supabase Auth Modal Dialog rendered outside containing blocks */}
      <AuthOverlay
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onAuthSuccess={() => console.log('Auth success')}
        supabaseClient={supabase}
      />
    </div>
  );
}

export default function App() {
  return (
    <BloomProvider>
      <AppContent />
    </BloomProvider>
  );
}
