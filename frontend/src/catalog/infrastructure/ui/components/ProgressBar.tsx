import { TOTAL_STICKERS } from '@album/common';
import type { Maybe } from '@album/common';
import { useId } from 'react';
import type { CollectionProgressDTO } from '../../../../collection/infrastructure/adapters/CollectionApiAdapter.js';
import { ui } from '../../../../shared/infrastructure/ui/uiStrings.js';
import styles from './ProgressBar.module.css';

interface ProgressBarProps {
  progress: Maybe<CollectionProgressDTO>;
  headerAction?: {
    label: string;
    ariaLabel: string;
    onClick: () => void;
  };
}

interface ProgressValues {
  owned: number;
  total: number;
  percentage: number;
  statsText: string;
}

function clampPercentage(percentage: number): number {
  if (!Number.isFinite(percentage)) {
    return 0;
  }
  return Math.min(100, Math.max(0, percentage));
}

function clampOwned(owned: number, total: number): number {
  if (!Number.isFinite(owned) || owned < 0) {
    return 0;
  }
  if (!Number.isFinite(total) || total <= 0) {
    return owned;
  }
  return Math.min(owned, total);
}

function formatProgressStatsText(owned: number, total: number, percentage: number): string {
  const displayPercentage = Math.round(percentage);
  return `${owned} / ${total} (${displayPercentage}%)`;
}

function resolveProgressValues(progress: Maybe<CollectionProgressDTO>): ProgressValues {
  return progress.fold(
    () => ({
      owned: 0,
      total: TOTAL_STICKERS,
      percentage: 0,
      statsText: `— / ${TOTAL_STICKERS} (—%)`,
    }),
    (loaded) => {
      const total = loaded.total > 0 ? loaded.total : TOTAL_STICKERS;
      const owned = clampOwned(loaded.owned, total);
      const percentage = clampPercentage(loaded.percentage);
      return {
        owned,
        total,
        percentage,
        statsText: formatProgressStatsText(owned, total, percentage),
      };
    },
  );
}

export function ProgressBar(props: ProgressBarProps) {
  const labelId = useId();
  const statsId = useId();
  const values = resolveProgressValues(props.progress);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div id={labelId} className={styles.label}>
          {ui.album.progress}
        </div>
        {props.headerAction && (
          <button
            type="button"
            className={styles.headerAction}
            aria-label={props.headerAction.ariaLabel}
            onClick={props.headerAction.onClick}
          >
            {props.headerAction.label}
          </button>
        )}
      </div>
      <div
        className={styles.track}
        role="progressbar"
        aria-labelledby={labelId}
        aria-describedby={statsId}
        aria-valuemin={0}
        aria-valuenow={values.owned}
        aria-valuemax={values.total}
      >
        <div
          className={styles.fill}
          aria-hidden="true"
          style={{ transform: `scaleX(${values.percentage / 100})` }}
        />
      </div>
      <div id={statsId} className={styles.stats}>
        {values.statsText}
      </div>
    </div>
  );
}
