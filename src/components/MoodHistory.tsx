import React from 'react';
import { format } from 'date-fns';
import { moods } from '../lib/constants';
import type { MoodEntry } from '../types';

type MoodHistoryProps = {
  moodHistory: MoodEntry[];
};

export function MoodHistory({ moodHistory }: MoodHistoryProps) {
  if (moodHistory.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {moodHistory.slice(0, 5).map((entry) => {
        const mood = moods.find(m => m.label === entry.mood);
        const Icon = mood?.icon;
        return (
          <div
            key={entry.id}
            className={`${mood?.gradient} rounded-lg p-4`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  {Icon && <Icon className="w-5 h-5 text-gray-800 dark:text-gray-200" />}
                </div>
                <span className="text-gray-700 dark:text-gray-200 font-light">{mood?.label}</span>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400 font-light">
                {format(new Date(entry.created_at), 'MMM d, h:mm a')}
              </span>
            </div>
            {entry.description && (
              <p className="text-gray-600 dark:text-gray-300 text-sm font-light mt-2 pl-10">{entry.description}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}