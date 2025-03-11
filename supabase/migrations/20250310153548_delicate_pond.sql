/*
  # Add Reminders and Notifications System

  1. New Tables
    - `reminders`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `title` (text)
      - `message` (text)
      - `time` (time) - Daily reminder time
      - `days` (text[]) - Days of the week
      - `active` (boolean)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `reminders` table
    - Add policies for authenticated users to manage their reminders
*/

-- Create reminders table
CREATE TABLE IF NOT EXISTS reminders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  time time NOT NULL,
  days text[] NOT NULL,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;

-- Policies for reminders
CREATE POLICY "Users can create their own reminders"
  ON reminders
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own reminders"
  ON reminders
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own reminders"
  ON reminders
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reminders"
  ON reminders
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);