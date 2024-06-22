// src/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rnyqgnelempaufwjzjqq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJueXFnbmVsZW1wYXVmd2p6anFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTg5NzA5NzMsImV4cCI6MjAzNDU0Njk3M30.9s6r4G7hSuztChTXeBF3Lef7TRAkcOj9udqz3iEO4Lc';

export const supabase = createClient(supabaseUrl, supabaseKey);

