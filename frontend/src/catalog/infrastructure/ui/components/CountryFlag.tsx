import { useEffect, useState } from 'react';
import { loadFlagUrl } from './flagAssetLoader.js';
import styles from './CountryFlag.module.css';

interface CountryFlagProps {
  isoCode: string | null;
  countryName?: string | null;
}

export function resolveFlagCode(isoCode: string): string {
  if (isoCode === 'GB-ENG' || isoCode === 'GB-SCT') {
    return 'GB';
  }
  return isoCode;
}

export function CountryFlag(props: CountryFlagProps) {
  const [flagUrl, setFlagUrl] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!props.isoCode) {
      setFlagUrl(null);
      setFailed(false);
      return;
    }

    const flagCode = resolveFlagCode(props.isoCode);
    let cancelled = false;
    setFlagUrl(null);
    setFailed(false);

    loadFlagUrl(flagCode).then((url) => {
      if (cancelled) {
        return;
      }
      if (url) {
        setFlagUrl(url);
        return;
      }
      setFailed(true);
    });

    return () => {
      cancelled = true;
    };
  }, [props.isoCode]);

  if (!props.isoCode) {
    return <span className={styles.placeholder} aria-hidden="true" />;
  }

  const label = props.countryName ?? props.isoCode;

  if (failed || !flagUrl) {
    return (
      <span className={styles.placeholder} aria-label={label}>
        ?
      </span>
    );
  }

  return (
    <img
      className={styles.flag}
      src={flagUrl}
      alt={label}
      data-iso-code={props.isoCode}
      loading="lazy"
      decoding="async"
    />
  );
}
