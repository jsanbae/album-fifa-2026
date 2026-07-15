import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FifaIcon } from '../src/catalog/infrastructure/ui/components/icons/FifaIcon.js';

describe('FifaIcon', () => {
  it('renders an accessible SVG', () => {
    render(<FifaIcon />);
    const icon = screen.getByRole('img', { name: 'FIFA World Cup' });
    expect(icon.tagName.toLowerCase()).toBe('svg');
  });

  it('uses FIFA brand blue fill', () => {
    const { container } = render(<FifaIcon />);
    const brandFill = container.querySelector('[fill="#326295"]');
    expect(brandFill).toBeInTheDocument();
  });

  it('uses a trimmed viewBox', () => {
    render(<FifaIcon />);
    const icon = screen.getByRole('img', { name: 'FIFA World Cup' });
    expect(icon.getAttribute('viewBox')).toBe('0 0 27 16');
  });
});
