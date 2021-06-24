import { call, put, takeEvery, all, StrictEffect } from 'redux-saga/effects';
import { getClientInfo } from '../actions';
import {
  getTeammates, incomingMessagesFetch,
  selectedClientUpdate, messageToInboxAdd, selectedClientInfoGet,
  messagesStatusUpdate, noteAdd, noteDelete
} from '../api/dataLayer';

function* fetchIncomingMessages(action: any): Generator<StrictEffect> {
  try {
    const successCallback = action.incomingMessage.successCallback;
    const incomingMessage = yield call(incomingMessagesFetch, action.incomingMessage);

    if (successCallback) {
      successCallback(incomingMessage);
    }

    yield put({
      type: 'ADD_INCOMING_MESSAGES',
      incomingMessage,
    });
  } catch (e) {
    yield put({
      type: 'INCOMING_MESSAGES_FETCH_FAILED',
      message: e.message,
    });
  }
}

function* changeMessagesStatus(action: any): Generator<StrictEffect> {
  try {
    const { clientId, messagesStatus, assignedTo } = action.payload;
    const successCallback = action.payload.successCallback;

    yield call(messagesStatusUpdate, action.payload);
    yield put({
      type: 'UPDATE_INCOMING_MESSAGE',
      payload: {
        clientId,
        messagesStatus,
        assignedTo,
      }
    });
    yield put({
      type: 'SELECTED_CLIENT_UPDATE',
      payload: { assignedTo },
    });

    if (successCallback) {
      yield successCallback();
    }
  } catch (e) {
    yield put({
      type: 'UPDATE_ASSIGNED_USER_FAILED',
      message: e.message,
    });
  }
}

function* updateSelectedClient(action: any): Generator<StrictEffect> {
  try {
    const successCallback = action.payload.successCallback;

    yield call(selectedClientUpdate, action.payload);
    if (successCallback) {
      yield successCallback();
    }
  } catch (e) {
    yield put({
      type: 'UPDATE_SELECTED_CLIENT_USER_FAILED',
      message: e.message,
    });
  }
}

function* addMessageToInbox(action: any): Generator<StrictEffect> {
  try {
    const successCallback = action.payload.successCallback;

    yield call(messageToInboxAdd, action.payload);

    if (successCallback) {
      yield successCallback();
    }
  } catch (e) {
    yield put({
      type: 'ADD_TO_INBOX_INCOMING_MESSAGES_FAILED',
      message: e.message,
    });
  }
}

function* getSelectedClientInfo(action: any): Generator<StrictEffect> {
  try {
    const successCallback = action.payload.successCallback;
    const clientInfo = yield call(selectedClientInfoGet, action.payload);

    if (successCallback) {
      yield successCallback(clientInfo);
    }
  } catch (e) {
    yield put({
      type: 'GET_SELECTED_CLIENT_INFO_FAILED',
      message: e.message,
    });
  }
}

function* addNote(action: any): Generator<StrictEffect> {
  try {
    console.log(action.payload);
    yield call(noteAdd, action.payload);
  } catch (e) {
    yield put({
      type: 'ADD_NOTE_FAILED',
      message: e.message,
    });
  }
}

function* deleteNote(action: any): Generator<StrictEffect> {
  try {
    console.log(action.payload);
    yield call(noteDelete, action.payload);
  } catch (e) {
    yield put({
      type: 'DELETE_NOTE_FAILED',
      message: e.message,
    });
  }
}

function* watchFetchMessagesHistoryByProject(): Generator<StrictEffect> {
  yield takeEvery('FETCH_INCOMING_MESSAGES', fetchIncomingMessages);
}

function* watchUpdateSelectedClient(): Generator<StrictEffect> {
  yield takeEvery('CLIENT_DATA_UPDATE', updateSelectedClient);
}

function* watchAddMessageToInbox(): Generator<StrictEffect> {
  yield takeEvery('ADD_TO_INBOX_INCOMING_MESSAGE', addMessageToInbox);
}

function* watchGetInfoForSelectedClient(): Generator<StrictEffect> {
  yield takeEvery('SELECTED_CLIENT_GET_INFO', getSelectedClientInfo);
}

function* watchUpdateMessagesStatus(): Generator<StrictEffect> {
  yield takeEvery('CHANGE_MESSAGES_STATUS', changeMessagesStatus);
}

function* watchAddNote(): Generator<StrictEffect> {
  yield takeEvery('ADD_NOTE', addNote);
}

function* watchDeleteNote(): Generator<StrictEffect> {
  yield takeEvery('DELETE_NOTE', deleteNote);
}

export default [
  watchFetchMessagesHistoryByProject(),,
  watchUpdateSelectedClient(),
  watchAddMessageToInbox(),
  watchGetInfoForSelectedClient(),
  watchUpdateMessagesStatus(),
  watchAddNote(),
  watchDeleteNote(),
];