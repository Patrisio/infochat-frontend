import { call, put, takeEvery, all, StrictEffect } from 'redux-saga/effects';
import { templateAdd, templateDelete, templateEdit, getTemplates } from '../api/dataLayer';

function* fetchTemplates(action: any): Generator<StrictEffect> {
  try {
    const data: any = yield call(getTemplates, action.payload);

    yield put({
      type: 'TEMPLATES_ADD',
      templates: data.templates
    });
  } catch (e) {
    yield put({
      type: 'TEMPLATES_FETCH_FAILED',
      message: e.message
    });
  }
}

function* addTemplate(action: any): Generator<StrictEffect> {
  try {
    const { id, name, message } = action.template;

    yield call(templateAdd, { id, name, message, projectId: action.projectId });
  } catch (e) {
    yield put({
      type: 'TEMPLATE_ADD_FAILED',
      message: e.message
    });
  }
}

function* editTemplate(action: any): Generator<StrictEffect> {
  try {
    const { id, name, message } = action.template;
    yield call(templateEdit, { id, name, message, projectId: action.projectId });
  } catch (e) {
    yield put({
      type: 'TEMPLATE_EDIT_FAILED',
      message: e.message
    });
  }
}

function* deleteTemplate(action: any): Generator<StrictEffect> {
  try {
    const { templateId, projectId } = action;
    yield call(templateDelete, { templateId, projectId });
  } catch (e) {
    yield put({
      type: 'DELETE_TEMPLATE_FAILED',
      message: e.message
    });
  }
}

function* watchFetchTemplates(): Generator<StrictEffect> {
  yield takeEvery('TEMPLATES_FETCH', fetchTemplates);
}

function* watchAddTemplate(): Generator<StrictEffect> {
  yield takeEvery('TEMPLATE_ADD', addTemplate);
}

function* watchDeleteTemplate(): Generator<StrictEffect> {
  yield takeEvery('TEMPLATE_DELETE', deleteTemplate);
}

function* watchEditTemplate(): Generator<StrictEffect> {
  yield takeEvery('TEMPLATE_EDIT', editTemplate);
}

export default [
  watchFetchTemplates(),
  watchAddTemplate(),
  watchDeleteTemplate(),
  watchEditTemplate(),
];