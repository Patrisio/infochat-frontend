import { call, put, takeEvery, StrictEffect } from 'redux-saga/effects';
import { templateAdd, templateDelete, templateEdit, getTemplates } from '../api/dataLayer';
import { TemplatesActionTypes, TemplatesAction } from '../types/templates';

function* fetchTemplates(action: TemplatesAction): Generator<StrictEffect> {
  try {
    const data: any = yield call(getTemplates, action.payload);

    yield put({
      type: TemplatesActionTypes.TEMPLATES_ADD,
      payload: data.templates
    });
  } catch (e) {
    yield put({
      type: 'TEMPLATES_FETCH_FAILED',
      message: e.message
    });
  }
}

function* addTemplate(action: TemplatesAction): Generator<StrictEffect> {
  try {
    const { id, name, message, projectId } = action.payload;
    yield call(templateAdd, { id, name, message, projectId });
  } catch (e) {
    yield put({
      type: 'TEMPLATE_ADD_FAILED',
      message: e.message
    });
  }
}

function* editTemplate(action: TemplatesAction): Generator<StrictEffect> {
  try {
    const { id, name, message, projectId } = action.payload;
    yield call(templateEdit, { id, name, message, projectId });
  } catch (e) {
    yield put({
      type: 'TEMPLATE_EDIT_FAILED',
      message: e.message
    });
  }
}

function* deleteTemplate(action: TemplatesAction): Generator<StrictEffect> {
  try {
    const { templateId, projectId } = action.payload;
    yield call(templateDelete, { templateId, projectId });
  } catch (e) {
    yield put({
      type: 'DELETE_TEMPLATE_FAILED',
      message: e.message
    });
  }
}

function* watchFetchTemplates(): Generator<StrictEffect> {
  yield takeEvery(TemplatesActionTypes.TEMPLATES_FETCH, fetchTemplates);
}

function* watchAddTemplate(): Generator<StrictEffect> {
  yield takeEvery(TemplatesActionTypes.TEMPLATE_ADD, addTemplate);
}

function* watchDeleteTemplate(): Generator<StrictEffect> {
  yield takeEvery(TemplatesActionTypes.TEMPLATE_DELETE, deleteTemplate);
}

function* watchEditTemplate(): Generator<StrictEffect> {
  yield takeEvery(TemplatesActionTypes.TEMPLATE_EDIT, editTemplate);
}

export default [
  watchFetchTemplates(),
  watchAddTemplate(),
  watchDeleteTemplate(),
  watchEditTemplate(),
];