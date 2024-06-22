// supabaseClient.js (or wherever you initialize Supabase client)

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase URL or API Key. Check your environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
