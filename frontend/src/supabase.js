
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://kdtlhmatetcxehvgfryh.supabase.co'
// WARNING: The user provided a 'service_role' key. In production, use the 'anon' key for the frontend!
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtkdGxobWF0ZXRjeGVodmdmcnloIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Nzk3Nzk4MCwiZXhwIjoyMDgzNTUzOTgwfQ.V_01LWMulq5hXArOONxQH6d4wuetg1Ib5BgEVt88-cA'

export const supabase = createClient(supabaseUrl, supabaseKey)
