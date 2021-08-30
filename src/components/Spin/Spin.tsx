import React from 'react';
import styles from './spin.module.scss';

interface SpinProps {
  classNames?: string,
}

export default function Spin({ classNames }: SpinProps) {
  return (
    <div className={`
      ${styles.loadingioSpinnerRolling}
      ${classNames}
    `}>
      <div className={styles.loading}>
        <div />
      </div>
    </div>
  );
}