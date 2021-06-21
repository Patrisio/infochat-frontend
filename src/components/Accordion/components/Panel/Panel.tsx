import React, { useState } from 'react';

import styles from './panel.module.scss';

interface PanelProps {
  count: number | undefined | null,
  title: string,
  content: React.ReactElement,
}

export default function Panel({ title, count, content }: PanelProps) {
  const [isOpened, toggleOpen] = useState(true);

  return (
    <div className={styles.accordion}>
      <div
        onClick={() => toggleOpen(prev => !prev)}
        className={styles.accordionHeader}
      >
        <p className={styles.accordionTitle}>
          <div className={styles.notesHeaderTitle}>
            <div>
              <span className={styles.notesHeaderTitleName}>
                {title}
              </span>
              {
                Boolean(count && count > 0) &&
                <span className={styles.notesCount}>
                  {`(${count})`}
                </span>
              }
            </div>
          </div>
        </p>
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