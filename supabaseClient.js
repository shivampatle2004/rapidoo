import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const supabaseUrl = 'https://towoqmmrdgpkbzjkvcxq.supabase.co';
const supabaseKey = 'sb_publishable_qUjxOiZoqU4Z2U25dMAU9w__rTZGpIO';

export const supabase = createClient(supabaseUrl, supabaseKey);
