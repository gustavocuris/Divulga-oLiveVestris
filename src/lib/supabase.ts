import { createClient } from '@supabase/supabase-js'
import { localTestDatabase } from './localTestDatabase'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

const remoteSupabase = createClient(supabaseUrl, supabaseAnonKey)

// Activate with VITE_USE_LOCAL_DB=true. Data stays only in this browser's localStorage.
export const supabase = import.meta.env.VITE_USE_LOCAL_DB === 'true'
  ? localTestDatabase as unknown as typeof remoteSupabase
  : remoteSupabase
