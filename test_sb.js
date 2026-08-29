const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
  console.log("Fetching...");
  const { data, error } = await supabase.from('jadwal_ngajar').select('*');
  console.log("Data:", data);
  if (error) {
    console.error("Error:", JSON.stringify(error, null, 2));
    console.error("Raw Error:", error);
  }
}

test();
