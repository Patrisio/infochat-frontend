import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Button from '../../../../components/Button/Button';

import { useActions } from '../../../../hooks/useActions';
import styles from './counter.module.scss';

interface CounterProps {
  featureId: string,
}

export default function Counter({ featureId }: CounterProps) {
  const featureCount = useSelector((state: any) => state.tariff.plan[featureId].count);
  const { updateTariffPlan } = useActions();
  const updateCounter = (type: 'inc' | 'dec') => {
    updateTariffPlan({
      featureId,
      count: type === 'inc' ? featureCount + 1 : featureCount - 1,
    });
  };

  return (
    <div className={styles.counterContainer}>
      <Button
        type='button'
        onClick={() => updateCounter('dec')}
        classNames={styles.decrementBtn}
      >
        -
      </Button>
      <div className={styles.count}>
        {featureCount}
      </div>
      <Button
        type='button'
        onClick={() => updateCounter('inc')}
        classNames={styles.incrementBtn}
      >
        +
      </Button>
    </div>
  );
}