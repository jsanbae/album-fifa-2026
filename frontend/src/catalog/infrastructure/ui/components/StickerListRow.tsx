import type { StickerDTO } from '../../adapters/CatalogApiAdapter.js';
import { CountryFlag } from './CountryFlag.js';
import { GroupIcon } from './icons/GroupIcon.js';
import styles from './StickerListRow.module.css';

interface StickerListRowProps {
  sticker: StickerDTO;
  count: number;
  isAuthenticated: boolean;
  onIncrement: (stickerId: string) => void;
  onDecrement: (stickerId: string) => void;
}

export function StickerListRow(props: StickerListRowProps) {
  const controlsDisabled = !props.isAuthenticated;

  return (
    <div className={styles.row}>
      <div className={styles.info}>
        {props.sticker.isoCode ? (
          <CountryFlag isoCode={props.sticker.isoCode} countryName={props.sticker.countryName} />
        ) : (
          <GroupIcon
            groupName={props.sticker.group}
            size="md"
            fallback={<CountryFlag isoCode={null} />}
          />
        )}
        <div className={styles.details}>
          <span className={styles.nameRow}>
            <span className={styles.countryName}>
              {props.sticker.countryName ?? props.sticker.group}
            </span>
            {props.count >= 2 && (
              <span className={styles.duplicateBadge} aria-label="Duplicate">
                Duplicate
              </span>
            )}
          </span>
          <span className={styles.stickerMeta}>
            <span className={styles.stickerId}>#{props.sticker.id}</span>
            <span className={styles.stickerName}>{props.sticker.name}</span>
          </span>
        </div>
      </div>
      <div className={styles.controls}>
        <button
          type="button"
          className={styles.controlButton}
          onClick={() => props.onDecrement(props.sticker.id)}
          disabled={controlsDisabled || props.count === 0}
          aria-label={`Decrease count for sticker ${props.sticker.id}`}
        >
          −
        </button>
        <span className={styles.count}>{props.count}</span>
        <button
          type="button"
          className={styles.controlButton}
          onClick={() => props.onIncrement(props.sticker.id)}
          disabled={controlsDisabled}
          aria-label={`Increase count for sticker ${props.sticker.id}`}
        >
          +
        </button>
      </div>
    </div>
  );
}
