/*
  # Add mood description field

  1. Changes
    - Add `description` column to `moods` table for storing user's mood descriptions
    - Column is optional (nullable) to maintain compatibility with existing records
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'moods' AND column_name = 'description'
  ) THEN
    ALTER TABLE moods ADD COLUMN description text;
  END IF;
END $$;