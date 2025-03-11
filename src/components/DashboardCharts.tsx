import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, Cell } from 'recharts';
import { format, subDays, startOfDay } from 'date-fns';
import type { MoodEntry } from '../types';

type DashboardChartsProps = {
  moodHistory: MoodEntry[];
};

export function DashboardCharts({ moodHistory }: DashboardChartsProps) {
  // Mood colors mapping
  const moodColors = {
    'Happy': '#FCD34D',    // Yellow
    'Sad': '#60A5FA',      // Blue
    'Angry': '#F87171',    // Red
    'Relaxed': '#34D399',  // Green
    'Stressed': '#FB7185', // Rose
    'Anxious': '#FB923C'   // Orange
  };

  // Prepare data for charts
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), i);
    return startOfDay(date).getTime();
  }).reverse();

  const moodScores: Record<string, number> = {
    'Happy': 5,
    'Relaxed': 4,
    'Stressed': 2,
    'Anxious': 1,
    'Sad': 1,
    'Angry': 0
  };

  const dailyMoods = last7Days.map(day => {
    const dayMoods = moodHistory.filter(entry => 
      startOfDay(new Date(entry.created_at)).getTime() === day
    );

    const avgScore = dayMoods.length > 0
      ? dayMoods.reduce((sum, entry) => sum + (moodScores[entry.mood] || 0), 0) / dayMoods.length
      : null;

    return {
      date: format(day, 'MMM d'),
      score: avgScore,
      count: dayMoods.length
    };
  });

  const moodDistribution = Object.entries(
    moodHistory.reduce((acc, entry) => {
      acc[entry.mood] = (acc[entry.mood] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([mood, count]) => ({
    mood,
    count,
    color: moodColors[mood as keyof typeof moodColors]
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">
            {label}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {payload[0].name === 'score' ? 'Mood Score' : 'Count'}: {payload[0].value?.toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm dark:shadow-gray-900/30">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">Mood Trends</h3>
        <Link
          to="/stats"
          className="flex items-center gap-2 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 text-sm font-medium"
        >
          View Detailed Stats
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Weekly Mood Score</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyMoods} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                <XAxis
                  dataKey="date"
                  stroke="#9CA3AF"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#9CA3AF"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  domain={[0, 5]}
                  ticks={[0, 1, 2, 3, 4, 5]}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#8B5CF6"
                  strokeWidth={2}
                  dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Mood Distribution</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={moodDistribution} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                <XAxis
                  dataKey="mood"
                  stroke="#9CA3AF"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#9CA3AF"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="count"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={50}
                >
                  {moodDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}