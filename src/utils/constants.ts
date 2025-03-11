import { 
  Smile, 
  Frown as Sad, 
  Angry, 
  Heart as Relaxed,
  Smile as MoodlyIcon,
  Meh as Anxious,
  Headphones, 
  Cog as Yoga, 
  Book, 
  Heart,
  Frown as Stressed 
} from 'lucide-react';

export { MoodlyIcon };

export const moods = [
  { 
    icon: Smile,
    label: "Happy", 
    message: "Keep smiling! Spread the joy. 😊",
    isNegative: false,
    gradient: "bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/20 dark:to-orange-900/20"
  },
  { 
    icon: Sad,
    label: "Sad", 
    message: "It's okay to feel down. Take time to rest and recover. 💙",
    isNegative: true,
    gradient: "bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20",
    suggestions: ["Call a friend", "Listen to music", "Take a walk", "Write"]
  },
  { 
    icon: Angry,
    label: "Angry", 
    message: "Take a deep breath. Focus on what you can control. 😤",
    isNegative: true,
    gradient: "bg-gradient-to-br from-red-100 to-pink-100 dark:from-red-900/20 dark:to-pink-900/20",
    suggestions: ["Deep breathing", "Exercise", "Write", "Find quiet"]
  },
  { 
    icon: Relaxed,
    label: "Relaxed", 
    message: "Enjoy the moment. Stay present. 😌",
    isNegative: false,
    gradient: "bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20"
  },
  { 
    icon: Stressed,
    label: "Stressed", 
    message: "Take a moment to breathe deeply. One step at a time. 🫠",
    isNegative: true,
    gradient: "bg-gradient-to-br from-rose-100 to-violet-100 dark:from-rose-900/20 dark:to-violet-900/20",
    suggestions: ["5-minute meditation", "Stretch break", "Write your thoughts", "Nature walk"]
  },
  { 
    icon: Anxious,
    label: "Anxious", 
    message: "Remember that anxiety is temporary. Take small steps. 😰",
    isNegative: true,
    gradient: "bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/20 dark:to-red-900/20",
    suggestions: ["Grounding", "Box breathing", "List worries", "Stretch"]
  }
] as const;

export const resources = [
  {
    category: "Meditation",
    icon: MoodlyIcon,
    color: "text-gray-900 dark:text-gray-100",
    bgColor: "bg-gray-50 dark:bg-gray-800/50",
    items: [
      {
        name: "Headspace",
        description: "Guided meditation and mindfulness",
        url: "https://www.headspace.com",
        free: true
      },
      {
        name: "Calm",
        description: "Sleep stories, meditation, and relaxation",
        url: "https://www.calm.com",
        free: true
      }
    ]
  },
  {
    category: "Music",
    icon: Headphones,
    color: "text-gray-900 dark:text-gray-100",
    bgColor: "bg-gray-50 dark:bg-gray-800/50",
    items: [
      {
        name: "Spotify Mood Playlists",
        description: "Curated playlists for every mood",
        url: "https://open.spotify.com/genre/mood-playlists-page",
        free: true
      },
      {
        name: "Brain.fm",
        description: "Focus, relaxation, and sleep music",
        url: "https://brain.fm",
        free: false
      }
    ]
  },
  {
    category: "Exercise",
    icon: Yoga,
    color: "text-gray-900 dark:text-gray-100",
    bgColor: "bg-gray-50 dark:bg-gray-800/50",
    items: [
      {
        name: "Down Dog",
        description: "Customizable yoga practices",
        url: "https://www.downdogapp.com",
        free: true
      },
      {
        name: "Nike Training Club",
        description: "Free workouts and wellness guidance",
        url: "https://www.nike.com/ntc-app",
        free: true
      }
    ]
  },
  {
    category: "Mental Health",
    icon: Heart,
    color: "text-gray-900 dark:text-gray-100",
    bgColor: "bg-gray-50 dark:bg-gray-800/50",
    items: [
      {
        name: "Woebot",
        description: "AI-powered cognitive behavioral therapy",
        url: "https://woebothealth.com",
        free: true
      },
      {
        name: "Sanvello",
        description: "Stress, anxiety, and depression tools",
        url: "https://www.sanvello.com",
        free: true
      }
    ]
  },
  {
    category: "Reading",
    icon: Book,
    color: "text-gray-900 dark:text-gray-100",
    bgColor: "bg-gray-50 dark:bg-gray-800/50",
    items: [
      {
        name: "Blinkist",
        description: "Key insights from self-help books",
        url: "https://www.blinkist.com",
        free: false
      },
      {
        name: "Pocket",
        description: "Save and read mood-lifting articles",
        url: "https://getpocket.com",
        free: true
      }
    ]
  }
] as const;