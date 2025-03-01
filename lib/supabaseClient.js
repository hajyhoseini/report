// supabaseClient.js
import { createClient } from '@supabase/supabase-js';

// گرفتن URL و کلید از متغیرهای محیطی
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// ایجاد کلاینت Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
