import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from '@/utils/supabase';
import { saveState, loadState } from '@/utils/storage';
import { Auth } from '@/components/Auth';
import { Layout } from '@/components/Layout';
import { Dashboard } from '@/pages/Dashboard';
import { Profile } from '@/pages/Profile';
import { Stats } from '@/pages/Stats';
import { resources } from '@/utils/constants';
import { ThemeProvider } from '@/utils/ThemeContext';
import type { MoodEntry } from '@/types';

function App() {
  const [session, setSession] = useState<any>(null);
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  useEffect(() => {
    // Load saved state
    const savedMoodHistory = loadState('moodHistory');
    if (savedMoodHistory) {
      setMoodHistory(savedMoodHistory);
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) {
      fetchMoodHistory();
    }
  }, [session]);

  const fetchMoodHistory = async () => {
    const { data, error } = await supabase
      .from('moods')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching mood history:', error);
    } else {
      setMoodHistory(data || []);
      setUnsavedChanges(true);
    }
  };

  const handleMoodSelection = async (mood: any, description: string) => {
    if (!session) return;

    try {
      const { error } = await supabase
        .from('moods')
        .insert([
          {
            user_id: session.user.id,
            mood: mood.label,
            description: description.trim() || null,
          },
        ]);

      if (error) throw error;
      await fetchMoodHistory();
      setUnsavedChanges(true);
    } catch (error) {
      console.error('Error saving mood:', error);
    }
  };

  const handleSaveState = () => {
    saveState('moodHistory', moodHistory);
    setUnsavedChanges(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  if (!session) {
    return (
      <ThemeProvider>
        <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center p-4">
          <Auth />
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <Router>
        <Layout onSignOut={handleSignOut}>
          <Routes>
            <Route
              path="/"
              element={
                <Dashboard
                  moodHistory={moodHistory}
                  onMoodSelect={handleMoodSelection}
                  onSaveState={handleSaveState}
                  hasUnsavedChanges={unsavedChanges}
                />
              }
            />
            <Route path="/profile" element={<Profile />} />
            <Route path="/stats" element={<Stats moodHistory={moodHistory} />} />
            <Route
              path="/resources"
              element={
                <div className="max-w-5xl mx-auto">
                  <div className="mb-8">
                    <h1 className="text-2xl font-light text-gray-800 dark:text-gray-200 mb-2">Resources</h1>
                    <p className="text-gray-600 dark:text-gray-400">Tools and resources to support your well-being.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {resources.map((category) => {
                      const Icon = category.icon;
                      return (
                        <div key={category.category} className={`${category.bgColor} dark:bg-gray-800 rounded-lg p-6`}>
                          <div className="flex items-center gap-3 mb-4">
                            <Icon className={`w-5 h-5 ${category.color} dark:text-gray-300`} />
                            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">{category.category}</h3>
                          </div>
                          <div className="space-y-4">
                            {category.items.map((item) => (
                              <a
                                key={item.name}
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block p-4 bg-white dark:bg-gray-700 rounded-lg hover:shadow-md transition-shadow"
                              >
                                <div className="flex items-center justify-between">
                                  <div>
                                    <h4 className="text-gray-800 dark:text-gray-200 font-medium mb-1">{item.name}</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
                                  </div>
                                  {item.free && (
                                    <span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded">
                                      Free
                                    </span>
                                  )}
                                </div>
                              </a>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;