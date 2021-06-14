import React from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import Title from '../../components/Typography/Title/Title';

import { getSettingsFeatures, getBillingFeatures } from './constants';
import styles from './start.module.scss';

interface ILocationState {
  feature: string
}

export default function Start() {
  const location = useLocation<ILocationState>();
  const locationState = location.state;
  let { projectId } = useParams<{ projectId: string }>();

  const getFeatures = () => {
    switch (locationState && locationState.feature) {
      case 'settings':
        return getSettingsFeatures(projectId);
      case 'billing':
        return getBillingFeatures(projectId);
      default: 
        return getSettingsFeatures(projectId);
    }
  };

  return (
    <div className={styles.startContainer}>
      <Title level='1' weight='bold'>Настройки</Title>

      <div className={styles.startContent}>
        {
          getFeatures().map(({ imageSrc, alt, backgroundColor, title, description, linkText, linkHref }, idx) => {
            return (
              <Link
                key={idx}
                to={linkHref}
                className={styles.feature}
              >
                <div
                  className={styles.imageContainer}
                  style={{ background: backgroundColor}}
                >
                  <img src={imageSrc} alt={alt}/>
                </div>
                <div className={styles.content}>
                  <h3 className={styles.title}>{ title }</h3>
                  <p className={styles.description}>{ description }</p>
                  <Link
                    className={styles.link}
                    to={linkHref}
                  >
                    { linkText }
                  </Link>
                </div>
              </Link>
            );
          })
        }
      </div>
    </div>
  );
}