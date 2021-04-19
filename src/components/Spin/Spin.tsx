import React from 'react';
import styles from './spin.module.scss';

export default function Spin() {
  return (
    <div className={styles.loadingioSpinnerRolling}>
      <div className={styles.loading}>
        <div />
      </div>
    </div>
  );
}