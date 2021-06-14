import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Button from '../../../../components/Button/Button';

import { updateTariffPlan } from '../../../../actions';

import styles from './counter.module.scss';

interface CounterProps {
  featureId: string,
}

export default function Counter({ featureId }: CounterProps) {
  const featureCount = useSelector((state: any) => state.tariff.plan[featureId].count);
  const dispatch = useDispatch();

  const updateCounter = (type: 'inc' | 'dec') => {
    dispatch(updateTariffPlan({
      featureId,
      count: type === 'inc' ? featureCount + 1 : featureCount - 1,
    }));
  };

  return (
    <div className={styles.counterContainer}>
      <Button
        type='button'
        onClick={() => updateCounter('dec')}
        stylesList={{
          width: '30px',
          height: '30px',
          padding: '0',
          borderBottomRightRadius: '0',
          borderTopRightRadius: '0',
        }}
      >
        -
      </Button>
      <div className={styles.count}>
        {featureCount}
      </div>
      <Button
        type='button'
        onClick={() => updateCounter('inc')}
        stylesList={{
          width: '30px',
          height: '30px',
          padding: '0',
          borderBottomLeftRadius: '0',
          borderTopLeftRadius: '0',
        }}
      >
        +
      </Button>
    </div>
  );
}