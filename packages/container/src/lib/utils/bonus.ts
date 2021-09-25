import { ONE_MONTH, THREE_MONTHS, SIX_MONTHS, YEAR } from './date';

interface Bonus {
  [key: number]: 0 | 10 | 15 | 25,
}

export const bonus: Bonus = {
  [ONE_MONTH]: 0,
  [THREE_MONTHS]: 10,
  [SIX_MONTHS]: 15,
  [YEAR]: 25,
};