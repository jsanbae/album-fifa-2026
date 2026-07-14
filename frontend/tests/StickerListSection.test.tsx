import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { StickerDTO } from '../src/catalog/infrastructure/adapters/CatalogApiAdapter.js';
import { StickerListSection } from '../src/catalog/infrastructure/ui/components/StickerListSection.js';

const fwcSticker: StickerDTO = {
  id: 'FWC1',
  name: 'FWC Sticker',
  countryId: null,
  group: 'FIFA World Cup',
  countryName: null,
  isoCode: null,
};

const fwcSticker2: StickerDTO = {
  id: 'FWC2',
  name: 'FWC Sticker 2',
  countryId: null,
  group: 'FIFA World Cup',
  countryName: null,
  isoCode: null,
};

const fwcSticker3: StickerDTO = {
  id: 'FWC3',
  name: 'FWC Sticker 3',
  countryId: null,
  group: 'FIFA World Cup',
  countryName: null,
  isoCode: null,
};

const cocaColaSticker: StickerDTO = {
  id: 'CC1',
  name: 'Lamine Yamal',
  countryId: null,
  group: 'Coca-Cola',
  countryName: null,
  isoCode: null,
};

const sectionProps = {
  getCount: () => 0,
  isAuthenticated: true,
  onIncrement: vi.fn(),
  onDecrement: vi.fn(),
  isExpanded: true,
  onToggle: vi.fn(),
};

describe('StickerListSection', () => {
  it('shows FIFA icon in FIFA World Cup section header', () => {
    render(
      <StickerListSection groupName="FIFA World Cup" stickers={[fwcSticker]} {...sectionProps} />,
    );

    const header = screen.getByRole('button', { name: /FIFA World Cup/ });
    expect(within(header).getByRole('img', { name: 'FIFA World Cup' })).toBeInTheDocument();
  });

  it('shows Coca-Cola icon in Coca-Cola section header', () => {
    render(
      <StickerListSection groupName="Coca-Cola" stickers={[cocaColaSticker]} {...sectionProps} />,
    );

    const header = screen.getByRole('button', { name: /Coca-Cola/ });
    expect(within(header).getByRole('img', { name: 'Coca-Cola' })).toBeInTheDocument();
  });

  it('shows progress text in the section header', () => {
    const counts: Record<string, number> = { FWC1: 1, FWC2: 1, FWC3: 0 };

    render(
      <StickerListSection
        groupName="FIFA World Cup"
        stickers={[fwcSticker, fwcSticker2, fwcSticker3]}
        {...sectionProps}
        getCount={(id) => counts[id] ?? 0}
      />,
    );

    expect(screen.getByText('2 / 3 (67%)')).toBeInTheDocument();
  });

  it('defaults to expanded with aria-expanded true', () => {
    render(
      <StickerListSection groupName="FIFA World Cup" stickers={[fwcSticker]} {...sectionProps} />,
    );

    expect(screen.getByRole('button', { name: /FIFA World Cup/ })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
    expect(screen.getByText('FWC Sticker')).toBeInTheDocument();
  });

  it('collapses sticker rows when the header is activated', () => {
    const onToggle = vi.fn();

    const { rerender } = render(
      <StickerListSection
        groupName="FIFA World Cup"
        stickers={[fwcSticker]}
        {...sectionProps}
        onToggle={onToggle}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: /FIFA World Cup/ }));
    expect(onToggle).toHaveBeenCalledOnce();

    rerender(
      <StickerListSection
        groupName="FIFA World Cup"
        stickers={[fwcSticker]}
        {...sectionProps}
        isExpanded={false}
        onToggle={onToggle}
      />,
    );

    expect(screen.getByRole('button', { name: /FIFA World Cup/ })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
    expect(screen.queryByText('FWC Sticker')).not.toBeInTheDocument();
  });

  it('expands sticker rows when a collapsed header is activated', () => {
    const { rerender } = render(
      <StickerListSection
        groupName="FIFA World Cup"
        stickers={[fwcSticker]}
        {...sectionProps}
        isExpanded={false}
      />,
    );

    expect(screen.queryByText('FWC Sticker')).not.toBeInTheDocument();

    rerender(
      <StickerListSection
        groupName="FIFA World Cup"
        stickers={[fwcSticker]}
        {...sectionProps}
        isExpanded={true}
      />,
    );

    expect(screen.getByText('FWC Sticker')).toBeInTheDocument();
  });
});
