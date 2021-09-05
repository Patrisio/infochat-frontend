import { call, put, takeEvery, all, StrictEffect } from 'redux-saga/effects';
import { inviteUser, signIn, signUp, fetchCurrentUser, jwtDecode } from '../api/dataLayer';

function* authInvite(action: any): Generator<StrictEffect> {
  try {
    const { username, password, projectId, inviteId, successCallback } = action.payload;
    const data: any = yield call(inviteUser, { username, password, projectId, inviteId });
    console.log(data);
    successCallback(data);
  } catch (e) {
    yield put({
      type: 'AUTH_INVITE_FAILED',
      message: e.message,
    });
  }
}

function* authSignUp(action: any): Generator<StrictEffect> {
  try {
    const { email, password, successCallback } = action.payload;
    const data: any = yield call(signUp, action.payload);

    if (data.statusCode !== 400 && data.statusCode !== 409) {
      yield put({
        type: 'AUTH_SIGNIN',
        payload: { email, password, successCallback }
      });
    }
  } catch (e) {
    yield put({
      type: 'AUTH_SIGNUP_FAILED',
      message: e.message,
    });
  }
}

function* authSignIn(action: any): Generator<StrictEffect> {
  try {
    yield call(signIn, action.payload);
  } catch (e) {
    yield put({
      type: 'AUTH_SIGNIN_FAILED',
      message: e.message,
    });
  }
}

function* getCurrentUser(action: any): Generator<StrictEffect> {
  try {
    yield call(fetchCurrentUser, action.payload);
  } catch (e) {
    yield put({
      type: 'GET_CURRENT_USER_FAILED',
      message: e.message,
    });
  }
}

function* decodeJwt(action: any): Generator<StrictEffect> {
  try {
    yield call(jwtDecode, action.payload);
  } catch (e) {
    yield put({
      type: 'DECODE_JWT_FAILED',
      message: e.message,
    });
  }
}

function* watchInvite(): Generator<StrictEffect> {
  yield takeEvery('AUTH_INVITE', authInvite);
}

function* watchSignIn(): Generator<StrictEffect> {
  yield takeEvery('AUTH_SIGNIN', authSignIn);
}

function* watchSignUp(): Generator<StrictEffect> {
  yield takeEvery('AUTH_SIGNUP', authSignUp);
}

function* watchGetCurrentUser(): Generator<StrictEffect> {
  yield takeEvery('AUTH_GET_CURRENT_USER', getCurrentUser);
}

function* watchDecodeJwt(): Generator<StrictEffect> {
  yield takeEvery('DECODE_JWT', decodeJwt);
}

export default [
  watchInvite(),
  watchSignIn(),
  watchSignUp(),
  watchGetCurrentUser(),
  watchDecodeJwt(),
];