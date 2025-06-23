import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Patient {
  id: string;
  name: string;
  date_of_birth: string;
  phone: string;
  email?: string;
  conditions?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TherapySession {
  id: string;
  patient_id: string;
  date: string;
  time: string;
  type: string;
  duration: number;
  status: 'zakazana' | 'odrađena' | 'propuštena';
  notes?: string;
  created_at: string;
  updated_at: string;
  patient?: Patient;
}

export interface Treatment {
  id: string;
  patient_id: string;
  date: string;
  description: string;
  notes?: string;
  duration: number;
  photos: string[];
  created_at: string;
  updated_at: string;
  patient?: Patient;
}