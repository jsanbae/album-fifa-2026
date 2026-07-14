export interface SupabaseEnvConfig {
  url: string | undefined;
  publishableKey: string | undefined;
  secretKey: string | undefined;
}

export function readSupabaseEnv(): SupabaseEnvConfig {
  return {
    url: process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL,
    publishableKey:
      process.env.SUPABASE_PUBLISHABLE_KEY ??
      process.env.SUPABASE_ANON_KEY ??
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    secretKey:
      process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY,
  };
}

export function resolveSupabaseApiKey(
  config: SupabaseEnvConfig,
  preferSecret = false,
): string | undefined {
  if (preferSecret && config.secretKey) {
    return config.secretKey;
  }
  return config.secretKey ?? config.publishableKey;
}
