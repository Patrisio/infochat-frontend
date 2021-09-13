import React from 'react';

import Button from '../../../../components/Button/Button';

import { useActions } from '../../../../hooks/useActions';
import { useTypedSelector } from '../../../../hooks/useTypedSelector';

import styles from './counter.module.scss';

interface CounterProps {
  featureId: string,
}

export default function Counter({ featureId }: CounterProps) {
  const { count: featureCount } = useTypedSelector(state => state.tariff.plan[featureId]);
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