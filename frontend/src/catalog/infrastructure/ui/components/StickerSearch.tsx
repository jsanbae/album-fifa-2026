import { ui } from '../../../../shared/infrastructure/ui/uiStrings.js';
import styles from './StickerSearch.module.css';

interface StickerSearchProps {
  value: string;
  onChange: (value: string) => void;
  loading?: boolean;
}

export function StickerSearch(props: StickerSearchProps) {
  const loading = props.loading ?? false;

  return (
    <div className={styles.container}>
      <label className={styles.label} htmlFor="sticker-search">
        {ui.album.searchLabel}
      </label>
      <div className={styles.inputWrapper}>
        <input
          id="sticker-search"
          className={loading ? styles.inputLoading : styles.input}
          type="search"
          placeholder={ui.album.searchPlaceholder}
          value={props.value}
          onChange={(event) => props.onChange(event.target.value)}
          aria-busy={loading}
        />
        {loading && (
          <span
            className={styles.loadingIndicator}
            role="status"
            aria-live="polite"
            aria-label={ui.loading}
          >
            <svg
              className={styles.spinner}
              viewBox="0 0 24 24"
              aria-hidden="true"
              focusable="false"
            >
              <circle
                className={styles.spinnerTrack}
                cx="12"
                cy="12"
                r="10"
                fill="none"
                strokeWidth="2"
              />
              <circle
                className={styles.spinnerArc}
                cx="12"
                cy="12"
                r="10"
                fill="none"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="16 47"
              />
            </svg>
          </span>
        )}
      </div>
    </div>
  );
}
