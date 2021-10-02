import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';

import styles from './panel.module.scss';

interface PanelProps {
  count: number | undefined | null,
  title: string,
  content: React.ReactElement,
}

export default function Panel({ title, count, content }: PanelProps) {
  const [isOpened, toggleOpen] = useState<boolean>(true);

  return (
    <div className={styles.accordion}>
      <div
        onClick={() => toggleOpen(prev => !prev)}
        className={styles.accordionHeader}
      >
        <div className={styles.accordionTitle}>
          <div className={styles.notesHeaderTitle}>
            <div className={styles.accordionHeaderContent}>
              <div className={`
                ${styles.arrowIconRight}
                ${isOpened && styles.arrowIconDown}
              `}>
                <FontAwesomeIcon
                  icon={faChevronRight}
                  color='$black-1'
                  size='sm'
                />
              </div>
              <span className={styles.notesHeaderTitleName}>
                { title }
              </span>
              {
                Boolean(count && count > 0) &&
                <span className={styles.notesCount}>
                  { `(${count})` }
                </span>
              }
            </div>
          </div>
        </div>
      </div>

      {
        isOpened &&
        <div className={styles.accordionBody}>
          { content }
        </div>
      }
    </div>
  );
}