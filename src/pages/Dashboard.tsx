import React from 'react';
import { MoodSelector } from '@/components/MoodSelector';
import { DashboardCharts } from '@/components/DashboardCharts';
import { AIInsights } from '@/components/AIInsights';
import { PsychologistSuggestions } from '@/components/PsychologistSuggestions';
import { BarChart, Calendar, Smile as SmileBeam, Heart, TrendingUp, Clock, Dumbbell, BookOpen } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '@/utils/supabase';
import type { MoodEntry } from '@/types';

type DashboardProps = {
  moodHistory: MoodEntry[];
  onMoodSelect: (mood: any, description: string) => Promise<void>;
  onSaveState: () => void;
  hasUnsavedChanges: boolean;
};

type Program = {
  title: string;
  description: string;
  duration: string;
  intensity: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
};

export function Dashboard({ moodHistory, onMoodSelect, onSaveState, hasUnsavedChanges }: DashboardProps) {
  const [userName, setUserName] = React.useState<string>('');
  const [fullName, setFullName] = React.useState<string>('');

  React.useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) {
        setUserName(user.email.split('@')[0]);
        
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .single();

        if (profile?.full_name) {
          setFullName(profile.full_name);
        }
      }
    };
    getUser();
  }, []);

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: 'Good morning', emoji: '🌅' };
    if (hour < 18) return { text: 'Good afternoon', emoji: '☀️' };
    return { text: 'Good evening', emoji: '🌙' };
  };

  const greeting = getGreeting();

  // Calculate statistics
  const moodCounts = moodHistory.reduce((acc, entry) => {
    acc[entry.mood] = (acc[entry.mood] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalEntries = moodHistory.length;
  const mostFrequentMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]?.[0];

  // Calculate time-based patterns
  const timePatterns = moodHistory.reduce((acc, entry) => {
    const hour = new Date(entry.created_at).getHours();
    const timeOfDay = hour < 12 ? 'Morning' : hour < 18 ? 'Afternoon' : 'Evening';
    acc[timeOfDay] = (acc[timeOfDay] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const peakTime = Object.entries(timePatterns).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

  // Calculate streak
  const calculateStreak = () => {
    if (moodHistory.length === 0) return 0;
    
    let streak = 1;
    const sortedEntries = [...moodHistory].sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    for (let i = 1; i < sortedEntries.length; i++) {
      const currentDate = new Date(sortedEntries[i-1].created_at).setHours(0, 0, 0, 0);
      const prevDate = new Date(sortedEntries[i].created_at).setHours(0, 0, 0, 0);
      
      if ((currentDate - prevDate) === 86400000) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  };

  // Personalized programs based on mood patterns
  const getRecommendedPrograms = (): Program[] => {
    const recentMoods = moodHistory.slice(0, 5).map(entry => entry.mood);
    const hasNegativeMoods = recentMoods.some(mood => 
      ['Sad', 'Angry', 'Anxious', 'Stressed'].includes(mood)
    );
    
    const programs: Program[] = [];

    if (hasNegativeMoods) {
      programs.push({
        title: "Stress Relief Journey",
        description: "A guided program combining meditation, breathing exercises, and gentle movement",
        duration: "10-15 mins daily",
        intensity: "Beginner",
        category: "Meditation",
        icon: SmileBeam,
        color: "text-purple-600",
        bgColor: "bg-purple-50 dark:bg-purple-900/20"
      });

      programs.push({
        title: "Mood-Lifting Movement",
        description: "Simple exercises designed to boost endorphins and improve mood",
        duration: "20 mins",
        intensity: "Beginner",
        category: "Exercise",
        icon: Dumbbell,
        color: "text-green-600",
        bgColor: "bg-green-50 dark:bg-green-900/20"
      });
    }

    programs.push({
      title: "Mindful Journaling",
      description: "Daily prompts to help you process emotions and track your progress",
      duration: "5-10 mins",
      intensity: "Beginner",
      category: "Self-reflection",
      icon: BookOpen,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20"
    });

    return programs;
  };

  const recommendedPrograms = getRecommendedPrograms();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-light text-gray-800 dark:text-gray-200 mb-2">
          {greeting.text}, {fullName || userName} {greeting.emoji}
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
          Track your mood and emotional well-being journey.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <MoodSelector 
            onMoodSelect={onMoodSelect} 
            onSaveState={onSaveState}
            hasUnsavedChanges={hasUnsavedChanges}
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative bg-white dark:bg-gray-800 rounded-lg p-6">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-purple-600/10 rounded-lg"></div>
              <div className="relative">
                <div className="w-12 h-12 mb-4 rounded-lg bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <BarChart className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Total Entries</h3>
                <p className="text-3xl font-bold bg-gradient-to-r from-primary-500 to-purple-600 bg-clip-text text-transparent">
                  {totalEntries}
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
              <div className="w-12 h-12 mb-4 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Most Frequent</h3>
              <p className="text-2xl font-light text-gray-900 dark:text-gray-100">{mostFrequentMood || 'N/A'}</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
              <div className="w-12 h-12 mb-4 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Current Streak</h3>
              <p className="text-2xl font-light text-gray-900 dark:text-gray-100">{calculateStreak()} days</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
              <div className="w-12 h-12 mb-4 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Peak Time</h3>
              <p className="text-2xl font-light text-gray-900 dark:text-gray-100">{peakTime}</p>
            </div>
          </div>

          <DashboardCharts moodHistory={moodHistory} />
          <AIInsights moodHistory={moodHistory} />
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">Recommended Programs</h2>
            <div className="space-y-4">
              {recommendedPrograms.map((program, index) => {
                const Icon = program.icon;
                return (
                  <div
                    key={index}
                    className={`${program.bgColor} rounded-lg p-4 transition-transform hover:scale-[1.02]`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <Icon className={`w-5 h-5 ${program.color}`} />
                      <h3 className="font-medium text-gray-800 dark:text-gray-200">{program.title}</h3>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{program.description}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">{program.duration}</span>
                      <button className="text-primary-600 dark:text-primary-400 font-medium hover:text-primary-700 dark:hover:text-primary-300">
                        Start Program
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <PsychologistSuggestions moodHistory={moodHistory} />
        </div>
      </div>
    </div>
  );
}