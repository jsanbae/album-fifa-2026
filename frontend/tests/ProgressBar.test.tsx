import { Maybe, TOTAL_STICKERS } from '@album/common';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ProgressBar } from '../src/catalog/infrastructure/ui/components/ProgressBar.js';

describe('The ProgressBar', () => {
  it('announces loaded collection progress to assistive technologies', () => {
    render(
      <ProgressBar
        progress={Maybe.some({ owned: 142, total: TOTAL_STICKERS, percentage: 14.3 })}
      />,
    );

    const progressbar = screen.getByRole('progressbar', { name: 'Progreso' });

    expect(progressbar).toHaveAttribute('aria-valuenow', '142');
    expect(progressbar).toHaveAttribute('aria-valuemin', '0');
    expect(progressbar).toHaveAttribute('aria-valuemax', String(TOTAL_STICKERS));
    expect(screen.getByText(`142 / ${TOTAL_STICKERS} (14%)`)).toHaveAttribute(
      'id',
      progressbar.getAttribute('aria-describedby'),
    );
  });

  it('shows loaded progress as owned, total, and percentage', () => {
    render(
      <ProgressBar
        progress={Maybe.some({ owned: 142, total: TOTAL_STICKERS, percentage: 14.3 })}
      />,
    );

    expect(screen.getByText(`142 / ${TOTAL_STICKERS} (14%)`)).toBeInTheDocument();
  });

  it('announces zero progress while collection data is unavailable', () => {
    render(<ProgressBar progress={Maybe.none()} />);

    const progressbar = screen.getByRole('progressbar', { name: 'Progreso' });

    expect(progressbar).toHaveAttribute('aria-valuenow', '0');
    expect(progressbar).toHaveAttribute('aria-valuemin', '0');
    expect(progressbar).toHaveAttribute('aria-valuemax', String(TOTAL_STICKERS));
    expect(screen.getByText(`— / ${TOTAL_STICKERS} (—%)`)).toBeInTheDocument();
  });

  it('shows unavailable progress with placeholder percentage', () => {
    render(<ProgressBar progress={Maybe.none()} />);

    expect(screen.getByText(`— / ${TOTAL_STICKERS} (—%)`)).toBeInTheDocument();
  });

  it('keeps the visual fill within bounds when percentage is out of range', () => {
    render(
      <ProgressBar progress={Maybe.some({ owned: 5, total: 100, percentage: 150 })} />,
    );

    const fill = document.querySelector('[class*="fill"]') as HTMLElement | null;

    expect(fill).toHaveStyle({ transform: 'scaleX(1)' });
  });

  it('renders an optional header action beside the progress label', () => {
    render(
      <ProgressBar
        progress={Maybe.none()}
        headerAction={{
          label: 'Agregar códigos',
          ariaLabel: 'Registrar cromos por código',
          onClick: () => undefined,
        }}
      />,
    );

    expect(screen.getByRole('button', { name: 'Registrar cromos por código' })).toHaveTextContent(
      'Agregar códigos',
    );
  });
});
