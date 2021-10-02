import { call, put, takeEvery, StrictEffect } from 'redux-saga/effects';
import {
  incomingMessagesFetch, clientAppealDelete,
  selectedClientUpdate, messageToInboxAdd, selectedClientInfoGet,
  messagesStatusUpdate, noteAdd, noteDelete, toSelectedTeammateRemapDialogs,
} from 'api/dataLayer';
import { InboxActionTypes, InboxAction } from '../types/inbox';

function* fetchIncomingMessages(action: InboxAction): Generator<StrictEffect> {
  try {
    const successCallback = action.payload.successCallback;
    yield put({ type: InboxActionTypes.INCOMING_MESSAGES_FETCHING });
    const incomingMessage = yield call(incomingMessagesFetch, action.payload);
    yield put({ type: InboxActionTypes.INCOMING_MESSAGES_FETCHING });

    if (successCallback) {
      successCallback(incomingMessage);
    }

    yield put({
      type: InboxActionTypes.INCOMING_MESSAGES_ADD,
      payload: incomingMessage,
    });
  } catch (e) {
    yield put({
      type: 'INCOMING_MESSAGES_FETCH_FAILED',
      message: e.message,
    });
  }
}

function* changeMessagesStatus(action: InboxAction): Generator<StrictEffect> {
  try {
    const { clientId, messagesStatus, assignedTo } = action.payload;
    const successCallback = action.payload.successCallback;

    yield call(messagesStatusUpdate, action.payload);
    yield put({
      type: InboxActionTypes.INCOMING_MESSAGES_UPDATE,
      payload: {
        clientId,
        messagesStatus,
        assignedTo,
      }
    });
    yield put({
      type: InboxActionTypes.SELECTED_CLIENT_UPDATE,
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

function* updateSelectedClient(action: InboxAction): Generator<StrictEffect> {
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

function* addMessageToInbox(action: InboxAction): Generator<StrictEffect> {
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

function* getSelectedClientInfo(action: InboxAction): Generator<StrictEffect> {
  try {
    const successCallback = action.payload.successCallback;
    yield put({ type: InboxActionTypes.FETCHING_SELECTED_CLIENT_INFO });
    const clientInfo = yield call(selectedClientInfoGet, action.payload);
    yield put({ type: InboxActionTypes.FETCHING_SELECTED_CLIENT_INFO });

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

function* addNote(action: InboxAction): Generator<StrictEffect> {
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

function* deleteNote(action: InboxAction): Generator<StrictEffect> {
  try {
    yield call(noteDelete, action.payload);
  } catch (e) {
    yield put({
      type: 'DELETE_NOTE_FAILED',
      message: e.message,
    });
  }
}

function* deleteClientAppealByClientId(action: InboxAction): Generator<StrictEffect> {
  try {
    console.log(action.payload);
    yield call(clientAppealDelete, action.payload);
  } catch (e) {
    yield put({
      type: 'DELETE_CLIENT_APPEAL_FAILED',
      message: e.message,
    });
  }
}

function* remapDialogsToSelectedTeammate(action: InboxAction): Generator<StrictEffect> {
  try {
    yield call(toSelectedTeammateRemapDialogs, action.payload);
  } catch (e) {
    yield put({
      type: 'REMAP_DIALOGS_TO_SELECTED_TEAMMATE_FAILED',
      message: e.message,
    });
  }
}

function* watchFetchMessagesHistoryByProject(): Generator<StrictEffect> {
  yield takeEvery(InboxActionTypes.INCOMING_MESSAGES_FETCH, fetchIncomingMessages);
}

function* watchUpdateSelectedClient(): Generator<StrictEffect> {
  yield takeEvery(InboxActionTypes.CLIENT_DATA_UPDATE, updateSelectedClient);
}

function* watchAddMessageToInbox(): Generator<StrictEffect> {
  yield takeEvery(InboxActionTypes.INCOMING_MESSAGES_ADD_TO_INBOX, addMessageToInbox);
}

function* watchGetInfoForSelectedClient(): Generator<StrictEffect> {
  yield takeEvery(InboxActionTypes.SELECTED_CLIENT_GET_INFO, getSelectedClientInfo);
}

function* watchUpdateMessagesStatus(): Generator<StrictEffect> {
  yield takeEvery(InboxActionTypes.CLIENT_DATA_CHANGE_MESSAGES_STATUS, changeMessagesStatus);
}

function* watchAddNote(): Generator<StrictEffect> {
  yield takeEvery(InboxActionTypes.NOTE_ADD, addNote);
}

function* watchDeleteNote(): Generator<StrictEffect> {
  yield takeEvery(InboxActionTypes.NOTE_DELETE, deleteNote);
}

function* watchDeleteClientAppeal(): Generator<StrictEffect> {
  yield takeEvery(InboxActionTypes.DELETE_CLIENT_APPEAL, deleteClientAppealByClientId);
}

function* watchRemapDialogsToSelectedTeammate(): Generator<StrictEffect> {
  yield takeEvery(InboxActionTypes.REMAP_DIALOGS_TO_SELECTED_TEAMMATE, remapDialogsToSelectedTeammate);
}

export default [
  watchFetchMessagesHistoryByProject(),,
  watchUpdateSelectedClient(),
  watchAddMessageToInbox(),
  watchGetInfoForSelectedClient(),
  watchUpdateMessagesStatus(),
  watchAddNote(),
  watchDeleteNote(),
  watchDeleteClientAppeal(),
  watchRemapDialogsToSelectedTeammate(),
];