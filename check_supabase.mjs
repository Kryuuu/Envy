import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://zxxwaivsofrchqoedpvg.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4eHdhaXZzb2ZyY2hxb2VkcHZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY0MTU3ODYsImV4cCI6MjEwMTk5MTc4Nn0.ex_AAMiKxBilqkKeSUDa_cJ_bCkVK3nGRoD2oaW8tA4'
);

async function check() {
  const { data, error } = await supabase.from('rooms').select('*').limit(1);
  if (error) {
    console.error('Error fetching rooms:', error.message);
  } else {
    console.log('Successfully fetched rooms. Tables exist.');
  }
}

check();
