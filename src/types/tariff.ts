interface Plan {
  [key: string]: {
    name: string,
    count: number,
    price: number,
    category: 'binary' | 'multiple',
  } 
}

export interface TariffState {
  period: number,
  plan: Plan,
}

export enum TariffActionTypes {
  TARIFF_UPDATE = 'TARIFF_PLAN_UPDATE',
  TARIFF_PERIOD_UPDATE = 'TARIFF_PERIOD_UPDATE',
  TARIFF_FETCH_PLAN = 'TARIFF_FETCH_PLAN',
  TARIFF_SAVE_PLAN = 'TARIFF_SAVE_PLAN',
}

interface updateTariffPlanAction {
  type: TariffActionTypes.TARIFF_UPDATE,
  payload: any,
}

interface updateTariffPeriodAction {
  type: TariffActionTypes.TARIFF_PERIOD_UPDATE,
  payload: any,
}

interface fetchTariffPlan {
  type: TariffActionTypes.TARIFF_FETCH_PLAN,
  payload: any,
}

interface updateTariffPeriodAction {
  type: TariffActionTypes.TARIFF_PERIOD_UPDATE,
  payload: any,
}

interface saveTariffPlan {
  type: TariffActionTypes.TARIFF_SAVE_PLAN,
  payload: any,
}

export type TariffAction =
  updateTariffPlanAction
  | updateTariffPeriodAction
  | fetchTariffPlan
  | saveTariffPlan