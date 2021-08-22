import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Title from '../../../../components/Typography/Title/Title';
import Button from '../../../../components/Button/Button';
import Counter from '../../components/Counter/Counter';

import { updateTariffPlan } from '../../../../actions';
import { Feature } from '../../constants';
import styles from './featureCard.module.scss';

export default function FeatureCard({ imageSrc, id, name, description, category, price }: Feature) {
  const featureCount = useSelector((state: any) => state.tariff.plan[id].count);
  const dispatch = useDispatch();

  const updateCount = () => {
    if (featureCount) {
      dispatch(updateTariffPlan({
        featureId: id,
        count: 0,
      }));
      return;
    }

    dispatch(updateTariffPlan({
      featureId: id,
      count: 1,
    }));
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

      <Title level='3' weight='semibold' classNames={styles.featureCardTitle}>{name}</Title>
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