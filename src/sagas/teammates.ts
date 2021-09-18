import { call, put, takeEvery, StrictEffect } from 'redux-saga/effects';
import { getTeammates, teammateAdd, sendEmail, removeTeammate, teammateUpdate } from '../api/dataLayer';
import { TeammatesActionTypes, TeammatesAction } from '../types/teammates';

function* fetchTeammates(action: TeammatesAction): Generator<StrictEffect> {
  try {
    const user = yield call(getTeammates, action.payload);
    yield put({
      type: TeammatesActionTypes.TEAMMATES_ADD,
      payload: user
    });
  } catch (e) {
    yield put({
      type: 'TEAMMATES_ADD_FAILED',
      message: e.message
    });
  }
}

function* addTeammate(action: TeammatesAction): Generator<StrictEffect> {
  try {
    const { errorCallback, ...teammateData } = action.payload;

    const response: any = yield call(teammateAdd, { ...teammateData, errorCallback });

    if (response.statusCode !== 409) {
      yield put({
        type: TeammatesActionTypes.TEAMMATE_ADD,
        payload: teammateData,
      });
      yield call(sendEmail, {
        email: teammateData.email,
        projectId: teammateData.projectId,
      });
    }
  } catch (e) {
    yield put({
      type: 'TEAMMATE_ADD_FAILED',
      message: e.message
    });
  }
}

function* deleteTeammate(action: TeammatesAction): Generator<StrictEffect> {
  try {
    yield call(removeTeammate, action.payload);
  } catch (e) {
    yield put({
      type: 'DELETE_TEAMMATE_FAILED',
      message: e.message
    });
  }
}

function* updateTeammate(action: TeammatesAction): Generator<StrictEffect> {
  try {
    yield call(teammateUpdate, action.payload);
  } catch (e) {
    yield put({
      type: 'UPDATE_TEAMMATE_FAILED',
      message: e.message
    });
  }
}

function* watchFetchTeammates(): Generator<StrictEffect> {
  yield takeEvery(TeammatesActionTypes.TEAMMATE_FETCH, fetchTeammates);
}

function* watchAddTeammate(): Generator<StrictEffect> {
  yield takeEvery(TeammatesActionTypes.TEAMMATE_ADD_SAGA, addTeammate);
}

function* watchDeleteTeammate(): Generator<StrictEffect> {
  yield takeEvery(TeammatesActionTypes.TEAMMATE_DELETE, deleteTeammate);
}

function* watchUpdateTeammate(): Generator<StrictEffect> {
  yield takeEvery(TeammatesActionTypes.TEAMMATE_UPDATE, updateTeammate);
}

export default [
  watchFetchTeammates(),
  watchAddTeammate(),
  watchDeleteTeammate(),
  watchUpdateTeammate(),
];