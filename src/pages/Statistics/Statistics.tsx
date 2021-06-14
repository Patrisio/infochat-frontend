import React from 'react';

import Title from '../../components/Typography/Title/Title';

import styles from './statistics.module.scss';

export default function Statistics() {
  return (
    <div className={styles.channelsContainer}>
      <Title level='1' weight='bold'>Статистика</Title>
    </div>
  );
}