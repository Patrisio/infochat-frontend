import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

import styles from './tabs.module.scss';

interface Tab {
  icon?: string,
  value: string | '' |  null,
}

interface Props {
  data: any,
  removeTab: (tab: any) => void,
}

export default function Tabs({ data, removeTab }: Props) {
  return (
    <div className={styles.assignedTeammatesList}>
      {
        data.map((tab: Tab, idx: number) => {
          return (
            <div
              key={idx}
              className={styles.assignedTeammate}
            >
              <p className={styles.teammateName}>{tab.value}</p>
              <div
                onClick={() => removeTab(tab)}
                className={styles.removeIcon}
              >
                <FontAwesomeIcon icon={faTimes} color='#cac9c9' />
              </div>
            </div> 
          );
        })
      }
    </div>
  );
}