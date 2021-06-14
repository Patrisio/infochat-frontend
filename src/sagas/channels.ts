import { call, put, takeEvery, all, StrictEffect } from 'redux-saga/effects';
import { getChannels, channelAdd, chatSettingsSave, chatSettingsFetch } from '../api/dataLayer';

function* fetchChannels(action: any): Generator<StrictEffect> {
  try {
    console.log('__SAGA__');
    yield put({
      type: 'TOGGLE_FETCHING_CHANNELS',
    });
    const channels = yield call(getChannels, action.payload.projectId);
    yield put({
      type: 'ADD_CHANNELS',
      channels,
    });
    yield put({
      type: 'TOGGLE_FETCHING_CHANNELS',
    });
  } catch (e) {
    yield put({
      type: 'USER_FETCH_FAILED',
      message: e.message,
    });
  }
}

function* addChannel(action: any): Generator<StrictEffect> {
  try {
    yield call(channelAdd, action.payload);
  } catch (e) {
    yield put({
      type: 'USER_FETCH_FAILED',
      message: e.message,
    });
  }
}

function* saveChatSettings(action: any): Generator<StrictEffect> {
  try {
    console.log(action);
    yield call(chatSettingsSave, action.payload, action.projectId);
  } catch (e) {
    yield put({
      type: 'USER_FETCH_FAILED',
      message: e.message,
    });
  }
}

function* fetchChatSettings(action: any): Generator<StrictEffect> {
  try {
    const chatSettings = yield call(chatSettingsFetch, action.payload);

    yield put({
      type: 'UPDATE_SETTINGS',
      payload: chatSettings,
    });
  } catch (e) {
    yield put({
      type: 'FETCH_CHAT_SETTINGS_FAILED',
      message: e.message,
    });
  }
}

function* watchFetchChannels(): Generator<StrictEffect> {
  yield takeEvery('FETCH_CHANNELS', fetchChannels);
}

function* watchAddChannel(): Generator<StrictEffect> {
  yield takeEvery('ADD_CHANNEL', addChannel);
}

function* watchChatSaveSettings(): Generator<StrictEffect> {
  yield takeEvery('SAVE_CHAT_SETTINGS', saveChatSettings);
}

function* watchFetchChatSettings(): Generator<StrictEffect> {
  yield takeEvery('FETCH_CHAT_SETTINGS', fetchChatSettings);
}

export default [
  watchFetchChannels(),
  watchAddChannel(),
  watchChatSaveSettings(),
  watchFetchChatSettings(),
];