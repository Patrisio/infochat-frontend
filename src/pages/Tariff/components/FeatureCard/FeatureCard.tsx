import React, { useState } from 'react';

import Title from 'ui/Typography/Title/Title';
import Button from 'ui/Button/Button';
import Counter from '../Counter/Counter';

import { useActions } from 'hooks/useActions';
import { useTypedSelector } from 'hooks/useTypedSelector';

import { Feature } from '../../constants';
import styles from './featureCard.module.scss';

export default function FeatureCard({ imageSrc, id, name, description, category, price }: Feature) {
  const { count: featureCount } = useTypedSelector(state => state.tariff.plan[id]);
  const { updateTariffPlan } = useActions();

  const updateCount = () => {
    if (featureCount) {
      updateTariffPlan({
        featureId: id,
        count: 0,
      });
      return;
    }

    updateTariffPlan({
      featureId: id,
      count: 1,
    });
  };

  return (
    <div
      className={styles.featureCardContainer}
    >
      <div className={styles.imageContainer}>
        <img
          src={imageSrc}
          alt={id}
        />
      </div>

      <Title level='3' weight='semibold' classNames={styles.featureCardTitle}>{ name }</Title>
      <p className={styles.description}>{description}</p>

      <div className={styles.categoryContainer}>
        {
          category === 'multiple' ?
          <Counter
            featureId={id}
          /> :
          <Button
            type='button'
            classNames={`
              ${styles.featureCountBtn}
              ${featureCount ? styles.featureCountDeleteBtn : styles.featureCountAddBtn}
            `}
            onClick={updateCount}
          >
            { featureCount ? 'Удалить' : 'Добавить' }
          </Button> 
        }

        <div className={styles.price}>
          { price === 0 ? 'Бесплатно' : `${price} ₽/мес` }
        </div>
      </div>
    </div>
  );
}