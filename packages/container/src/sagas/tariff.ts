import { call, put, takeEvery, StrictEffect } from 'redux-saga/effects';
import { tariffPlanFetch, tariffPlanUpdate } from '../api/dataLayer';
import { TariffActionTypes, TariffAction } from '../types/tariff';

function* fetchTariffPlan(action: TariffAction): Generator<StrictEffect> {
  try {
    const tariffPlan: any = yield call(tariffPlanFetch, action.payload);
    yield put({
      type: TariffActionTypes.TARIFF_UPDATE,
      payload: tariffPlan.tariffPlan,
    });
  } catch (e) {
    yield put({
      type: 'TARIFF_FETCH_PLAN_FAILED',
      message: e.message
    });
  }
}

function* saveTariffPlan(action: TariffAction): Generator<StrictEffect> {
  try {
    yield call(tariffPlanUpdate, action.payload);
  } catch (e) {
    yield put({
      type: 'TARIFF_SAVE_PLAN_FAILED',
      message: e.message
    });
  }
}

function* watchFetchTariffPlan(): Generator<StrictEffect> {
  yield takeEvery(TariffActionTypes.TARIFF_FETCH_PLAN, fetchTariffPlan);
}

function* watchSaveTariffPlan(): Generator<StrictEffect> {
  yield takeEvery(TariffActionTypes.TARIFF_SAVE_PLAN, saveTariffPlan);
}

export default [
  watchFetchTariffPlan(),
  watchSaveTariffPlan(),
];