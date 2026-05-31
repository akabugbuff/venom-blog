import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '⚠️  Supabase 环境变量未配置，将使用 Markdown fallback。\n' +
    '  请复制 .env.example 为 .env 并填入你的 Supabase 项目信息。'
  );
}

/**
 * Supabase 客户端（使用 anon key）
 * 写操作权限由 RLS 策略控制，不需要 service_role key
 */
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);

/** 检查 Supabase 是否已配置 */
export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey);
}
