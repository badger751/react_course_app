// supabaseClient.js (or wherever you initialize Supabase client)

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'your uri';
const supabaseKey = 'your api key';

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase URL or API Key. Check your environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
