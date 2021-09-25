import { call, put, takeEvery, all, StrictEffect } from 'redux-saga/effects';
import { getChannels, channelAdd, chatSettingsSave, chatSettingsFetch } from '../api/dataLayer';
import { ChannelsActionTypes, ChannelsAction } from '../types/channels';

function* fetchChannels(action: ChannelsAction): Generator<StrictEffect> {
  try {
    yield put({
      type: ChannelsActionTypes.TOGGLE_FETCHING_CHANNELS,
    });
    const response: any = yield call(getChannels, action.payload);
    yield put({
      type: ChannelsActionTypes.ADD_CHANNELS,
      payload: response.data,
    });
    yield put({
      type: ChannelsActionTypes.TOGGLE_FETCHING_CHANNELS,
    });
  } catch (e) {
    yield put({
      type: 'USER_FETCH_FAILED',
      message: e.message,
    });
  }
}

function* addChannel(action: ChannelsAction): Generator<StrictEffect> {
  try {
    yield call(channelAdd, action.payload);
  } catch (e) {
    yield put({
      type: 'USER_FETCH_FAILED',
      message: e.message,
    });
  }
}

function* saveChatSettings(action: ChannelsAction): Generator<StrictEffect> {
  try {
    yield call(chatSettingsSave, action.payload);
  } catch (e) {
    yield put({
      type: 'USER_FETCH_FAILED',
      message: e.message,
    });
  }
}

function* fetchChatSettings(action: ChannelsAction): Generator<StrictEffect> {
  try {
    const chatSettings = yield call(chatSettingsFetch, action.payload);

    yield put({
      type: ChannelsActionTypes.UPDATE_SETTINGS,
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
  yield takeEvery(ChannelsActionTypes.FETCH_CHANNELS, fetchChannels);
}

function* watchAddChannel(): Generator<StrictEffect> {
  yield takeEvery(ChannelsActionTypes.ADD_CHANNEL, addChannel);
}

function* watchChatSaveSettings(): Generator<StrictEffect> {
  yield takeEvery(ChannelsActionTypes.SAVE_CHAT_SETTINGS, saveChatSettings);
}

function* watchFetchChatSettings(): Generator<StrictEffect> {
  yield takeEvery(ChannelsActionTypes.FETCH_CHAT_SETTINGS, fetchChatSettings);
}

export default [
  watchFetchChannels(),
  watchAddChannel(),
  watchChatSaveSettings(),
  watchFetchChatSettings(),
];