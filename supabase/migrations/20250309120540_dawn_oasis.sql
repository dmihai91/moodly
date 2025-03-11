/*
  # Create moods table and authentication setup

  1. New Tables
    - `moods`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `mood` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `moods` table
    - Add policies for authenticated users to:
      - Insert their own moods
      - Read their own moods
*/

CREATE TABLE moods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  mood text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE moods ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own moods"
  ON moods
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read their own moods"
  ON moods
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);