import OpenAI from 'openai';

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

if (!apiKey) {
  console.warn('OpenAI API key is missing. AI insights will be disabled.');
}

const openai = apiKey ? new OpenAI({
  apiKey,
  dangerouslyAllowBrowser: true
}) : null;

export async function getPersonalizedAdvice(moodHistory: any[]) {
  if (!openai || moodHistory.length === 0) return null;

  const recentMoods = moodHistory.slice(0, 5).map(entry => ({
    mood: entry.mood,
    description: entry.description,
    created_at: entry.created_at
  }));

  const prompt = `As an empathetic mental health assistant for Moodly, analyze these recent mood entries and provide personalized insights. Consider patterns, triggers, and potential areas for improvement. Focus on being supportive and actionable.

Recent moods:
${JSON.stringify(recentMoods, null, 2)}

Please provide a response in this JSON format:
{
  "summary": "A brief, empathetic analysis of the overall mood pattern",
  "insights": [
    "3-4 specific observations about patterns, triggers, or notable changes",
    "Focus on both positive aspects and areas for attention"
  ],
  "recommendations": [
    "3-4 actionable, specific suggestions for maintaining or improving emotional well-being",
    "Include both immediate actions and longer-term strategies",
    "Tailor recommendations to the observed mood patterns"
  ]
}`;

  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
      temperature: 0.7,
      max_tokens: 800,
      presence_penalty: 0.3,
      frequency_penalty: 0.5
    });

    const response = completion.choices[0]?.message?.content;
    return response ? JSON.parse(response) : null;
  } catch (error) {
    console.error('Error getting AI insights:', error);
    return null;
  }
}

export async function getMoodTipsAndSongs(mood: string) {
  if (!openai) return null;

  const prompt = `As an expert in emotional well-being and music therapy, provide personalized tips and a Spotify song suggestion for someone feeling ${mood}. 

Please provide a response in this JSON format:
{
  "tips": [
    "2-3 specific, actionable tips for managing or enhancing this mood",
    "Focus on immediate, practical actions"
  ],
  "song": {
    "title": "A well-known song title that matches the mood",
    "artist": "The artist name",
    "reason": "A brief explanation of why this song is appropriate for the mood"
  }
}

Consider:
- For positive moods: Tips to maintain and share the positive energy
- For challenging moods: Gentle, supportive tips for coping and self-care
- Choose songs that are widely recognized and available on Spotify
- Match the song's energy and message to the mood
`;

  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
      temperature: 0.7,
      max_tokens: 500
    });

    const response = completion.choices[0]?.message?.content;
    return response ? JSON.parse(response) : null;
  } catch (error) {
    console.error('Error getting mood tips and songs:', error);
    return null;
  }
}