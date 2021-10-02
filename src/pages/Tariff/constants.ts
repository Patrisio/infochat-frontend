import { ONE_MONTH, THREE_MONTHS, SIX_MONTHS, YEAR } from 'lib/utils/date';

export interface Period {
  id: number,
  name: string,
}

export interface Feature {
  imageSrc: string,
  id: string,
  name: string,
  description: string,
  category: 'binary' | 'multiple',
  price: number,
}

export const periods: Period[] = [
  {
    id: ONE_MONTH,
    name: 'Месяц',
  },
  {
    id: THREE_MONTHS,
    name: '3 месяца',
  },
  {
    id: SIX_MONTHS,
    name: '6 месяцев',
  },
  {
    id: YEAR,
    name: 'Год',
  },
];