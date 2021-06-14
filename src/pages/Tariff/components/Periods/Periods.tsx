import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Input from '../../../../components/Input/Input';

import { updateTariffPeriod } from '../../../../actions';
import { periods, Period, bonus } from '../../constants';
import styles from './periods.module.scss';

export default function Periods() {
  const tariffPeriod = useSelector((state: any) => state.tariff.period);
  const dispatch = useDispatch();

  const changePeriod = (e: any) => {
    dispatch(updateTariffPeriod({ period: Number(e.target.value) }));
  };

  return (
    <div className={styles.periodsContainer}>
      <span className={styles.periodsText}>Оплата за:</span>

      {
        periods.map((period: Period) => {
          const isCheckedPeriod = tariffPeriod === period.id;

          const getPeriodLabel = () => {
            return bonus[period.id] === 0 ?
              `<span class=${isCheckedPeriod ? styles.bonusTextNonActive : styles.bonusText}>${period.name}</span>` :
              `
              <span class=${isCheckedPeriod ? styles.bonusTextNonActive : styles.bonusText}>${period.name}</span>
              <span class=${isCheckedPeriod ? styles.bonusTextActive : styles.bonusTextNonActive}>+${bonus[period.id]}% на счет</span>
              `;
          };

          return (
            <div
              key={period.id}
              className={`
                ${styles.periodContainer}
                ${isCheckedPeriod && styles.periodRadioButtonActive}
              `}
            >
              <Input
                type='radio'
                classNames={styles.periodRadioButton}
                label={getPeriodLabel()}
                name='period'
                value={period.id}
                checked={isCheckedPeriod}
                onChange={changePeriod}
              />
            </div>
          );
        })
      }
    </div>
  );
}