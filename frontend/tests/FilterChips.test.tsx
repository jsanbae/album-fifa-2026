import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { FilterChips } from '../src/catalog/infrastructure/ui/components/FilterChips.js';

describe('FilterChips', () => {
  it('renders FIFA and Coca-Cola icons on branded filter chips', () => {
    render(<FilterChips activeFilter="all" onFilterChange={vi.fn()} />);

    expect(screen.getByRole('button', { name: /FIFA World Cup/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Coca-Cola/i })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'FIFA World Cup' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Coca-Cola' })).toBeInTheDocument();
  });

  it('renders the Collected chip between Missing and group chips', () => {
    render(<FilterChips activeFilter="all" onFilterChange={vi.fn()} />);

    const buttons = screen.getAllByRole('button');
    const labels = buttons.map((button) => button.getAttribute('aria-label'));

    expect(labels.indexOf('Faltantes')).toBeLessThan(labels.indexOf('Conseguidas'));
    expect(labels.indexOf('Conseguidas')).toBeLessThan(labels.indexOf('Repetidas'));
    expect(labels.indexOf('Repetidas')).toBeLessThan(labels.indexOf('FIFA World Cup'));
    expect(screen.getByRole('button', { name: 'Conseguidas' })).toBeInTheDocument();
  });

  it('renders the Duplicates chip after Collected and before group chips', () => {
    render(<FilterChips activeFilter="all" onFilterChange={vi.fn()} />);

    expect(screen.getByRole('button', { name: 'Repetidas' })).toBeInTheDocument();
  });
});
