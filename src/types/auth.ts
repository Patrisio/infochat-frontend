export enum AuthActionTypes {
  AUTH_INVITE = 'AUTH_INVITE',
  AUTH_SIGNIN = 'AUTH_SIGNIN',
  AUTH_SIGNUP = 'AUTH_SIGNUP',
  AUTH_GET_CURRENT_USER = 'AUTH_GET_CURRENT_USER',
}

interface authInviteAction {
  type: AuthActionTypes.AUTH_INVITE,
  payload: any,
}
interface getCurrentUserAction {
  type: AuthActionTypes.AUTH_GET_CURRENT_USER,
  payload: any,
}
interface authSignInAction {
  type: AuthActionTypes.AUTH_SIGNIN,
  payload: any,
}
interface authSignUpAction {
  type: AuthActionTypes.AUTH_SIGNUP,
  payload: any,
}

export type AuthAction =
  authInviteAction
  | getCurrentUserAction
  | authSignInAction
  | authSignUpAction