import { call, put, takeEvery, StrictEffect } from 'redux-saga/effects';
import { getTeammates, teammateAdd, sendEmail, removeTeammate, teammateUpdate } from 'api/dataLayer';
import {
  TeammatesActionTypes, fetchTeammatesAction, deleteTeammateAction,
  updateTeammateAction, addTeammateAction,
} from 'types/teammates';

function* fetchTeammates({ payload }: fetchTeammatesAction): Generator<StrictEffect> {
  try {
    const user = yield call(getTeammates, payload);
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

function* addTeammate({ payload }: addTeammateAction): Generator<StrictEffect> {
  try {
    const { errorCallback, ...teammateData } = payload;

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

function* deleteTeammate({ payload }: deleteTeammateAction): Generator<StrictEffect> {
  try {
    yield call(removeTeammate, payload);
  } catch (e) {
    yield put({
      type: 'DELETE_TEAMMATE_FAILED',
      message: e.message
    });
  }
}

function* updateTeammate({ payload }: updateTeammateAction): Generator<StrictEffect> {
  try {
    yield call(teammateUpdate, payload);
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