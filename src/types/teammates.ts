export interface Teammate {
  avatar: string,
  email: string,
  role: string,
  status: string,
  username: string,
}

export interface TeammatesState {
  teammates: Teammate[],
}

export enum TeammatesActionTypes {
  TEAMMATE_ADD = 'TEAMMATE_ADD',
  TEAMMATE_DELETE = 'TEAMMATE_DELETE',
  // TEAMMATE_ASSIGN = 'TEAMMATE_ASSIGN',
  TEAMMATE_FETCH = 'TEAMMATE_FETCH',
  TEAMMATE_UPDATE = 'TEAMMATE_UPDATE',
  TEAMMATES_ADD = 'TEAMMATES_ADD',
}

interface addTeammateAction {
  type: TeammatesActionTypes.TEAMMATE_ADD,
  teammate: any,
}

interface deleteTeammateAction {
  type: TeammatesActionTypes.TEAMMATE_DELETE,
  teammate: any,
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
  teammate: any,
}

export type TeammatesAction =
  addTeammateAction
  | deleteTeammateAction
  | fetchTeammatesAction
  | updateTeammateAction
  | addTeammatesAction
