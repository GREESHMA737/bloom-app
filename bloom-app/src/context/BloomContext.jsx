import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../utils/supabaseClient';

const BloomContext = createContext();

// Curated stock photos for memories and capsules
const DEFAULT_MEMORIES = [
  {
    id: 'mem-1',
    title: 'Spring Blossom Walk',
    caption: 'Found the most beautiful cherry blossom tree in the local park. The petals were falling like pink snow.',
    photo: 'https://images.unsplash.com/photo-1522748906645-95d8adfd52c7?auto=format&fit=crop&q=80&w=800',
    date: '2026-04-12',
    emotion: 'Peaceful',
    location: 'Central Park Garden'
  },
  {
    id: 'mem-2',
    title: 'Late Night Coffee & Coding',
    caption: 'Cozy study session at the 24/7 cafe. The rain outside was the perfect soundtrack.',
    photo: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&q=80&w=800',
    date: '2026-05-18',
    emotion: 'Inspired',
    location: 'Cozy Brew Cafe'
  },
  {
    id: 'mem-3',
    title: 'Warm Beach Sunset',
    caption: 'Dipped my feet in the freezing ocean water. The horizon looked like a painted canvas of orange and violet.',
    photo: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800',
    date: '2026-06-01',
    emotion: 'Grateful',
    location: 'Pacific Coastline'
  }
];

const DEFAULT_TODOS = [
  { id: 'todo-1', text: 'Meditate for 10 minutes in the garden', priority: 'medium', completed: false, completedAt: null },
  { id: 'todo-2', text: 'Write a page in my memory journal', priority: 'high', completed: false, completedAt: null },
  { id: 'todo-3', text: 'Buy fresh lavender flowers for room decor', priority: 'low', completed: true, completedAt: '2026-06-10T14:00:00.000Z' },
  { id: 'todo-4', text: 'Drink 3 liters of water today', priority: 'medium', completed: true, completedAt: '2026-06-10T12:00:00.000Z' }
];

const DEFAULT_NOTES = [
  { id: 'note-1', title: '💡 Manifestation Goals', content: '1. Keep blooming every day.\n2. Prioritize mental health and screen time boundaries.\n3. Create art without worrying about the final outcome.', color: '#fef3c7', pinned: true, updatedAt: '2026-06-10T10:00:00.000Z' },
  { id: 'note-2', title: '📚 Summer Reading List', content: '- "The Midnight Library" by Matt Haig\n- "Before the Coffee Gets Cold" by Toshikazu Kawaguchi\n- "Braiding Sweetgrass" by Robin Wall Kimmerer', color: '#e0f2fe', pinned: false, updatedAt: '2026-06-09T15:30:00.000Z' },
  { id: 'note-3', title: '🎵 Vibes & Playlists', content: 'Late night lofi, acoustic folk for rainy days, and high-energy synthwave for code sprints.', color: '#f3e8ff', pinned: false, updatedAt: '2026-06-08T09:15:00.000Z' }
];

const DEFAULT_JOURNALS = [
  {
    id: 'j-1',
    date: '2026-06-10',
    title: 'A serene rainy afternoon',
    content: 'Today was quiet. I sat near the window with a warm mug of jasmine tea and watched the raindrops slide down the glass. Sometimes, doing absolutely nothing is the best type of healing. I feel content.',
    mood: 'calm',
    goodThing: 'I made a delicious homemade matcha latte and read three chapters of my book.'
  }
];

const DEFAULT_BUCKET = [
  { id: 'b-1', text: 'Visit Japan during cherry blossom season', emoji: '✈️', progress: 40, completed: false },
  { id: 'b-2', text: 'Learn to play "Fly Me to the Moon" on guitar', emoji: '🎸', progress: 100, completed: true },
  { id: 'b-3', text: 'Graduate with computer science degree', emoji: '🎓', progress: 85, completed: false },
  { id: 'b-4', text: 'Build a premium full-stack digital companion app', emoji: '🌸', progress: 100, completed: true }
];

// Calculate standard future unlock dates relative to local time (June 2026)
const getFutureDateString = (daysAhead) => {
  const d = new Date('2026-06-10T19:35:05');
  d.setDate(d.getDate() + daysAhead);
  return d.toISOString();
};

const getPastDateString = (daysAgo) => {
  const d = new Date('2026-06-10T19:35:05');
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString();
};

const DEFAULT_CAPSULES = [
  {
    id: 'cap-1',
    title: 'My 20th Birthday Vault',
    message: 'To future me! Remember how excited you were about launching this vault. You were learning React, listening to endless lofi tracks, and dreaming of big tech adventures. Here is to growing older, wiser, and happier!',
    photos: ['https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80&w=800'],
    unlockDate: getPastDateString(2), // Already unlocked
    unlocked: false
  },
  {
    id: 'cap-2',
    title: 'Future Graduation Hopes',
    message: 'Hey you! If you are opening this, you probably graduated or are about to! Remember the sleepless nights, the group project headaches, and the endless cups of coffee. I hope you are proud of yourself because I am proud of you.',
    photos: ['https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800'],
    unlockDate: getFutureDateString(10), // Locked
    unlocked: false
  }
];

const DEFAULT_LETTERS = [
  {
    id: 'let-1',
    title: 'A gentle reminder for hard days',
    content: 'Dear Future Self,\n\nIf today is a difficult day, remember that you have survived 100% of your hardest days so far. Take a deep breath, make a cup of warm chamomile tea, and shut off your phone. The storm will pass, and you will bloom again.\n\nWith all my love,\nPast You.',
    openDate: getPastDateString(5), // Unlocked
    unlocked: false
  },
  {
    id: 'let-2',
    title: 'Letter to open at the end of 2026',
    content: 'Hey buddy!\n\nHow did the rest of 2026 treat you? Did you travel? Did you learn that new song? Did you stay close to the people who make you feel like sunshine?\nI hope you are sitting somewhere cozy reading this with a smile. Never lose your wonder.\n\nWarmly,\nJune 2026 version of you.',
    openDate: getFutureDateString(200), // Locked
    unlocked: false
  }
];

const DEFAULT_GRATITUDE = [
  { id: 'grat-1', content: 'Grateful for the warm sun peeking through my window this morning. ☀️', createdAt: getPastDateString(2) },
  { id: 'grat-2', content: 'I am thankful for warm coding sessions with a hot matcha latte. 🍵✨', createdAt: getPastDateString(1) },
  { id: 'grat-3', content: 'So grateful for friends who make me laugh until my stomach hurts! 😂', createdAt: getPastDateString(0) }
];

export const BloomProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);

  // Theme and UI Mode states
  const [activeTheme, setActiveTheme] = useState(() => {
    return localStorage.getItem('bloom-theme') || 'theme-lavender';
  });
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('bloom-dark') === 'true';
  });

  // Module state variables
  const [todos, setTodos] = useState([]);
  const [notes, setNotes] = useState([]);
  const [journals, setJournals] = useState([]);
  const [bucketList, setBucketList] = useState([]);
  const [timeCapsules, setTimeCapsules] = useState([]);
  const [dumpThoughts, setDumpThoughts] = useState('');
  const [memories, setMemories] = useState([]);
  const [letters, setLetters] = useState([]);
  const [gratitudeNotes, setGratitudeNotes] = useState([]);
  const [streak, setStreak] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  // Initial Sync / Load Local Storage backup
  const loadLocalStorageData = () => {
    const localTodos = localStorage.getItem('bloom-todos');
    setTodos(localTodos ? JSON.parse(localTodos) : DEFAULT_TODOS);
    
    const localNotes = localStorage.getItem('bloom-notes');
    setNotes(localNotes ? JSON.parse(localNotes) : DEFAULT_NOTES);

    const localJournals = localStorage.getItem('bloom-journals');
    setJournals(localJournals ? JSON.parse(localJournals) : DEFAULT_JOURNALS);

    const localBucket = localStorage.getItem('bloom-bucket');
    setBucketList(localBucket ? JSON.parse(localBucket) : DEFAULT_BUCKET);

    const localCapsules = localStorage.getItem('bloom-capsules');
    setTimeCapsules(localCapsules ? JSON.parse(localCapsules) : DEFAULT_CAPSULES);

    const localThoughts = localStorage.getItem('bloom-thoughts');
    setDumpThoughts(localThoughts || '');

    const localMemories = localStorage.getItem('bloom-memories');
    setMemories(localMemories ? JSON.parse(localMemories) : DEFAULT_MEMORIES);

    const localLetters = localStorage.getItem('bloom-letters');
    setLetters(localLetters ? JSON.parse(localLetters) : DEFAULT_LETTERS);

    const localGratitude = localStorage.getItem('bloom-gratitude');
    setGratitudeNotes(localGratitude ? JSON.parse(localGratitude) : DEFAULT_GRATITUDE);

    setStreak(Number(localStorage.getItem('bloom-streak')) || 0);
    setActiveTheme(localStorage.getItem('bloom-theme') || 'theme-lavender');
    setIsDarkMode(localStorage.getItem('bloom-dark') === 'true');
  };

  const syncDataFromSupabase = async (user) => {
    if (!supabase) return;
    try {
      // 1. Profile / Settings
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (profile) {
        setStreak(profile.streak);
        setActiveTheme(profile.active_theme);
        setIsDarkMode(profile.is_dark_mode);
        setDumpThoughts(profile.dump_thoughts || '');
      }

      // 2. Todos
      const { data: dbTodos } = await supabase.from('todos').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
      if (dbTodos) {
        setTodos(dbTodos.map(t => ({
          id: t.id,
          text: t.text,
          priority: t.priority,
          completed: t.completed,
          completedAt: t.completed_at
        })));
      } else {
        setTodos([]);
      }

      // 3. Notes
      const { data: dbNotes } = await supabase.from('notes').select('*').eq('user_id', user.id).order('updated_at', { ascending: false });
      if (dbNotes) {
        setNotes(dbNotes.map(n => ({
          id: n.id,
          title: n.title,
          content: n.content,
          color: n.color,
          pinned: n.pinned,
          updatedAt: n.updated_at
        })));
      } else {
        setNotes([]);
      }

      // 4. Journals
      const { data: dbJournals } = await supabase.from('journals').select('*').eq('user_id', user.id).order('date', { ascending: false });
      if (dbJournals) {
        setJournals(dbJournals.map(j => ({
          id: j.id,
          date: j.date,
          title: j.title,
          content: j.content,
          mood: j.mood,
          goodThing: j.good_thing
        })));
      } else {
        setJournals([]);
      }

      // 5. Bucket List
      const { data: dbBucket } = await supabase.from('bucket_list').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
      if (dbBucket) {
        setBucketList(dbBucket.map(b => ({
          id: b.id,
          text: b.text,
          emoji: b.emoji,
          progress: b.progress,
          completed: b.completed
        })));
      } else {
        setBucketList([]);
      }

      // 6. Time Capsules
      const { data: dbCapsules } = await supabase.from('time_capsules').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
      if (dbCapsules) {
        setTimeCapsules(dbCapsules.map(c => ({
          id: c.id,
          title: c.title,
          message: c.message,
          photos: c.photos,
          unlockDate: c.unlock_date,
          unlocked: c.unlocked
        })));
      } else {
        setTimeCapsules([]);
      }

      // 7. Memories
      const { data: dbMemories } = await supabase.from('memories').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
      if (dbMemories) {
        setMemories(dbMemories.map(m => ({
          id: m.id,
          title: m.title,
          caption: m.caption,
          photo: m.photo,
          date: m.date,
          emotion: m.emotion,
          location: m.location
        })));
      } else {
        setMemories([]);
      }

      // 8. Letters
      const { data: dbLetters } = await supabase.from('letters').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
      if (dbLetters) {
        setLetters(dbLetters.map(l => ({
          id: l.id,
          title: l.title,
          content: l.content,
          openDate: l.open_date,
          unlocked: l.unlocked
        })));
      } else {
        setLetters([]);
      }

      // 9. Gratitude Notes
      const { data: dbGratitude } = await supabase.from('gratitude_notes').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
      if (dbGratitude) {
        setGratitudeNotes(dbGratitude.map(g => ({
          id: g.id,
          content: g.content,
          createdAt: g.created_at
        })));
      } else {
        setGratitudeNotes([]);
      }

    } catch (err) {
      console.error('Error fetching data from Supabase:', err);
    }
  };

  // Auth Listener
  useEffect(() => {
    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          setAuthUser(session.user);
          syncDataFromSupabase(session.user);
        } else {
          loadLocalStorageData();
        }
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          setAuthUser(session.user);
          await syncDataFromSupabase(session.user);
        } else {
          setAuthUser(null);
          loadLocalStorageData();
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    } else {
      loadLocalStorageData();
    }
  }, []);

  // Sync to localStorage ONLY in offline/guest mode
  useEffect(() => {
    if (!authUser) localStorage.setItem('bloom-todos', JSON.stringify(todos));
  }, [todos, authUser]);

  useEffect(() => {
    if (!authUser) localStorage.setItem('bloom-notes', JSON.stringify(notes));
  }, [notes, authUser]);

  useEffect(() => {
    if (!authUser) localStorage.setItem('bloom-journals', JSON.stringify(journals));
  }, [journals, authUser]);

  useEffect(() => {
    if (!authUser) localStorage.setItem('bloom-bucket', JSON.stringify(bucketList));
  }, [bucketList, authUser]);

  useEffect(() => {
    if (!authUser) localStorage.setItem('bloom-capsules', JSON.stringify(timeCapsules));
  }, [timeCapsules, authUser]);

  useEffect(() => {
    if (!authUser) localStorage.setItem('bloom-thoughts', dumpThoughts);
  }, [dumpThoughts, authUser]);

  useEffect(() => {
    if (!authUser) localStorage.setItem('bloom-memories', JSON.stringify(memories));
  }, [memories, authUser]);

  useEffect(() => {
    if (!authUser) localStorage.setItem('bloom-letters', JSON.stringify(letters));
  }, [letters, authUser]);

  useEffect(() => {
    if (!authUser) localStorage.setItem('bloom-gratitude', JSON.stringify(gratitudeNotes));
  }, [gratitudeNotes, authUser]);

  useEffect(() => {
    if (!authUser) localStorage.setItem('bloom-streak', streak.toString());
  }, [streak, authUser]);

  // CSS theme apply hook
  useEffect(() => {
    if (!authUser) {
      localStorage.setItem('bloom-theme', activeTheme);
    }
    const body = document.body;
    body.className = body.className.replace(/theme-\w+/g, '').trim();
    if (activeTheme && activeTheme !== 'theme-lavender') {
      body.classList.add(activeTheme);
    }
  }, [activeTheme, authUser]);

  useEffect(() => {
    if (!authUser) {
      localStorage.setItem('bloom-dark', isDarkMode.toString());
    }
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode, authUser]);

  // Dynamic Theme/Streak Setters
  const updateTheme = async (theme) => {
    setActiveTheme(theme);
    if (authUser && supabase) {
      await supabase.from('profiles').update({ active_theme: theme }).eq('id', authUser.id);
    }
  };

  const updateDarkMode = async (dark) => {
    setIsDarkMode(dark);
    if (authUser && supabase) {
      await supabase.from('profiles').update({ is_dark_mode: dark }).eq('id', authUser.id);
    }
  };

  const updateThoughts = async (text) => {
    setDumpThoughts(text);
    if (authUser && supabase) {
      await supabase.from('profiles').update({ dump_thoughts: text }).eq('id', authUser.id);
    }
  };

  // Operations for Todos
  const addTodo = async (text, priority) => {
    const id = `todo-${Date.now()}`;
    const newTodo = { id, text, priority, completed: false, completedAt: null };
    setTodos([newTodo, ...todos]);

    if (authUser && supabase) {
      await supabase.from('todos').insert({
        id,
        user_id: authUser.id,
        text,
        priority,
        completed: false
      });
    }
  };

  const toggleTodo = async (id) => {
    let completed = false;
    let completedAt = null;
    setTodos(todos.map(todo => {
      if (todo.id === id) {
        completed = !todo.completed;
        completedAt = completed ? new Date().toISOString() : null;
        return { ...todo, completed, completedAt };
      }
      return todo;
    }));

    if (authUser && supabase) {
      await supabase.from('todos').update({
        completed,
        completed_at: completedAt
      }).eq('id', id);
    }
  };

  const deleteTodo = async (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
    if (authUser && supabase) {
      await supabase.from('todos').delete().eq('id', id);
    }
  };

  const editTodo = async (id, newText, newPriority) => {
    setTodos(todos.map(todo => {
      if (todo.id === id) {
        return { ...todo, text: newText, priority: newPriority };
      }
      return todo;
    }));

    if (authUser && supabase) {
      await supabase.from('todos').update({
        text: newText,
        priority: newPriority
      }).eq('id', id);
    }
  };

  // Operations for Notes
  const addNote = async (title, content, color) => {
    const id = `note-${Date.now()}`;
    const newNote = {
      id,
      title: title || 'Untitled Note',
      content,
      color: color || '#fef3c7',
      pinned: false,
      updatedAt: new Date().toISOString()
    };
    setNotes([newNote, ...notes]);

    if (authUser && supabase) {
      await supabase.from('notes').insert({
        id,
        user_id: authUser.id,
        title: title || 'Untitled Note',
        content,
        color: color || '#fef3c7',
        pinned: false
      });
    }
  };

  const updateNote = async (id, updates) => {
    setNotes(notes.map(note => {
      if (note.id === id) {
        return { ...note, ...updates, updatedAt: new Date().toISOString() };
      }
      return note;
    }));

    if (authUser && supabase) {
      await supabase.from('notes').update({
        ...updates,
        updated_at: new Date().toISOString()
      }).eq('id', id);
    }
  };

  const deleteNote = async (id) => {
    setNotes(notes.filter(note => note.id !== id));
    if (authUser && supabase) {
      await supabase.from('notes').delete().eq('id', id);
    }
  };

  const togglePinNote = async (id) => {
    let pinned = false;
    setNotes(notes.map(note => {
      if (note.id === id) {
        pinned = !note.pinned;
        return { ...note, pinned };
      }
      return note;
    }));

    if (authUser && supabase) {
      await supabase.from('notes').update({ pinned }).eq('id', id);
    }
  };

  // Operations for Journal
  const addJournalEntry = async (date, title, content, mood, goodThing) => {
    const existingIndex = journals.findIndex(j => j.date === date);
    let id = `j-${Date.now()}`;

    if (existingIndex > -1) {
      const updated = [...journals];
      id = updated[existingIndex].id;
      updated[existingIndex] = { ...updated[existingIndex], title, content, mood, goodThing };
      setJournals(updated);

      if (authUser && supabase) {
        await supabase.from('journals').update({
          title,
          content,
          mood,
          good_thing: goodThing
        }).eq('id', id);
      }
    } else {
      const newEntry = { id, date, title, content, mood, goodThing };
      setJournals([newEntry, ...journals]);
      
      const newStreak = streak + 1;
      setStreak(newStreak);

      if (authUser && supabase) {
        await supabase.from('profiles').update({ streak: newStreak }).eq('id', authUser.id);
        await supabase.from('journals').insert({
          id,
          user_id: authUser.id,
          date,
          title,
          content,
          mood,
          good_thing: goodThing
        });
      }
    }
  };

  const deleteJournalEntry = async (id) => {
    setJournals(journals.filter(j => j.id !== id));
    if (authUser && supabase) {
      await supabase.from('journals').delete().eq('id', id);
    }
  };

  // Operations for Bucket List
  const addBucketItem = async (text, emoji) => {
    const id = `b-${Date.now()}`;
    const newItem = { id, text, emoji: emoji || '🌟', progress: 0, completed: false };
    setBucketList([newItem, ...bucketList]);

    if (authUser && supabase) {
      await supabase.from('bucket_list').insert({
        id,
        user_id: authUser.id,
        text,
        emoji: emoji || '🌟',
        progress: 0,
        completed: false
      });
    }
  };

  const updateBucketProgress = async (id, progress) => {
    let completed = false;
    const cleanProgress = Math.min(100, Math.max(0, progress));
    setBucketList(bucketList.map(item => {
      if (item.id === id) {
        completed = cleanProgress >= 100;
        return { ...item, progress: cleanProgress, completed };
      }
      return item;
    }));

    if (authUser && supabase) {
      await supabase.from('bucket_list').update({
        progress: cleanProgress,
        completed
      }).eq('id', id);
    }
  };

  const toggleBucketComplete = async (id) => {
    let completed = false;
    let progress = 0;
    setBucketList(bucketList.map(item => {
      if (item.id === id) {
        completed = !item.completed;
        progress = completed ? 100 : 0;
        return { ...item, completed, progress };
      }
      return item;
    }));

    if (authUser && supabase) {
      await supabase.from('bucket_list').update({
        completed,
        progress
      }).eq('id', id);
    }
  };

  const deleteBucketItem = async (id) => {
    setBucketList(bucketList.filter(item => item.id !== id));
    if (authUser && supabase) {
      await supabase.from('bucket_list').delete().eq('id', id);
    }
  };

  // Operations for Time Capsule
  const addTimeCapsule = async (title, message, photos, unlockDate) => {
    const id = `cap-${Date.now()}`;
    const newCapsule = { id, title, message, photos: photos || [], unlockDate, unlocked: false };
    setTimeCapsules([newCapsule, ...timeCapsules]);

    if (authUser && supabase) {
      await supabase.from('time_capsules').insert({
        id,
        user_id: authUser.id,
        title,
        message,
        photos: photos || [],
        unlock_date: unlockDate,
        unlocked: false
      });
    }
  };

  const unlockCapsule = async (id) => {
    setTimeCapsules(timeCapsules.map(cap => {
      if (cap.id === id) {
        return { ...cap, unlocked: true };
      }
      return cap;
    }));

    if (authUser && supabase) {
      await supabase.from('time_capsules').update({ unlocked: true }).eq('id', id);
    }
  };

  const deleteCapsule = async (id) => {
    setTimeCapsules(timeCapsules.filter(cap => cap.id !== id));
    if (authUser && supabase) {
      await supabase.from('time_capsules').delete().eq('id', id);
    }
  };

  // Operations for Memories
  const addMemory = async (title, caption, photo, date, emotion, location) => {
    const id = `mem-${Date.now()}`;
    const newMemory = {
      id,
      title,
      caption,
      photo: photo || 'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&q=80&w=800',
      date: date || new Date().toISOString().split('T')[0],
      emotion: emotion || 'Happy',
      location: location || ''
    };
    setMemories([newMemory, ...memories]);

    if (authUser && supabase) {
      await supabase.from('memories').insert({
        id,
        user_id: authUser.id,
        title,
        caption,
        photo: photo || 'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&q=80&w=800',
        date: date || new Date().toISOString().split('T')[0],
        emotion: emotion || 'Happy',
        location: location || ''
      });
    }
  };

  const deleteMemory = async (id) => {
    setMemories(memories.filter(m => m.id !== id));
    if (authUser && supabase) {
      await supabase.from('memories').delete().eq('id', id);
    }
  };

  // Operations for Letters to Future Me
  const addLetter = async (title, content, openDate) => {
    const id = `let-${Date.now()}`;
    const newLetter = { id, title, content, openDate, unlocked: false };
    setLetters([newLetter, ...letters]);

    if (authUser && supabase) {
      await supabase.from('letters').insert({
        id,
        user_id: authUser.id,
        title,
        content,
        open_date: openDate,
        unlocked: false
      });
    }
  };

  const unlockLetter = async (id) => {
    setLetters(letters.map(lettr => {
      if (lettr.id === id) {
        return { ...lettr, unlocked: true };
      }
      return lettr;
    }));

    if (authUser && supabase) {
      await supabase.from('letters').update({ unlocked: true }).eq('id', id);
    }
  };

  const deleteLetter = async (id) => {
    setLetters(letters.filter(l => l.id !== id));
    if (authUser && supabase) {
      await supabase.from('letters').delete().eq('id', id);
    }
  };

  // Operations for Gratitude Jar
  const addGratitudeNote = async (content) => {
    const id = `grat-${Date.now()}`;
    const newNote = { id, content, createdAt: new Date().toISOString() };
    setGratitudeNotes(prev => [newNote, ...prev]);

    if (authUser && supabase) {
      await supabase.from('gratitude_notes').insert({
        id,
        user_id: authUser.id,
        content,
        created_at: newNote.createdAt
      });
    }
  };

  const deleteGratitudeNote = async (id) => {
    setGratitudeNotes(prev => prev.filter(n => n.id !== id));
    if (authUser && supabase) {
      await supabase.from('gratitude_notes').delete().eq('id', id);
    }
  };

  return (
    <BloomContext.Provider value={{
      todos,
      addTodo,
      toggleTodo,
      deleteTodo,
      editTodo,

      notes,
      addNote,
      updateNote,
      deleteNote,
      togglePinNote,

      journals,
      addJournalEntry,
      deleteJournalEntry,

      bucketList,
      addBucketItem,
      updateBucketProgress,
      toggleBucketComplete,
      deleteBucketItem,

      timeCapsules,
      addTimeCapsule,
      unlockCapsule,
      deleteCapsule,

      dumpThoughts,
      setDumpThoughts: updateThoughts,

      memories,
      addMemory,
      deleteMemory,

      letters,
      addLetter,
      unlockLetter,
      deleteLetter,

      gratitudeNotes,
      addGratitudeNote,
      deleteGratitudeNote,

      streak,
      setStreak,

      activeTheme,
      setActiveTheme: updateTheme,
      isDarkMode,
      setIsDarkMode: updateDarkMode,

      searchQuery,
      setSearchQuery,
      
      // Auth Exports
      authUser,
      isSupabaseConfigured: isSupabaseConfigured()
    }}>
      {children}
    </BloomContext.Provider>
  );
};

export const useBloom = () => {
  const context = useContext(BloomContext);
  if (!context) {
    throw new Error('useBloom must be used within a BloomProvider');
  }
  return context;
};
