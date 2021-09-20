import { TariffPlanUpdatePayload, TariffPlanFetchPayload } from '../api/types';

interface Plan {
  [key: string]: {
    imageSrc: string,
    name: string,
    description: string,
    count: number,
    price: number,
    category: 'binary' | 'multiple',
  } 
}

export interface TariffState {
  period: number,
  plan: Plan,
}

export type TariffPeriod = Omit<TariffState, 'plan'>;

export enum TariffActionTypes {
  TARIFF_UPDATE = 'TARIFF_PLAN_UPDATE',
  TARIFF_PERIOD_UPDATE = 'TARIFF_PERIOD_UPDATE',
  TARIFF_FETCH_PLAN = 'TARIFF_FETCH_PLAN',
  TARIFF_SAVE_PLAN = 'TARIFF_SAVE_PLAN',
}

interface updateTariffPlanAction {
  type: TariffActionTypes.TARIFF_UPDATE,
  payload: Partial<TariffPlanUpdatePayload>,
}

interface updateTariffPeriodAction {
  type: TariffActionTypes.TARIFF_PERIOD_UPDATE,
  payload: any,
}

interface fetchTariffPlan {
  type: TariffActionTypes.TARIFF_FETCH_PLAN,
  payload: TariffPlanFetchPayload,
}

interface updateTariffPeriodAction {
  type: TariffActionTypes.TARIFF_PERIOD_UPDATE,
  payload: any,
}

interface saveTariffPlan {
  type: TariffActionTypes.TARIFF_SAVE_PLAN,
  payload: Partial<TariffPlanUpdatePayload>,
}

export type TariffAction =
  updateTariffPlanAction
  | updateTariffPeriodAction
  | fetchTariffPlan
  | saveTariffPlan