
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://aws-1-ap-south-1.pooler.supabase.com' // Using the pooler URL for now or need the Project URL
// Waiting for correct Project URL from user
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY'

export const supabase = createClient(supabaseUrl, supabaseKey)
