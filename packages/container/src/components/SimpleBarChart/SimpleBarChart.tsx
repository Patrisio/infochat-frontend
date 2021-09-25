import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

import styles from './simpleBarChart.module.scss';

interface DataItem {
  date: string,
  appealsCount: number,
}

export default function SimpleBarChart() {
  const chartWrapper = useRef<HTMLDivElement>(null);

  const data: DataItem[] = [
    {
      date: '1',
      appealsCount: 4,
    },
    {
      date: '2',
      appealsCount: 7,
    },
    {
      date: '3',
      appealsCount: 32,
    },
    {
      date: '4',
      appealsCount: 10,
    },
    {
      date: '5',
      appealsCount: 25,
    },
    {
      date: '6',
      appealsCount: 12,
    },
  ];

  let chart: any;

  const renderChart = () => {
    chart = d3.select(chartWrapper.current)
      .append('svg')
      .attr('width', 300)
      .attr('height', 200)
      .append('g');
  };

  const renderBars = () => {
    const xAxisGroup = chart.append('g')
                        .attr('transform', `translate(0 , 200)`);
    const yAxisGroup = chart.append('g');

    const x = d3.scaleBand()
                .domain(data.map(item => item.date))
                .range([0, 300]);

    const max = d3.max(data, d => d.appealsCount);
    const y = d3.scaleLinear()
                .domain([0, 32])
                .range([0, 200]);

    chart.data(data)
        .enter()
        .append('rect')
        .attr('width', x.bandwidth)
        .attr('height', (d: any, i: any) => 200 - y(d.appealsCount))
        .attr('x', (d: any, i: any) => x(d.fill))
        .attr('y', (d: any, i: any) => y(d.height));

    const xAxis = d3.axisBottom(x);
    const yAxis = d3.axisLeft(y);

    xAxisGroup.call(xAxis);
    yAxisGroup.call(yAxis);
  };

  useEffect(() => {
    renderChart();
    renderBars();
  }, []);

  return (
    <div
      className={styles.chart}
      ref={chartWrapper}
    />
  );
}