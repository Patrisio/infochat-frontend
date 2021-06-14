import { call, put, takeEvery, StrictEffect } from 'redux-saga/effects';
import { tariffPlanFetch, tariffPlanUpdate } from '../api/dataLayer';

function* fetchTariffPlan(action: any): Generator<StrictEffect> {
  const { projectId } = action.payload;

  try {
    const tariffPlan: any = yield call(tariffPlanFetch, projectId);
    yield put({
      type: 'TARIFF_UPDATE',
      payload: tariffPlan.tariffPlan,
    });
  } catch (e) {
    yield put({
      type: 'TARIFF_FETCH_PLAN_FAILED',
      message: e.message
    });
  }
}

function* saveTariffPlan(action: any): Generator<StrictEffect> {
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
  yield takeEvery('TARIFF_FETCH_PLAN', fetchTariffPlan);
}

function* watchSaveTariffPlan(): Generator<StrictEffect> {
  yield takeEvery('TARIFF_SAVE_PLAN', saveTariffPlan);
}

export default [
  watchFetchTariffPlan(),
  watchSaveTariffPlan(),
];