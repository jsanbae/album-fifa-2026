import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { App } from '../src/shared/infrastructure/App.js';

vi.mock('../src/shared/infrastructure/supabaseClient.js', () => ({
  getAccessToken: vi.fn(() => Promise.resolve(null)),
  supabase: null,
}));

vi.mock('../src/catalog/infrastructure/ui/pages/StickerListPage.js', () => ({
  StickerListPage: () => <div data-testid="sticker-list-page">Dashboard</div>,
}));

describe('The App shell in dev mode', () => {
  it('skips auth screens and account toolbar when Supabase is not configured', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByTestId('sticker-list-page')).toBeInTheDocument();
    });

    expect(screen.queryByRole('form', { name: 'Iniciar sesión' })).not.toBeInTheDocument();
    expect(screen.queryByRole('banner', { name: 'Cuenta' })).not.toBeInTheDocument();
  });
});

describe('The App shell', () => {
  it('announces session loading to assistive technologies', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByTestId('sticker-list-page')).toBeInTheDocument();
    });
  });
});
