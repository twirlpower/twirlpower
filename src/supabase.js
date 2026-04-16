import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://fascxnrrnsknjnojfxvv.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhc2N4bnJybnNrbmpub2pmeHZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYzNjI3MjAsImV4cCI6MjA5MTkzODcyMH0.PeBZxHI8FwISfS0tMwXTcpHBnUFyoLCdtQNm59HrmQU'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
