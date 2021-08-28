import React from 'react';

import styles from './badge.module.scss';

interface BadgeProps {
  size?: 'small' | 'medium' | 'large',
  color?: string,
  children: React.ReactNode,
}

export default function Badge({ size, color, children }: BadgeProps) {
  return (
    <div className={styles.badgeContainer}>
      { children }
      
      <div
        className={`
          ${styles.badge}
          ${size === 'small' ? styles.small :
            size === 'large' ? styles.large : styles.medium}
          ${color ? color : styles.defaultBadgeColor}
        `}
      />
    </div>
  );
}