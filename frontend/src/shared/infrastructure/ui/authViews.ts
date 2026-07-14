export type AuthView = 'sign-in' | 'sign-up' | 'forgot-password';

export type SignInMode = 'password' | 'magic-link';

export const AUTH_SUBTITLES: Record<AuthView, string> = {
  'sign-in': 'Sign in to track your sticker collection',
  'sign-up': 'Create an account to save your collection',
  'forgot-password': "We'll email you a reset link",
};

export const RESET_PASSWORD_SUBTITLE = 'Choose a new password';

export function canUserChangePassword(user: {
  identities?: Array<{ provider: string }>;
}): boolean {
  return user.identities?.some((identity) => identity.provider === 'email') ?? false;
}
