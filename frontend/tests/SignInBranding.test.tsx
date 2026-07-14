import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SignInBranding } from '../src/shared/infrastructure/ui/components/SignInBranding/SignInBranding.js';

function isBefore(element: HTMLElement, other: HTMLElement): boolean {
  return (element.compareDocumentPosition(other) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0;
}

describe('The SignInBranding component', () => {
  it('shows the FIFA emblem above the app title', () => {
    render(<SignInBranding titleId="sign-in-title" />);

    const emblem = screen.getByRole('img', { name: 'FIFA World Cup 2026' });
    const title = screen.getByRole('heading', { name: 'Album FIFA 2026' });

    expect(isBefore(emblem, title)).toBe(true);
  });

  it('composes the shared WorldCupEmblem with hero variant and interactive tilt', () => {
    render(<SignInBranding titleId="sign-in-title" />);

    const emblem = screen.getByRole('img', { name: 'FIFA World Cup 2026' });
    expect(emblem).toHaveAttribute('width', '144');
    expect(screen.getByTestId('world-cup-emblem-tilt')).toBeInTheDocument();
  });

  it('places the Panini logo after the subtitle', () => {
    render(<SignInBranding titleId="sign-in-title" />);

    const subtitle = screen.getByText('Sign in to track your sticker collection');
    const panini = screen.getByRole('img', { name: 'Panini' });

    expect(isBefore(subtitle, panini)).toBe(true);
  });

  it('includes a separator in the branding region', () => {
    render(<SignInBranding titleId="sign-in-title" />);

    expect(screen.getByTestId('sign-in-branding-divider')).toBeInTheDocument();
  });

  it('renders a contextual subtitle when provided', () => {
    render(
      <SignInBranding
        titleId="sign-in-title"
        subtitle="Create an account to save your collection"
      />,
    );

    expect(screen.getByText('Create an account to save your collection')).toBeInTheDocument();
  });
});
