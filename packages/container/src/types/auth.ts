import {
  InviteUserPayload, SignInPayload, SignUpPayload,
  JwtDecodePayload, FetchCurrentUserPayload,
} from '../api/types';

export enum AuthActionTypes {
  AUTH_INVITE = 'AUTH_INVITE',
  AUTH_SIGNIN = 'AUTH_SIGNIN',
  AUTH_SIGNUP = 'AUTH_SIGNUP',
  AUTH_GET_CURRENT_USER = 'AUTH_GET_CURRENT_USER',
  DECODE_JWT = 'DECODE_JWT',
}

export interface authInviteAction {
  type: AuthActionTypes.AUTH_INVITE,
  payload: InviteUserPayload,
}
export interface getCurrentUserAction {
  type: AuthActionTypes.AUTH_GET_CURRENT_USER,
  payload: FetchCurrentUserPayload,
}
export interface authSignInAction {
  type: AuthActionTypes.AUTH_SIGNIN,
  payload: SignInPayload,
}
export interface authSignUpAction {
  type: AuthActionTypes.AUTH_SIGNUP,
  payload: SignUpPayload,
}

export interface decodeJwtAction {
  type: AuthActionTypes.DECODE_JWT,
  payload: JwtDecodePayload,
}

export type AuthAction =
  authInviteAction
  | getCurrentUserAction
  | authSignInAction
  | authSignUpAction
  | decodeJwtAction
