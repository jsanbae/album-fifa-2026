import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { WorldCupEmblem } from '../src/shared/infrastructure/ui/components/WorldCupEmblem/WorldCupEmblem.js';
import { mapPointerToTilt, MAX_TILT_DEGREES } from '../src/shared/infrastructure/ui/hooks/tilt3d.js';
import { useTilt3D } from '../src/shared/infrastructure/ui/hooks/useTilt3D.hook.js';

const rect = { left: 0, top: 0, width: 100, height: 100 };

function mockBoundingRect(element: HTMLElement) {
  element.getBoundingClientRect = () => ({
    left: 0,
    top: 0,
    width: 100,
    height: 100,
    right: 100,
    bottom: 100,
    x: 0,
    y: 0,
    toJSON: () => ({}),
  });
}

function dispatchPointerMove(target: HTMLElement, clientX: number, clientY: number) {
  act(() => {
    const event = new Event('pointermove', { bubbles: true });
    Object.defineProperty(event, 'clientX', { value: clientX });
    Object.defineProperty(event, 'clientY', { value: clientY });
    target.dispatchEvent(event);
  });
}

function dispatchPointerLeave(target: HTMLElement) {
  act(() => {
    fireEvent.pointerLeave(target);
  });
}

function mockReducedMotion(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: query === '(prefers-reduced-motion: reduce)' ? matches : false,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

function TiltProbe() {
  const tilt = useTilt3D();

  return (
    <div
      ref={tilt.ref}
      onPointerMove={tilt.onPointerMove}
      onPointerLeave={tilt.onPointerLeave}
      data-testid="tilt-target"
      data-rotate-x={tilt.rotateX}
      data-rotate-y={tilt.rotateY}
    />
  );
}

describe('The mapPointerToTilt helper', () => {
  it('maps pointer position to clamped rotateX and rotateY values', () => {
    const topRight = mapPointerToTilt(rect, 100, 0);

    expect(topRight.rotateY).toBe(MAX_TILT_DEGREES);
    expect(topRight.rotateX).toBe(MAX_TILT_DEGREES);
  });

  it('returns neutral angles at the center', () => {
    const angles = mapPointerToTilt(rect, 50, 50);

    expect(angles.rotateX).toBe(0);
    expect(angles.rotateY).toBe(0);
  });
});

describe('The useTilt3D hook', () => {
  it('resets tilt on pointer leave', () => {
    render(<TiltProbe />);

    const target = screen.getByTestId('tilt-target');
    mockBoundingRect(target);

    dispatchPointerMove(target, 100, 0);
    expect(target).toHaveAttribute('data-rotate-y', String(MAX_TILT_DEGREES));

    dispatchPointerLeave(target);
    expect(target).toHaveAttribute('data-rotate-x', '0');
    expect(target).toHaveAttribute('data-rotate-y', '0');
  });
});

describe('The WorldCupEmblem component', () => {
  it('renders the compact variant without a tilt surface', () => {
    render(<WorldCupEmblem variant="compact" />);

    const emblem = screen.getByRole('img', { name: 'FIFA World Cup 2026' });
    expect(emblem).toHaveAttribute('width', '64');
    expect(screen.queryByTestId('world-cup-emblem-tilt')).not.toBeInTheDocument();
  });

  it('renders the hero variant without a tilt surface when not interactive', () => {
    render(<WorldCupEmblem variant="hero" />);

    const emblem = screen.getByRole('img', { name: 'FIFA World Cup 2026' });
    expect(emblem).toHaveAttribute('width', '144');
    expect(screen.queryByTestId('world-cup-emblem-tilt')).not.toBeInTheDocument();
  });

  it('tilts the emblem when interactive and the pointer moves over it', () => {
    mockReducedMotion(false);

    render(<WorldCupEmblem variant="hero" interactive />);

    const emblemTilt = screen.getByTestId('world-cup-emblem-tilt');
    mockBoundingRect(emblemTilt);
    dispatchPointerMove(emblemTilt, 100, 0);

    expect(emblemTilt.style.getPropertyValue('--tilt-y')).toBe(`${MAX_TILT_DEGREES}deg`);
    expect(emblemTilt.style.getPropertyValue('--tilt-x')).toBe(`${MAX_TILT_DEGREES}deg`);
  });

  it('resets interactive emblem tilt on pointer leave', () => {
    mockReducedMotion(false);

    render(<WorldCupEmblem variant="hero" interactive />);

    const emblemTilt = screen.getByTestId('world-cup-emblem-tilt');
    mockBoundingRect(emblemTilt);
    dispatchPointerMove(emblemTilt, 100, 0);

    dispatchPointerLeave(emblemTilt);

    expect(emblemTilt.style.getPropertyValue('--tilt-x')).toBe('0deg');
    expect(emblemTilt.style.getPropertyValue('--tilt-y')).toBe('0deg');
  });

  it('keeps the interactive emblem static when reduced motion is preferred', () => {
    mockReducedMotion(true);

    render(<WorldCupEmblem variant="hero" interactive />);

    const emblemTilt = screen.getByTestId('world-cup-emblem-tilt');
    expect(emblemTilt).toHaveAttribute('data-reduced-motion', 'true');
    expect(emblemTilt.style.getPropertyValue('--tilt-x')).toBe('');
  });
});
