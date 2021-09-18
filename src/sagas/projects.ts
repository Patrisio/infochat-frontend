import { call, put, takeEvery, StrictEffect } from 'redux-saga/effects';
import { projectAdd } from '../api/dataLayer';
import { ProjectsAction, ProjectsActionTypes } from '../types/projects';

function* addProject(action: ProjectsAction): Generator<StrictEffect> {
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
  yield takeEvery(ProjectsActionTypes.PROJECT_ADD, addProject);
}

export default [
  watchAddProject(),
];