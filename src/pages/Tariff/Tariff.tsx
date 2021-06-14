import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router';

import Title from '../../components/Typography/Title/Title';
import Periods from './components/Periods/Periods';
import Features from './components/Features/Features';
import TotalTariffPlan from './components/TotalTariffPlan/TotalTariffPlan';

import { fetchTariffPlan } from '../../actions';
import styles from './tariff.module.scss';

export default function Tariff() {
  const { projectId } = useParams<{ projectId: string }>();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchTariffPlan({ projectId }));
  }, []);

  return (
    <div className={styles.tariffContainer}>
      <Title level='1' weight='bold'>Конфигуратор тарифа</Title>
      <Title level='3' weight='regular'>Соберите свой тариф и платите только за то, что вам нужно</Title>

      <Periods />

      <div className={styles.featuresContainer}>
        <Features />
        <TotalTariffPlan />
      </div>
    </div>
  );
}