import React from 'react';
import { BarChart, Calendar, Clock, TrendingUp } from 'lucide-react';
import type { MoodEntry } from '../types';

type StatsProps = {
  moodHistory: MoodEntry[];
};

export function Stats({ moodHistory }: StatsProps) {
  // Calculate mood statistics
  const moodCounts = moodHistory.reduce((acc, entry) => {
    acc[entry.mood] = (acc[entry.mood] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalEntries = moodHistory.length;
  const mostFrequentMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

  // Calculate time-based patterns
  const timePatterns = moodHistory.reduce((acc, entry) => {
    const hour = new Date(entry.created_at).getHours();
    const timeOfDay = hour < 12 ? 'Morning' : hour < 18 ? 'Afternoon' : 'Evening';
    acc[timeOfDay] = (acc[timeOfDay] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Calculate streak
  const calculateStreak = () => {
    if (moodHistory.length === 0) return 0;
    
    let streak = 1;
    const today = new Date().setHours(0, 0, 0, 0);
    const sortedEntries = [...moodHistory].sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    for (let i = 1; i < sortedEntries.length; i++) {
      const currentDate = new Date(sortedEntries[i-1].created_at).setHours(0, 0, 0, 0);
      const prevDate = new Date(sortedEntries[i].created_at).setHours(0, 0, 0, 0);
      
      if ((currentDate - prevDate) === 86400000) { // One day difference
        streak++;
      } else {
        break;
      }
    }

    return streak;
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-light text-gray-800 mb-2">Your Mood Statistics</h1>
        <p className="text-gray-600">Insights into your emotional well-being journey.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <BarChart className="w-5 h-5 text-purple-500" />
            <h3 className="text-gray-700 font-medium">Total Entries</h3>
          </div>
          <p className="text-3xl font-light text-gray-900">{totalEntries}</p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-5 h-5 text-green-500" />
            <h3 className="text-gray-700 font-medium">Most Frequent</h3>
          </div>
          <p className="text-3xl font-light text-gray-900">{mostFrequentMood}</p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="w-5 h-5 text-blue-500" />
            <h3 className="text-gray-700 font-medium">Current Streak</h3>
          </div>
          <p className="text-3xl font-light text-gray-900">{calculateStreak()} days</p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="w-5 h-5 text-orange-500" />
            <h3 className="text-gray-700 font-medium">Peak Time</h3>
          </div>
          <p className="text-3xl font-light text-gray-900">
            {Object.entries(timePatterns).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-medium text-gray-800 mb-6">Mood Distribution</h3>
          <div className="space-y-4">
            {Object.entries(moodCounts).map(([mood, count]) => (
              <div key={mood}>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>{mood}</span>
                  <span>{((count / totalEntries) * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-purple-500 h-2 rounded-full"
                    style={{ width: `${(count / totalEntries) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-medium text-gray-800 mb-6">Time of Day Patterns</h3>
          <div className="space-y-4">
            {Object.entries(timePatterns).map(([time, count]) => (
              <div key={time}>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>{time}</span>
                  <span>{((count / totalEntries) * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${(count / totalEntries) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}