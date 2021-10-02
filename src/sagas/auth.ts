import { call, put, takeEvery, StrictEffect } from 'redux-saga/effects';
import { inviteUser, signIn, signUp, fetchCurrentUser, jwtDecode } from 'api/dataLayer';
import { Response } from 'api/types';
import {
  AuthActionTypes, authInviteAction, getCurrentUserAction,
  authSignUpAction, authSignInAction, decodeJwtAction,
} from 'types/auth';

function* authInvite({ payload }: authInviteAction): Generator<StrictEffect> {
  try {
    const { successCallback } = payload;
    const data = yield call(inviteUser, payload);

    successCallback(data);
  } catch (e) {
    yield put({
      type: 'AUTH_INVITE_FAILED',
      message: e.message,
    });
  }
}

function* authSignUp({ payload }: authSignUpAction): Generator<StrictEffect, void, Response> {
  try {
    const { email, password, successCallback } = payload;
    const data = yield call(signUp, payload);

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

function* authSignIn({ payload }: authSignInAction): Generator<StrictEffect> {
  try {
    yield call(signIn, payload);
  } catch (e) {
    yield put({
      type: 'AUTH_SIGNIN_FAILED',
      message: e.message,
    });
  }
}

function* getCurrentUser({ payload }: getCurrentUserAction): Generator<StrictEffect> {
  try {
    yield call(fetchCurrentUser, payload);
  } catch (e) {
    yield put({
      type: 'GET_CURRENT_USER_FAILED',
      message: e.message,
    });
  }
}

function* decodeJwt({ payload }: decodeJwtAction): Generator<StrictEffect> {
  try {
    yield call(jwtDecode, payload);
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