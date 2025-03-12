import React from 'react';
import { Sparkles, Lightbulb, ListChecks, Key, RefreshCw } from 'lucide-react';
import { getPersonalizedAdvice } from '@/utils/openai';
import type { MoodEntry } from '@/types';

type AIInsightsProps = {
  moodHistory: MoodEntry[];
};

type Advice = {
  summary: string;
  insights: string[];
  recommendations: string[];
};

export function AIInsights({ moodHistory }: AIInsightsProps) {
  const [advice, setAdvice] = React.useState<Advice | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const fetchAdvice = React.useCallback(async () => {
    if (!import.meta.env.VITE_OPENAI_API_KEY) {
      setError('OpenAI API key is missing. Please add your API key to enable AI insights.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const result = await getPersonalizedAdvice(moodHistory);
      setAdvice(result);
    } catch (err) {
      setError('Failed to get AI insights. Please try again later.');
      console.error('Error fetching AI insights:', err);
    } finally {
      setLoading(false);
    }
  }, [moodHistory]);

  React.useEffect(() => {
    if (moodHistory.length > 0) {
      fetchAdvice();
    }
  }, [moodHistory, fetchAdvice]);

  if (moodHistory.length === 0) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900/30 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 h-6 text-purple-500 dark:text-purple-400" />
          <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200">AI Insights</h2>
        </div>
        {!loading && !error && (
          <button
            onClick={fetchAdvice}
            className="flex items-center gap-2 text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        )}
      </div>

      {error ? (
        <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Key className="w-5 h-5 text-amber-500" />
            <p className="text-amber-800 dark:text-amber-200 font-medium">API Key Required</p>
          </div>
          <p className="text-amber-700 dark:text-amber-300">{error}</p>
        </div>
      ) : loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
        </div>
      ) : advice ? (
        <div className="space-y-6">
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
            <p className="text-gray-800 dark:text-gray-200">{advice.summary}</p>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Key Insights</h3>
            </div>
            <ul className="space-y-2">
              {advice.insights.map((insight, index) => (
                <li
                  key={index}
                  className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3"
                >
                  {insight}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <ListChecks className="w-5 h-5 text-green-500" />
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Recommendations</h3>
            </div>
            <ul className="space-y-2">
              {advice.recommendations.map((recommendation, index) => (
                <li
                  key={index}
                  className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3"
                >
                  {recommendation}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </div>
  );
}