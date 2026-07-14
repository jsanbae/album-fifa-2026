import type { ComponentType, ReactNode } from 'react';
import type { IconProps } from './IconProps.js';
import { CocaColaIcon } from './CocaColaIcon.js';
import { FifaIcon } from './FifaIcon.js';
import styles from './GroupIcon.module.css';

export type IconSize = 'sm' | 'md';

interface GroupIconProps {
  groupName: string;
  size?: IconSize;
  fallback?: ReactNode;
}

function getGroupIconComponent(groupName: string): ComponentType<IconProps> | null {
  if (groupName === 'FIFA World Cup') {
    return FifaIcon;
  }
  if (groupName === 'Coca-Cola') {
    return CocaColaIcon;
  }
  return null;
}

function resolveSizeClass(size: IconSize): string {
  return size === 'sm' ? styles.sm : styles.md;
}

export function GroupIcon(props: GroupIconProps) {
  const Icon = getGroupIconComponent(props.groupName);
  if (!Icon) {
    return props.fallback ?? null;
  }

  const size = props.size ?? 'md';
  return <Icon className={resolveSizeClass(size)} />;
}
