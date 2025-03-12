import React, { useState, useEffect } from 'react';
import { User, Mail, Bell, Save } from 'lucide-react';
import { supabase } from '@/utils/supabase';
import { RemindersSection } from '@/components/RemindersSection';

export function Profile() {
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const getProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUserId(user.id);
          setEmail(user.email || '');
          
          // First try to get the existing profile
          const { data: profile, error: fetchError } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', user.id)
            .maybeSingle(); // Use maybeSingle() instead of single()

          if (fetchError) throw fetchError;

          // If no profile exists, create one
          if (!profile) {
            const { error: insertError } = await supabase
              .from('profiles')
              .insert([
                {
                  id: user.id,
                  full_name: '',
                  email: user.email
                }
              ]);

            if (insertError) throw insertError;
          } else {
            setName(profile.full_name || '');
          }
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
    getProfile();
  }, []);

  const handleUpdateProfile = async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          full_name: name.trim(),
          updated_at: new Date().toISOString(),
        });

      if (updateError) throw updateError;

      const { error: authError } = await supabase.auth.updateUser({
        data: { full_name: name.trim() },
      });

      if (authError) throw authError;

      setSuccess('Profile updated successfully!');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone.'
    );

    if (confirmed) {
      setLoading(true);
      try {
        const { error } = await supabase.rpc('delete_user_data');
        if (error) throw error;
        await supabase.auth.signOut();
      } catch (error) {
        console.error('Error deleting account:', error);
        alert('Failed to delete account. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const getDisplayInitial = () => {
    if (name) return name[0].toUpperCase();
    if (email) return email[0].toUpperCase();
    return '?';
  };

  const getDisplayName = () => {
    if (name) return name;
    if (email) return email.split('@')[0];
    return 'Loading...';
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-light text-gray-800 dark:text-gray-200 mb-2">Profile Settings</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage your account preferences and settings.</p>
      </div>

      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm divide-y divide-gray-200 dark:divide-gray-700">
          <div className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-medium">
                {getDisplayInitial()}
              </div>
              <div>
                <h2 className="text-xl font-medium text-gray-900 dark:text-gray-100">
                  {getDisplayName()}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Member since{' '}
                  {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Mail className="w-4 h-4" />
                  <span>{email || 'Loading...'}</span>
                </div>
              </div>

              {error && (
                <div className="text-red-500 text-sm">{error}</div>
              )}

              {success && (
                <div className="text-green-500 text-sm">{success}</div>
              )}

              <button
                onClick={handleUpdateProfile}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{loading ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </div>

          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Preferences</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">Notifications</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Receive daily reminders to track your mood</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications}
                    onChange={(e) => setNotifications(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
            </div>
          </div>

          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Data & Privacy</h3>
            <div className="space-y-4">
              <button
                onClick={handleDeleteAccount}
                disabled={loading}
                className="text-red-600 hover:text-red-700 font-medium disabled:opacity-50"
              >
                {loading ? 'Deleting Account...' : 'Delete Account'}
              </button>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Once you delete your account, it cannot be recovered. All your data will be permanently removed.
              </p>
            </div>
          </div>
        </div>

        <RemindersSection />
      </div>
    </div>
  );
}