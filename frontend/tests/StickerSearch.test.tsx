import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { StickerSearch } from '../src/catalog/infrastructure/ui/components/StickerSearch.js';

describe('StickerSearch', () => {
  it('exposes search by number or name label', () => {
    render(<StickerSearch value="" onChange={vi.fn()} />);
    expect(screen.getByLabelText('Buscar por número o nombre')).toBeInTheDocument();
  });

  it('renders placeholder for id and name examples', () => {
    render(<StickerSearch value="" onChange={vi.fn()} />);
    expect(screen.getByPlaceholderText('ej. MEX3, Yamal')).toBeInTheDocument();
  });

  it('shows a loading indicator inside the search field while results are loading', () => {
    render(<StickerSearch value="Yamal" onChange={vi.fn()} loading />);

    const input = screen.getByLabelText('Buscar por número o nombre');

    expect(input).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByRole('status', { name: 'Cargando' })).toBeInTheDocument();
  });
});
