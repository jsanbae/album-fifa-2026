import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { StickerDTO } from '../src/catalog/infrastructure/adapters/CatalogApiAdapter.js';
import { StickerListRow } from '../src/catalog/infrastructure/ui/components/StickerListRow.js';

const baseProps = {
  count: 0,
  isAuthenticated: true,
  onIncrement: vi.fn(),
  onDecrement: vi.fn(),
};

const mexicoSticker: StickerDTO = {
  id: 'MEX1',
  name: 'Test Player',
  countryId: 'MEX',
  group: 'Grupo A',
  countryName: 'México',
  isoCode: 'MX',
};

function renderRow(sticker: StickerDTO, overrides: Partial<typeof baseProps> = {}) {
  return render(<StickerListRow sticker={sticker} {...baseProps} {...overrides} />);
}

describe('StickerListRow', () => {
  it('shows duplicate badge when count is at least 2', () => {
    renderRow(mexicoSticker, { count: 2 });

    expect(screen.getByText('Repetida')).toBeInTheDocument();
  });

  it('hides duplicate badge when count is 0 or 1', () => {
    const { rerender } = renderRow(mexicoSticker, { count: 0 });

    expect(screen.queryByText('Duplicate')).not.toBeInTheDocument();

    rerender(
      <StickerListRow sticker={mexicoSticker} {...baseProps} count={1} />,
    );

    expect(screen.queryByText('Duplicate')).not.toBeInTheDocument();
  });

  it('exposes accessible duplicate text on the badge', () => {
    renderRow(mexicoSticker, { count: 3 });

    expect(screen.getByLabelText('Repetida')).toBeInTheDocument();
  });

  it('shows FIFA icon for FIFA World Cup stickers without a country flag', () => {
    renderRow({
      id: 'FWC1',
      name: 'FWC Sticker',
      countryId: null,
      group: 'FIFA World Cup',
      countryName: null,
      isoCode: null,
    });

    expect(screen.getByRole('img', { name: 'FIFA World Cup' })).toBeInTheDocument();
  });

  it('shows Coca-Cola icon for Coca-Cola stickers without a country flag', () => {
    renderRow({
      id: 'CC1',
      name: 'Lamine Yamal',
      countryId: null,
      group: 'Coca-Cola',
      countryName: null,
      isoCode: null,
    });

    expect(screen.getByRole('img', { name: 'Coca-Cola' })).toBeInTheDocument();
  });
});
