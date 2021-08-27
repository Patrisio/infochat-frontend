import { TariffActionTypes, TariffAction } from '../../types/tariff';

export const updateTariffPlan = (payload: any): TariffAction => ({
  type: TariffActionTypes.TARIFF_UPDATE,
  payload,
});

export const updateTariffPeriod = (payload: any): TariffAction => ({
  type: TariffActionTypes.TARIFF_PERIOD_UPDATE,
  payload,
});

export const fetchTariffPlan = (payload: any): TariffAction => ({
  type: TariffActionTypes.TARIFF_FETCH_PLAN,
  payload,
});

export const saveTariffPlan = (payload: any): TariffAction => ({
  type: TariffActionTypes.TARIFF_SAVE_PLAN,
  payload,
});