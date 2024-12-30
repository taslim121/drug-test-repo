import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qcvluyuftgzwlyedecwu.supabase.co';
const supabaseAnonKey =  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFjdmx1eXVmdGd6d2x5ZWRlY3d1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUxMzU2NjAsImV4cCI6MjA1MDcxMTY2MH0.vy3oXV88k2y0cxRsz-ZxDJgSLoK9IyJ5pd3ljYSZJ0s';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})