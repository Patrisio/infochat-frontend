import React from 'react';
import { useSelector } from 'react-redux';

import Title from '../../../../components/Typography/Title/Title';
import FeatureCard from '../FeatureCard/FeatureCard';

import { Feature } from '../../constants';
import styles from './features.module.scss';

export default function Features() {
  const tariffPlan = useSelector((state: any) => state.tariff.plan);
  
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