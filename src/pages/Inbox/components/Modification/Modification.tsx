import React from 'react';

import styles from './modification.module.scss';
import { formatDateToCustomDate } from 'lib/utils/date';
import { ModificationInterface } from 'types/inbox';

export default function Modification({ before, after, changeInFieldValue, timestamp }: ModificationInterface) {
  return (
    <div className={styles.modificationContainer}>
      <div className={styles.changeInFieldValue}>
        {`Изменения внесены в ${changeInFieldValue}`}
      </div>

      <div>
        <div className={styles.changeField}>
          <span className={styles.label}>До:</span>
          <span className={styles.labelAfter}>{before}</span>
        </div>

        <div className={styles.changeField}>
          <span className={styles.label}>После:</span>
          <span className={styles.labelAfter}>{after}</span>
        </div>
      </div>

      <span className={styles.date}>{formatDateToCustomDate(timestamp, 'DD.MM.YYYY')}</span>
    </div>
  );
}