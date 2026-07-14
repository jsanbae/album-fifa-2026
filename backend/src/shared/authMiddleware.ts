import type { NextFunction, Request, Response } from 'express';
import { createClient } from '@supabase/supabase-js';
import { UserId } from '../collection/domain/entities/UserId.js';
import { Logger } from './Logger.js';
import { readSupabaseEnv } from './supabaseEnv.js';

export type AuthenticatedRequest = Request & { userId?: UserId };

export async function authMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const authHeader = req.headers.authorization;

  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.slice(7);
    const { url: supabaseUrl, publishableKey } = readSupabaseEnv();

    if (supabaseUrl && publishableKey) {
      try {
        const supabase = createClient(supabaseUrl, publishableKey);
        const { data, error } = await supabase.auth.getUser(token);

        if (!error && data.user) {
          req.userId = UserId.create(data.user.id);
          next();
          return;
        }
      } catch (error) {
        Logger.warn('Auth verification failed', {
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }
  }

  const devUserId = process.env.DEV_USER_ID;
  if (devUserId) {
    req.userId = UserId.create(devUserId);
    next();
    return;
  }

  res.status(401).json({ error: 'Unauthorized' });
}
