import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ohnjvtwacwkgdvnklowb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9obmp2dHdhY3drZ2R2bmtsb3diIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5NjkwNTksImV4cCI6MjA2NTU0NTA1OX0.gIimIAU0tHkOolujf3QKuQAHZKPllmpy8Dsqj1upiwk';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL or Anon Key is missing. Please check your environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: localStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  global: {
    fetch: (...args) => {
      const [url, options] = args;
      return fetch(url, { ...options, keepalive: true });
    }
  }
});