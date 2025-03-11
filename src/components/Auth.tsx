import React from 'react';
import { SignIn } from './SignIn';
import { SignUp } from './SignUp';
import { Smile } from 'lucide-react';

export function Auth() {
  const [mode, setMode] = React.useState<'signin' | 'signup'>('signin');

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 via-purple-500 to-pink-500 shadow-lg mb-4 relative overflow-hidden group">
          <div className="absolute inset-0 bg-white/10 group-hover:bg-white/20 transition-colors"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500/50 via-purple-500/50 to-pink-500/50 animate-pulse"></div>
          <div className="relative z-10 transform transition-transform group-hover:scale-110">
            <Smile className="w-10 h-10 text-white" strokeWidth={2.5} />
          </div>
        </div>
        <h1 className="text-4xl font-semibold bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          Moodly
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Track your emotional well-being journey
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-8">
          {mode === 'signin' ? (
            <>
              <SignIn />
              <div className="mt-6 text-center">
                <p className="text-gray-600 dark:text-gray-400">
                  Don't have an account?{' '}
                  <button
                    onClick={() => setMode('signup')}
                    className="text-primary-600 hover:text-primary-500 font-medium"
                  >
                    Create one now
                  </button>
                </p>
              </div>
            </>
          ) : (
            <>
              <button
                onClick={() => setMode('signin')}
                className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors mb-6"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                <span>Back to Sign In</span>
              </button>
              <SignUp />
            </>
          )}
        </div>
      </div>

      <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
        By using Moodly, you agree to our{' '}
        <a href="#" className="text-primary-600 hover:text-primary-500">
          Terms of Service
        </a>{' '}
        and{' '}
        <a href="#" className="text-primary-600 hover:text-primary-500">
          Privacy Policy
        </a>
      </p>
    </div>
  );
}