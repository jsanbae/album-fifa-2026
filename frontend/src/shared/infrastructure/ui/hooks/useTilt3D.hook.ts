import { useRef, useState } from 'react';
import type { PointerEvent } from 'react';
import { mapPointerToTilt, tiltAnglesToStyle, type TiltAngles } from './tilt3d.js';

interface Tilt3DState {
  angles: TiltAngles;
  isResetting: boolean;
}

const neutralAngles: TiltAngles = { rotateX: 0, rotateY: 0 };

export function useTilt3D() {
  const [state, setState] = useState<Tilt3DState>({
    angles: neutralAngles,
    isResetting: false,
  });
  const elementRef = useRef<HTMLElement | null>(null);

  const setRef = (node: HTMLElement | null) => {
    elementRef.current = node;
  };

  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    const element = elementRef.current;
    if (!element) {
      return;
    }

    const rect = element.getBoundingClientRect();
    const angles = mapPointerToTilt(rect, event.clientX, event.clientY);

    setState({
      angles,
      isResetting: false,
    });
  };

  const onPointerLeave = () => {
    setState({
      angles: neutralAngles,
      isResetting: true,
    });
  };

  return {
    ref: setRef,
    onPointerMove,
    onPointerLeave,
    rotateX: state.angles.rotateX,
    rotateY: state.angles.rotateY,
    isResetting: state.isResetting,
    style: tiltAnglesToStyle(state.angles),
  };
}
