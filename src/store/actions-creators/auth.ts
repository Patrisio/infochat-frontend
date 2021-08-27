import { AuthActionTypes, AuthAction } from '../../types/auth';

export const authInvite = (payload: any): AuthAction => ({
  type: AuthActionTypes.AUTH_INVITE,
  payload,
});

export const getCurrentUser = (payload: any): AuthAction => ({
  type: AuthActionTypes.AUTH_GET_CURRENT_USER,
  payload,
});

export const authSignIn = (payload: any): AuthAction => ({
  type: AuthActionTypes.AUTH_SIGNIN,
  payload,
});

export const authSignUp = (payload: any): AuthAction => ({
  type: AuthActionTypes.AUTH_SIGNUP,
  payload,
});