import React, { useState } from 'react';
import { moods } from '@/utils/constants';
import { Save, Music, ExternalLink } from 'lucide-react';
import { getMoodTipsAndSongs } from '@/utils/openai';
import { getPlaylistsForMood } from '@/utils/spotify';

type MoodSelectorProps = {
  onMoodSelect: (mood: any, description: string) => Promise<void>;
  onSaveState: () => void;
  hasUnsavedChanges: boolean;
};

type MoodTips = {
  tips: string[];
  song: {
    title: string;
    artist: string;
    reason: string;
  };
};

export function MoodSelector({ onMoodSelect, onSaveState, hasUnsavedChanges }: MoodSelectorProps) {
  const [selectedMood, setSelectedMood] = useState<typeof moods[number] | null>(null);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [moodTips, setMoodTips] = useState<MoodTips | null>(null);
  const [loadingTips, setLoadingTips] = useState(false);
  const [showTips, setShowTips] = useState(false);

  const fetchTips = async (mood: typeof moods[number]) => {
    setLoadingTips(true);
    try {
      const tips = await getMoodTipsAndSongs(mood.label);
      setMoodTips(tips);
    } catch (error) {
      console.error('Error fetching mood tips:', error);
    } finally {
      setLoadingTips(false);
    }
  };

  const handleMoodSelection = (mood: typeof moods[number]) => {
    setSelectedMood(mood);
    setShowTips(false);
    setMoodTips(null);
  };

  const handleSave = async () => {
    if (!selectedMood) return;
    
    setLoading(true);
    try {
      await onMoodSelect(selectedMood, description);
      onSaveState();
      await fetchTips(selectedMood);
      setShowTips(true);
      setDescription('');
    } catch (error) {
      console.error('Error saving mood:', error);
    } finally {
      setLoading(false);
    }
  };

  const moodPlaylists = selectedMood ? getPlaylistsForMood(selectedMood.label) : [];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900/30 p-6 mb-8">
      <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-6">How are you feeling?</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        {moods.map((mood) => {
          const Icon = mood.icon;
          return (
            <button
              key={mood.label}
              onClick={() => handleMoodSelection(mood)}
              disabled={loading}
              className={`
                relative p-6 rounded-xl transition-all duration-200 group
                ${selectedMood?.label === mood.label
                  ? 'ring-2 ring-purple-500 dark:ring-purple-400'
                  : 'hover:shadow-md dark:hover:shadow-gray-900/30'
                }
                ${loading ? 'opacity-50 cursor-not-allowed' : ''}
                ${mood.gradient}
              `}
            >
              <div className="flex flex-col items-center">
                <Icon className="w-6 h-6 mb-3 text-gray-800 dark:text-gray-200" />
                <div className="text-sm font-medium text-gray-800 dark:text-gray-200">{mood.label}</div>
              </div>
              <div className="absolute inset-0 bg-white dark:bg-gray-800 opacity-90 group-hover:opacity-80 transition-opacity rounded-xl -z-10" />
            </button>
          );
        })}
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
            Add a note (optional)
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="How are you feeling? What's on your mind?"
            className="w-full rounded-lg border border-gray-200 dark:border-gray-700 px-4 py-3 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:border-purple-300 dark:focus:border-purple-500 focus:ring-1 focus:ring-purple-300 dark:focus:ring-purple-500 font-light placeholder-gray-400 dark:placeholder-gray-500"
            rows={3}
          />
        </div>

        <div>
          <button
            onClick={handleSave}
            disabled={!selectedMood || !hasUnsavedChanges || loading}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg shadow-sm transition-colors
              ${(!selectedMood || !hasUnsavedChanges || loading)
                ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                : 'bg-purple-600 hover:bg-purple-700 text-white'
              }
            `}
          >
            <Save className="w-4 h-4" />
            <span>{loading ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      {selectedMood && showTips && (
        <div className={`mt-6 p-4 rounded-lg ${selectedMood.gradient} animate-fade-in`}>
          <div className="relative space-y-4">
            {loadingTips ? (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-800 dark:border-gray-200"></div>
              </div>
            ) : (
              <>
                {moodTips && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200">Tips for you:</h4>
                    <ul className="space-y-2">
                      {moodTips.tips.map((tip, index) => (
                        <li
                          key={index}
                          className="text-sm text-gray-700 dark:text-gray-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-3"
                        >
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200 flex items-center gap-2">
                    <Music className="w-4 h-4" />
                    Recommended Playlists:
                  </h4>
                  <div className="grid gap-2">
                    {moodPlaylists.map((playlist) => (
                      <a
                        key={playlist.id}
                        href={`https://open.spotify.com/playlist/${playlist.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-3 hover:bg-white/90 dark:hover:bg-gray-800/90 transition-colors group"
                      >
                        <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                          {playlist.name}
                        </span>
                        <ExternalLink className="w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:text-purple-500 dark:group-hover:text-purple-400" />
                      </a>
                    ))}
                  </div>
                </div>

                {moodTips?.song && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200">AI Song Suggestion:</h4>
                    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-3">
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                        {moodTips.song.title} - {moodTips.song.artist}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {moodTips.song.reason}
                      </p>
                    </div>
                  </div>
                )}
              </>
            )}
            <div className="absolute inset-0 bg-white dark:bg-gray-800 opacity-90 -z-10 rounded-lg" />
          </div>
        </div>
      )}
    </div>
  );
}