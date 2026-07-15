import { AUTH_SUBTITLES } from '../../authViews.js';
import { WorldCupEmblem } from '../WorldCupEmblem/WorldCupEmblem.js';
import styles from './SignInBranding.module.css';

const PANINI_LOGO_SRC = '/panini-logo.png';
const PANINI_LOGO_ALT = 'Panini';

interface SignInBrandingProps {
  titleId: string;
  subtitle?: string;
}

export function SignInBranding(props: SignInBrandingProps) {
  const subtitle = props.subtitle ?? AUTH_SUBTITLES['sign-in'];

  return (
    <div className={styles.branding} data-testid="sign-in-branding">
      <WorldCupEmblem variant="hero" interactive />
      <h1 id={props.titleId} className={styles.title}>
        Album FIFA 2026
      </h1>
      <p className={styles.subtitle}>{subtitle}</p>
      <img
        className={styles.paniniLogo}
        src={PANINI_LOGO_SRC}
        alt={PANINI_LOGO_ALT}
        width={88}
        height={30}
        decoding="async"
      />
      <div
        className={styles.divider}
        role="separator"
        aria-hidden="true"
        data-testid="sign-in-branding-divider"
      />
    </div>
  );
}
