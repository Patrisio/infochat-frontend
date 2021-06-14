import operatorsTariff from '../../assets/operators-tariff.svg';
import chatTariff from '../../assets/chat-tariff.svg';
import templatesTariff from '../../assets/templates-tariff.svg';

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

interface Bonus {
  [key: number]: 0 | 10 | 15 | 25,
}

const ONE_MONTH = 1;
const THREE_MONTHS = 3;
const SIX_MONTHS = 6;
export const YEAR = 12;

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

export const bonus: Bonus = {
  [ONE_MONTH]: 0,
  [THREE_MONTHS]: 10,
  [SIX_MONTHS]: 15,
  [YEAR]: 25,
};