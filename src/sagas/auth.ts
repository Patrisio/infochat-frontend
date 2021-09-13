import { call, put, takeEvery, all, StrictEffect } from 'redux-saga/effects';
import { inviteUser, signIn, signUp, fetchCurrentUser, jwtDecode } from '../api/dataLayer';
import { AuthActionTypes, AuthAction } from '../types/auth';

function* authInvite(action: AuthAction): Generator<StrictEffect> {
  try {
    const { username, password, projectId, inviteId, successCallback } = action.payload;
    const data = yield call(inviteUser, { username, password, projectId, inviteId });

    successCallback(data);
  } catch (e) {
    yield put({
      type: 'AUTH_INVITE_FAILED',
      message: e.message,
    });
  }
}

function* authSignUp(action: AuthAction): Generator<StrictEffect> {
  try {
    const { email, password, successCallback } = action.payload;
    const data: any = yield call(signUp, action.payload);

    if (data.statusCode !== 400 && data.statusCode !== 409) {
      yield put({
        type: AuthActionTypes.AUTH_SIGNIN,
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

function* authSignIn(action: AuthAction): Generator<StrictEffect> {
  try {
    yield call(signIn, action.payload);
  } catch (e) {
    yield put({
      type: 'AUTH_SIGNIN_FAILED',
      message: e.message,
    });
  }
}

function* getCurrentUser(action: AuthAction): Generator<StrictEffect> {
  try {
    yield call(fetchCurrentUser, action.payload);
  } catch (e) {
    yield put({
      type: 'GET_CURRENT_USER_FAILED',
      message: e.message,
    });
  }
}

function* decodeJwt(action: AuthAction): Generator<StrictEffect> {
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
  yield takeEvery(AuthActionTypes.AUTH_INVITE, authInvite);
}

function* watchSignIn(): Generator<StrictEffect> {
  yield takeEvery(AuthActionTypes.AUTH_SIGNIN, authSignIn);
}

function* watchSignUp(): Generator<StrictEffect> {
  yield takeEvery(AuthActionTypes.AUTH_SIGNUP, authSignUp);
}

function* watchGetCurrentUser(): Generator<StrictEffect> {
  yield takeEvery(AuthActionTypes.AUTH_GET_CURRENT_USER, getCurrentUser);
}

function* watchDecodeJwt(): Generator<StrictEffect> {
  yield takeEvery(AuthActionTypes.DECODE_JWT, decodeJwt);
}

export default [
  watchInvite(),
  watchSignIn(),
  watchSignUp(),
  watchGetCurrentUser(),
  watchDecodeJwt(),
];