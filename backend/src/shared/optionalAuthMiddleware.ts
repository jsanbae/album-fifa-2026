import type { NextFunction, Response } from 'express';
import { createClient } from '@supabase/supabase-js';
import { UserId } from '../collection/domain/entities/UserId.js';
import { Logger } from './Logger.js';
import { readSupabaseEnv } from './supabaseEnv.js';
import type { AuthenticatedRequest } from './authMiddleware.js';

export async function optionalAuthMiddleware(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  const authHeader = req.headers.authorization;
  const { url: supabaseUrl, publishableKey } = readSupabaseEnv();

  if (authHeader?.startsWith('Bearer ') && supabaseUrl && publishableKey) {
    try {
      const token = authHeader.slice(7);
      const supabase = createClient(supabaseUrl, publishableKey);
      const { data, error } = await supabase.auth.getUser(token);

      if (!error && data.user) {
        req.userId = UserId.create(data.user.id);
      }
    } catch (error) {
      Logger.warn('Optional auth failed', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  if (!req.userId && process.env.DEV_USER_ID) {
    req.userId = UserId.create(process.env.DEV_USER_ID);
  }

  next();
}
