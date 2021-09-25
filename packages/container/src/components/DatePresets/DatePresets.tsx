import React, { useState } from 'react';

import Input from '../../components/Input/Input';

import styles from './datePresets.module.scss';
import {
  datePresets, getMomentDate, formatDateToCustomDate,
  getYesterday, getWeekPeriod, getMonthPeriod
} from '../../lib/utils/date';

interface DatePresetsProps {
  onChange: (date: string | { from: string, to: string }) => void,
}

export default function DatePresets({ onChange }: DatePresetsProps) {
  const [selectedDate, selectDate] = useState('today');

  const getDateValue = (dateId: string) => {
    switch (dateId) {
      case 'today':
        return formatDateToCustomDate(getMomentDate(), 'DD-MM-YYYY');
      case 'yesterday':
        return formatDateToCustomDate(getYesterday(), 'DD-MM-YYYY');
      case 'week':
        return {
          from: formatDateToCustomDate(getWeekPeriod(), 'DD-MM-YYYY'),
          to: formatDateToCustomDate(getMomentDate(), 'DD-MM-YYYY'),
        };
      case 'month':
        return {
          from: formatDateToCustomDate(getMonthPeriod(), 'DD-MM-YYYY'),
          to: formatDateToCustomDate(getMomentDate(), 'DD-MM-YYYY'),
        };
      case 'all':
        return {
          from: formatDateToCustomDate(getMonthPeriod(), 'DD-MM-YYYY'),
          to: formatDateToCustomDate(getMomentDate(), 'DD-MM-YYYY'),
        };
      default:
        return formatDateToCustomDate(getMomentDate(), 'DD-MM-YYYY');
    }
  };

  const changeDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDateId = e.target.value;
    selectDate(selectedDateId);
    const date = getDateValue(selectedDateId);
    onChange(date);
  };

  return (
    <div
      className={styles.datePresetsContainer}
      onChange={changeDate}
    >
      {
        datePresets.map(({ id, name }) => {
          const isCheckedDate = id === selectedDate;

          return (
            <div
              key={id}
              className={`
                ${styles.dateTab}
                ${isCheckedDate && styles.dateTabActive}
              `}
            >
              <Input
                type='radio'
                classNames={styles.dateRadioButton}
                label={name}
                name='dateTab'
                value={id}
                fluid
                checked={isCheckedDate}
              />
            </div>
          );
        })
      }
    </div>
  );
}