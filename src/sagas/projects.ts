import { call, put, takeEvery, StrictEffect } from 'redux-saga/effects';
import { projectAdd } from '../api/dataLayer';

function* addProject(action: any): Generator<StrictEffect> {
  try {
    yield call(projectAdd, action.payload);
  } catch (e) {
    yield put({
      type: 'PROJECT_ADD_FAILED',
      message: e.message
    });
  }
}
function* watchAddProject(): Generator<StrictEffect> {
  yield takeEvery('PROJECT_ADD', addProject);
}

export default [
  watchAddProject(),
];