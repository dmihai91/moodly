import React from 'react';
import { UserRound, Brain, MessageCircle, Calendar } from 'lucide-react';
import type { MoodEntry } from '../types';

type PsychologistSuggestionsProps = {
  moodHistory: MoodEntry[];
};

export function PsychologistSuggestions({ moodHistory }: PsychologistSuggestionsProps) {
  // Analyze recent moods to determine the type of specialist needed
  const recentMoods = moodHistory.slice(0, 10);
  const moodCounts = recentMoods.reduce((acc, entry) => {
    acc[entry.mood] = (acc[entry.mood] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Determine predominant mood type
  const predominantMood = Object.entries(moodCounts)
    .sort((a, b) => b[1] - a[1])[0]?.[0];

  // Match specialists based on mood patterns
  const specialists: Record<string, Psychologist[]> = {
    Anxious: [
      {
        name: "Dr. Sarah Chen",
        specialization: "Anxiety & Stress Management",
        experience: "15 years",
        approach: "CBT, Mindfulness-Based Therapy",
        availability: "Online & In-person",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200"
      },
      {
        name: "Dr. Michael Torres",
        specialization: "Anxiety Disorders",
        experience: "12 years",
        approach: "ACT, Exposure Therapy",
        availability: "Online Sessions",
        image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=200&h=200"
      }
    ],
    Sad: [
      {
        name: "Dr. Emily Watson",
        specialization: "Depression & Mood Disorders",
        experience: "18 years",
        approach: "Psychodynamic Therapy, CBT",
        availability: "Flexible Schedule",
        image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=200&h=200"
      },
      {
        name: "Dr. James Miller",
        specialization: "Clinical Depression",
        experience: "20 years",
        approach: "Integrative Therapy",
        availability: "Evening Sessions",
        image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=200&h=200"
      }
    ],
    Angry: [
      {
        name: "Dr. Lisa Rodriguez",
        specialization: "Anger Management",
        experience: "14 years",
        approach: "DBT, Behavioral Therapy",
        availability: "Morning & Evening",
        image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200&h=200"
      },
      {
        name: "Dr. Robert Kim",
        specialization: "Emotional Regulation",
        experience: "16 years",
        approach: "CBT, Mindfulness",
        availability: "Weekday Sessions",
        image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200&h=200"
      }
    ]
  };

  // Default specialists for other moods
  const defaultSpecialists = [
    {
      name: "Dr. Amanda Foster",
      specialization: "General Mental Health",
      experience: "17 years",
      approach: "Holistic Therapy",
      availability: "Flexible Hours",
      image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=200&h=200"
    },
    {
      name: "Dr. David Park",
      specialization: "Emotional Well-being",
      experience: "13 years",
      approach: "Person-Centered Therapy",
      availability: "Online Sessions",
      image: "https://images.unsplash.com/photo-1622902046580-2b47f47f5471?auto=format&fit=crop&q=80&w=200&h=200"
    }
  ];

  const recommendedSpecialists = specialists[predominantMood] || defaultSpecialists;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900/30 p-6">
      <div className="flex items-center gap-3 mb-6">
        <UserRound className="w-6 h-6 text-purple-500 dark:text-purple-400" />
        <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200">Recommended Specialists</h2>
      </div>

      <div className="space-y-4">
        {recommendedSpecialists.map((specialist) => (
          <div
            key={specialist.name}
            className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 transition-transform hover:scale-[1.02]"
          >
            <div className="flex items-start gap-4">
              <img
                src={specialist.image}
                alt={specialist.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="flex-1">
                <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-1">
                  {specialist.name}
                </h3>
                <p className="text-purple-600 dark:text-purple-400 text-sm mb-2">
                  {specialist.specialization}
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Brain className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-300">{specialist.approach}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-300">{specialist.experience} experience</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-300">{specialist.availability}</span>
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <button className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300">
                    Schedule Consultation
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 text-sm text-gray-600 dark:text-gray-400">
        <p>
          These recommendations are based on your mood patterns. All specialists are licensed
          professionals with extensive experience in their fields. Consultations are confidential
          and can be conducted online or in person.
        </p>
      </div>
    </div>
  );
}