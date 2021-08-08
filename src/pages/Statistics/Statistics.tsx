import React, { useState } from 'react';

import Title from '../../components/Typography/Title/Title';
import Input from '../../components/Input/Input';
import DatePresets from '../../components/DatePresets/DatePresets';
import SimpleBarChart from '../../components/SimpleBarChart/SimpleBarChart';

import styles from './statistics.module.scss';

export default function Statistics() {
  const [selectedStaticticsChart, selectStaticticsChart] = useState<string>('appeals');
  const [datePeriod, setDatePeriod] = useState<string | { from: string, to: string }>('');

  const statisticsCharts = [
    {
      id: 'appeals',
      name: 'Обращения',
    },
    {
      id: 'teammates',
      name: 'Сотрудники',
    },
  ];

  const changeStaticticsChart = (e: any) => {
    selectStaticticsChart(e.target.value);
  };

  const updateDatePeriod = (date: string | { from: string, to: string }) => {
    console.log(date, '__DATE__');
    setDatePeriod(date);
  };

  return (
    <div className={styles.channelsContainer}>
      <Title level='1' weight='bold'>Статистика</Title>

      <div
        className={styles.tabsContainer}
        onChange={changeStaticticsChart}
      >
        {
          statisticsCharts.map(({id, name}) => {
            const isCheckedStatisticsChart = id === selectedStaticticsChart;

            return (
              <div
                key={id}
                className={`
                  ${styles.chartTab}
                  ${isCheckedStatisticsChart && styles.chartTabActive}
                `}
              >
                <Input
                  type='radio'
                  classNames={styles.statisticsChartRadioButton}
                  label={name}
                  name='chartTab'
                  value={id}
                  fluid
                  checked={isCheckedStatisticsChart}
                />
              </div>
            );
          })
        }
      </div>

      <div>
        <DatePresets
          onChange={updateDatePeriod}
        />
      </div>

      <SimpleBarChart />
    </div>
  );
}