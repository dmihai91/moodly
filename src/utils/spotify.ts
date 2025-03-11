const SPOTIFY_MOOD_PLAYLISTS = {
  Happy: [
    { id: '37i9dQZF1DX3rxVfibe1L0', name: 'Mood Booster' },
    { id: '37i9dQZF1DX9XIFQuFvzM4', name: 'Feelin\' Good' },
    { id: '37i9dQZF1DX2sUQwD7tbmL', name: 'Feel-Good Indie Rock' }
  ],
  Sad: [
    { id: '37i9dQZF1DX7qK8ma5wgG1', name: 'Sad Songs' },
    { id: '37i9dQZF1DX64Y3du11rR1', name: 'Life Sucks' },
    { id: '37i9dQZF1DX3YSRoSdA634', name: 'Sad Beats' }
  ],
  Angry: [
    { id: '37i9dQZF1DX1tyCD9QhIWF', name: 'Adrenaline Workout' },
    { id: '37i9dQZF1DX4eRPd9frC1m', name: 'Rage Beats' },
    { id: '37i9dQZF1DWWJOmJ7nRx0C', name: 'Rock Hard' }
  ],
  Relaxed: [
    { id: '37i9dQZF1DX3Ogo9pFvBkY', name: 'Ambient Chill' },
    { id: '37i9dQZF1DWZd79rJ6a7lp', name: 'Sleep' },
    { id: '37i9dQZF1DX9uKNf5jGX6m', name: 'Relaxing Acoustic' }
  ],
  Stressed: [
    { id: '37i9dQZF1DX4PP3DA4J0N8', name: 'Stress Relief' },
    { id: '37i9dQZF1DX2TRYkJECvfC', name: 'Peaceful Piano' },
    { id: '37i9dQZF1DX4sWSpwq3LiO', name: 'Peaceful Meditation' }
  ],
  Anxious: [
    { id: '37i9dQZF1DX4sWSpwq3LiO', name: 'Peaceful Meditation' },
    { id: '37i9dQZF1DX1s9knjP51Oa', name: 'Calm Vibes' },
    { id: '37i9dQZF1DX9uKNf5jGX6m', name: 'Relaxing Acoustic' }
  ]
};

export function getPlaylistsForMood(mood: string) {
  return SPOTIFY_MOOD_PLAYLISTS[mood as keyof typeof SPOTIFY_MOOD_PLAYLISTS] || [];
}