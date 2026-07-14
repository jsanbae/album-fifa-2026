import { useTilt3D } from '../../hooks/useTilt3D.hook.js';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion.hook.js';
import styles from './WorldCupEmblem.module.css';

const LOGO_SRC = '/world-cup-2026-logo.png';
const LOGO_ALT = 'FIFA World Cup 2026';

interface WorldCupEmblemProps {
  variant?: 'compact' | 'hero';
  interactive?: boolean;
}

export function WorldCupEmblem(props: WorldCupEmblemProps) {
  const variant = props.variant ?? 'compact';
  const interactive = props.interactive ?? false;
  const isReducedMotion = usePrefersReducedMotion();
  const tilt = useTilt3D();

  const logoSize = variant === 'hero' ? 144 : 64;
  const rootClassName =
    variant === 'hero' ? `${styles.root} ${styles.rootHero}` : styles.root;
  const logoClassName =
    variant === 'hero' ? `${styles.logo} ${styles.logoHero}` : styles.logo;

  const emblemImage = (
    <img
      className={logoClassName}
      src={LOGO_SRC}
      alt={LOGO_ALT}
      width={logoSize}
      height={logoSize}
      decoding="async"
    />
  );

  if (!interactive) {
    return <div className={rootClassName}>{emblemImage}</div>;
  }

  const tiltSurfaceClassName = [
    styles.tiltSurface,
    isReducedMotion ? styles.tiltStatic : '',
    tilt.isResetting ? styles.tiltSurfaceResetting : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={`${rootClassName} ${styles.tiltRoot}`}>
      <div
        className={tiltSurfaceClassName}
        ref={tilt.ref}
        onPointerMove={isReducedMotion ? undefined : tilt.onPointerMove}
        onPointerLeave={isReducedMotion ? undefined : tilt.onPointerLeave}
        style={isReducedMotion ? undefined : tilt.style}
        data-testid="world-cup-emblem-tilt"
        data-reduced-motion={isReducedMotion ? 'true' : 'false'}
      >
        {emblemImage}
      </div>
    </div>
  );
}
