import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Supabase credentials - PLEASE REPLACE WITH YOUR OWN
const SUPABASE_URL = 'https://moscubjvhcuslhxgpfxl.supabase.co'; // Replace with your Supabase project URL
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1vc2N1Ymp2aGN1c2xoeGdwZnhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1MzIyMzksImV4cCI6MjA2NjEwODIzOX0.y19QCN-a9g0XFaupajyo1xWPVFwEb2YlzNbx63jY3TY'; // Replace with your Supabase anon key

// Create a single Supabase client for interacting with your database
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Basic check to see if credentials have been replaced
if (SUPABASE_URL === 'YOUR_SUPABASE_URL' || SUPABASE_KEY === 'YOUR_SUPABASE_ANON_KEY') {
  console.warn('Supabase credentials have not been set. Please update supabase-client.js');
} 