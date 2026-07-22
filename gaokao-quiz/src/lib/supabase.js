// Supabase 客户端配置
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://eankrbgtlupuaodtdhw.supabase.co'
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_jJKrkC1NkFTSpbgho5Koaw_lUrLmo1B'

if (!SUPABASE_ANON_KEY) {
  console.warn('[Supabase] VITE_SUPABASE_ANON_KEY 未设置，认证功能不可用。请在 .env 文件中配置。')
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})
