import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// اگر متغیرهای محیطی درست تنظیم نشده باشند، خطا بده
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase environment variables are missing!");
}

// ایجاد کلاینت Supabase
export  const supabase = createClient(supabaseUrl, supabaseAnonKey);
export default supabase;
