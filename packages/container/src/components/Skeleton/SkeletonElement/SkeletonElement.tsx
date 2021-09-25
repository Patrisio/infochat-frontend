import React from 'react';
import styles from './skeleton.module.scss';

interface SkeletonProps {
  type: 'avatar' | 'title' | 'paragraph',
  width: string,
}

export default function SkeletonElement({ type, width }: SkeletonProps) {
  return (
    <div className={styles.avatarSkeletonContainer}>
      <div
        className={styles[type]}
        style={{
          width,
          height: type === 'avatar' ? width : '',
        }}
      />
    </div>
  );
}