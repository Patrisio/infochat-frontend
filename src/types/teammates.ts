export interface Teammate {
  avatar: string,
  email: string,
  role: string,
  status: string,
  isOnline: boolean,
  username: string,
}

export interface TeammatesState {
  teammates: Teammate[],
}

export enum TeammatesActionTypes {
  TEAMMATE_ADD = 'TEAMMATE_ADD',
  TEAMMATE_ADD_SAGA = 'TEAMMATE_ADD_SAGA',
  TEAMMATE_DELETE = 'TEAMMATE_DELETE',
  // TEAMMATE_ASSIGN = 'TEAMMATE_ASSIGN',
  TEAMMATE_FETCH = 'TEAMMATE_FETCH',
  TEAMMATE_UPDATE = 'TEAMMATE_UPDATE',
  TEAMMATES_ADD = 'TEAMMATES_ADD',
}

interface addTeammateAction {
  type: TeammatesActionTypes.TEAMMATE_ADD,
  payload: any,
}

interface addTeammateSagaAction {
  type: TeammatesActionTypes.TEAMMATE_ADD_SAGA,
  payload: any,
}

interface deleteTeammateAction {
  type: TeammatesActionTypes.TEAMMATE_DELETE,
  payload: any,
}

interface fetchTeammatesAction {
  type: TeammatesActionTypes.TEAMMATE_FETCH,
  payload: any,
}

interface updateTeammateAction {
  type: TeammatesActionTypes.TEAMMATE_UPDATE,
  payload: any,
}

interface addTeammatesAction {
  type: TeammatesActionTypes.TEAMMATES_ADD,
  payload: any,
}

export type TeammatesAction =
  addTeammateAction
  | addTeammateSagaAction
  | deleteTeammateAction
  | fetchTeammatesAction
  | updateTeammateAction
  | addTeammatesAction
