import { TariffActionTypes, TariffAction } from '../../types/tariff';
import { TariffPlanUpdatePayload, TariffPlanFetchPayload } from 'api/types';
import { TariffPeriod } from '../../types/tariff';

export const updateTariffPlan = (payload: Partial<TariffPlanUpdatePayload>): TariffAction => ({
  type: TariffActionTypes.TARIFF_UPDATE,
  payload,
});

export const updateTariffPeriod = (payload: TariffPeriod): TariffAction => ({
  type: TariffActionTypes.TARIFF_PERIOD_UPDATE,
  payload,
});

export const fetchTariffPlan = (payload: TariffPlanFetchPayload): TariffAction => ({
  type: TariffActionTypes.TARIFF_FETCH_PLAN,
  payload,
});

export const saveTariffPlan = (payload: Partial<TariffPlanUpdatePayload>): TariffAction => ({
  type: TariffActionTypes.TARIFF_SAVE_PLAN,
  payload,
});