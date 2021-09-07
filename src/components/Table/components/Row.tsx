import React from 'react';
import styles from './row.module.scss';

interface RowData {
  row: any,
  columns: any
}

export default function Row({ row, columns }: RowData) {
  return (
    <div className={styles.gridRow}>
      {
        columns.map((column: any, idx: number) => {
          return (
            <div
              key={idx}
              className={styles.gridCell}
            >
              { column.cellComponent ? column.cellComponent(row) : row[column.key] }
            </div>
          )
        })
      }
    </div>
  );
};