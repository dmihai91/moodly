export type MoodEntry = {
  id: string;
  mood: string;
  description?: string;
  created_at: string;
};

export type Notification = {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'reminder' | 'insight' | 'streak' | 'system';
  read: boolean;
  created_at: string;
};

export type Reminder = {
  id: string;
  user_id: string;
  title: string;
  message: string;
  time: string;
  days: string[];
  active: boolean;
  created_at: string;
};