import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CocaColaIcon } from '../src/catalog/infrastructure/ui/components/icons/CocaColaIcon.js';
import { GroupIcon } from '../src/catalog/infrastructure/ui/components/icons/GroupIcon.js';
import styles from '../src/catalog/infrastructure/ui/components/icons/GroupIcon.module.css';

const groupIconCssPath = resolve(
  import.meta.dirname,
  '../src/catalog/infrastructure/ui/components/icons/GroupIcon.module.css',
);

describe('CocaColaIcon', () => {
  it('renders an accessible SVG', () => {
    render(<CocaColaIcon />);
    const icon = screen.getByRole('img', { name: 'Coca-Cola' });
    expect(icon.tagName.toLowerCase()).toBe('svg');
  });

  it('uses Coca-Cola brand red fill', () => {
    const { container } = render(<CocaColaIcon />);
    const brandFill = container.querySelector('[fill="#F40009"]');
    expect(brandFill).toBeInTheDocument();
  });

  it('uses a trimmed viewBox for legibility', () => {
    render(<CocaColaIcon />);
    const icon = screen.getByRole('img', { name: 'Coca-Cola' });
    expect(icon.getAttribute('viewBox')).toBe('4 3 172 41');
  });

  it('renders with height-aligned md class when used in GroupIcon', () => {
    render(<GroupIcon groupName="Coca-Cola" size="md" />);
    const icon = screen.getByRole('img', { name: 'Coca-Cola' });
    expect(icon).toHaveClass(styles.md);
  });
});

describe('GroupIcon sizing', () => {
  it('uses height-based md sizing in CSS', () => {
    const css = readFileSync(groupIconCssPath, 'utf8');
    expect(css).toContain('height: var(--flag-slot-height)');
    expect(css).toContain('width: auto');
    expect(css).toContain('max-width: var(--brand-icon-max-width-md)');
    expect(css).not.toMatch(/\.md\s*\{[^}]*width:\s*1\.5rem/);
  });
});
