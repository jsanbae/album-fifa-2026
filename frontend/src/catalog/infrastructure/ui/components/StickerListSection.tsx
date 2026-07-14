import type { StickerDTO } from '../../adapters/CatalogApiAdapter.js';
import { GroupIcon } from './icons/GroupIcon.js';
import {
  computeGroupProgress,
  formatGroupProgressLabel,
} from './groupProgress.js';
import { StickerListRow } from './StickerListRow.js';
import styles from './StickerListSection.module.css';

interface StickerListSectionProps {
  groupName: string;
  stickers: StickerDTO[];
  getCount: (stickerId: string) => number;
  isAuthenticated: boolean;
  isExpanded: boolean;
  onToggle: () => void;
  onIncrement: (stickerId: string) => void;
  onDecrement: (stickerId: string) => void;
}

export function StickerListSection(props: StickerListSectionProps) {
  if (props.stickers.length === 0) {
    return null;
  }

  const progressLabel = formatGroupProgressLabel(
    computeGroupProgress(props.stickers, props.getCount),
  );

  return (
    <section className={styles.section}>
      <button
        type="button"
        className={styles.heading}
        onClick={props.onToggle}
        aria-expanded={props.isExpanded}
      >
        <span
          className={`${styles.chevron} ${props.isExpanded ? '' : styles.chevronCollapsed}`}
          aria-hidden="true"
        />
        <GroupIcon groupName={props.groupName} size="sm" />
        <h2 className={styles.headingTitle}>{props.groupName}</h2>
        <span className={styles.progress}>{progressLabel}</span>
      </button>
      {props.isExpanded && (
        <div className={styles.list}>
          {props.stickers.map((sticker) => (
            <StickerListRow
              key={sticker.id}
              sticker={sticker}
              count={props.getCount(sticker.id)}
              isAuthenticated={props.isAuthenticated}
              onIncrement={props.onIncrement}
              onDecrement={props.onDecrement}
            />
          ))}
        </div>
      )}
    </section>
  );
}
