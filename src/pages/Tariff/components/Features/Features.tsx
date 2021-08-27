import React from 'react';

import FeatureCard from '../FeatureCard/FeatureCard';

import { useTypedSelector } from '../../../../hooks/useTypedSelector';

import { Feature } from '../../constants';
import styles from './features.module.scss';

export default function Features() {
  const { plan: tariffPlan } = useTypedSelector(state => state.tariff);

  const features = Object.entries(tariffPlan).map((feature: any) => {
    return {
      id: feature[0],
      ...feature[1],
    };
  })

  return (
    <div className={styles.featuresContainer}>
      {
        features.map((feature: Feature, idx: number) => {
          return (
            <FeatureCard
              key={idx}
              {...feature}
            />
          );
        })
      }
    </div>
  );
}