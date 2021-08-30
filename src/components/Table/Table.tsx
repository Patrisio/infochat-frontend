import React from 'react';
import Row from './components/Row';
import styles from './table.module.scss';

interface Props {
  data: any,
  columns: any,
}

export default function Table({ columns, data}: Props) {
  const hasVisibleHeaderCells = () => columns.filter((column: any) => column.visible).length > 0;

  return (
    <div className={styles.gridContainer}>
      {
        hasVisibleHeaderCells() &&
        <div className={styles.header}>
          {
            columns.map((column: any, idx: number) => {
              return (
                <div
                  key={idx}
                >
                  {column.headerComponent && column.headerComponent()}
                </div>
              );
            })
          }
        </div>
      }

      {data.map((row: any, idx: number) => {
        return (
          <Row
            key={idx}
            row={row}
            columns={columns}
          />
        );
      })}
    </div>
  );
}