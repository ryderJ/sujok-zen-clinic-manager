/*
  # Initial Schema for Su Jok Therapy Management System

  1. New Tables
    - `patients`
      - `id` (uuid, primary key)
      - `name` (text)
      - `date_of_birth` (date)
      - `phone` (text)
      - `email` (text)
      - `conditions` (text)
      - `is_active` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `therapy_sessions`
      - `id` (uuid, primary key)
      - `patient_id` (uuid, foreign key)
      - `date` (date)
      - `time` (time)
      - `type` (text)
      - `duration` (integer)
      - `status` (text)
      - `notes` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `treatments`
      - `id` (uuid, primary key)
      - `patient_id` (uuid, foreign key)
      - `date` (date)
      - `description` (text)
      - `notes` (text)
      - `duration` (integer)
      - `photos` (text array)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their data
*/

-- Create patients table
CREATE TABLE IF NOT EXISTS patients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  date_of_birth date NOT NULL,
  phone text NOT NULL,
  email text,
  conditions text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create therapy_sessions table
CREATE TABLE IF NOT EXISTS therapy_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES patients(id) ON DELETE CASCADE,
  date date NOT NULL,
  time time NOT NULL,
  type text NOT NULL,
  duration integer NOT NULL DEFAULT 45,
  status text NOT NULL DEFAULT 'zakazana' CHECK (status IN ('zakazana', 'odrađena', 'propuštena')),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create treatments table
CREATE TABLE IF NOT EXISTS treatments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES patients(id) ON DELETE CASCADE,
  date date NOT NULL,
  description text NOT NULL,
  notes text,
  duration integer NOT NULL DEFAULT 45,
  photos text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE therapy_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE treatments ENABLE ROW LEVEL SECURITY;

-- Create policies for patients table
CREATE POLICY "Enable all operations for authenticated users on patients"
  ON patients
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create policies for therapy_sessions table
CREATE POLICY "Enable all operations for authenticated users on therapy_sessions"
  ON therapy_sessions
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create policies for treatments table
CREATE POLICY "Enable all operations for authenticated users on treatments"
  ON treatments
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_patients_updated_at BEFORE UPDATE ON patients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_therapy_sessions_updated_at BEFORE UPDATE ON therapy_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_treatments_updated_at BEFORE UPDATE ON treatments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_patients_is_active ON patients(is_active);
CREATE INDEX IF NOT EXISTS idx_therapy_sessions_patient_id ON therapy_sessions(patient_id);
CREATE INDEX IF NOT EXISTS idx_therapy_sessions_date ON therapy_sessions(date);
CREATE INDEX IF NOT EXISTS idx_therapy_sessions_status ON therapy_sessions(status);
CREATE INDEX IF NOT EXISTS idx_treatments_patient_id ON treatments(patient_id);
CREATE INDEX IF NOT EXISTS idx_treatments_date ON treatments(date);