export type AuthView = 'sign-in' | 'sign-up' | 'forgot-password';

export type SignInMode = 'password' | 'magic-link';

export { AUTH_SUBTITLES, RESET_PASSWORD_SUBTITLE } from './uiStrings.js';

export function canUserChangePassword(user: {
  identities?: Array<{ provider: string }>;
}): boolean {
  return user.identities?.some((identity) => identity.provider === 'email') ?? false;
}
