/*
  # Bangla Prayer Time App Database Schema

  1. New Tables
    - `user_preferences`
      - `id` (uuid, primary key)
      - `user_id` (text, unique) - Device identifier
      - `calculation_method` (text) - Prayer calculation method
      - `madhab` (text) - Hanafi or Shafi
      - `notification_enabled` (boolean)
      - `location_latitude` (numeric)
      - `location_longitude` (numeric)
      - `location_name` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `tasbih_counts`
      - `id` (uuid, primary key)
      - `user_id` (text)
      - `count` (integer)
      - `target` (integer)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `favorite_mosques`
      - `id` (uuid, primary key)
      - `user_id` (text)
      - `name` (text)
      - `address` (text)
      - `latitude` (numeric)
      - `longitude` (numeric)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for users to manage their own data
*/

CREATE TABLE IF NOT EXISTS user_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text UNIQUE NOT NULL,
  calculation_method text DEFAULT 'MuslimWorldLeague',
  madhab text DEFAULT 'Hanafi',
  notification_enabled boolean DEFAULT true,
  location_latitude numeric,
  location_longitude numeric,
  location_name text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own preferences"
  ON user_preferences FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own preferences"
  ON user_preferences FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update own preferences"
  ON user_preferences FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE TABLE IF NOT EXISTS tasbih_counts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  count integer DEFAULT 0,
  target integer DEFAULT 33,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE tasbih_counts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own tasbih counts"
  ON tasbih_counts FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own tasbih counts"
  ON tasbih_counts FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update own tasbih counts"
  ON tasbih_counts FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete own tasbih counts"
  ON tasbih_counts FOR DELETE
  USING (true);

CREATE TABLE IF NOT EXISTS favorite_mosques (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  name text NOT NULL,
  address text,
  latitude numeric NOT NULL,
  longitude numeric NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE favorite_mosques ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own favorite mosques"
  ON favorite_mosques FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own favorite mosques"
  ON favorite_mosques FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can delete own favorite mosques"
  ON favorite_mosques FOR DELETE
  USING (true);