import type { CSSProperties } from 'react';

export const MAX_TILT_DEGREES = 16;

export interface TiltAngles {
  rotateX: number;
  rotateY: number;
}

export function mapPointerToTilt(
  rect: Pick<DOMRect, 'left' | 'top' | 'width' | 'height'>,
  clientX: number,
  clientY: number,
  maxTilt = MAX_TILT_DEGREES,
): TiltAngles {
  if (rect.width === 0 || rect.height === 0) {
    return { rotateX: 0, rotateY: 0 };
  }

  const offsetX = clientX - rect.left - rect.width / 2;
  const offsetY = clientY - rect.top - rect.height / 2;
  const rotateY = (offsetX / (rect.width / 2)) * maxTilt;
  const rotateX = (-offsetY / (rect.height / 2)) * maxTilt;

  return {
    rotateX: clamp(rotateX, -maxTilt, maxTilt) + 0,
    rotateY: clamp(rotateY, -maxTilt, maxTilt) + 0,
  };
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function tiltAnglesToStyle(angles: TiltAngles): CSSProperties {
  return {
    '--tilt-x': `${angles.rotateX}deg`,
    '--tilt-y': `${angles.rotateY}deg`,
  } as CSSProperties;
}
