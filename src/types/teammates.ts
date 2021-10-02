import {
  TeammateAddPayload, RemoveTeammatePayload, TeammateUpdatePayload,
  GetTeammatesPayload, TeammateUpdateSaga,
} from 'api/types';

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
  TEAMMATE_FETCH = 'TEAMMATE_FETCH',
  TEAMMATE_UPDATE = 'TEAMMATE_UPDATE',
  TEAMMATES_ADD = 'TEAMMATES_ADD',
}

export interface addTeammateAction {
  type: TeammatesActionTypes.TEAMMATE_ADD,
  payload: TeammateAddPayload,
}

interface addTeammateSagaAction {
  type: TeammatesActionTypes.TEAMMATE_ADD_SAGA,
  payload: TeammateUpdateSaga,
}

export interface deleteTeammateAction {
  type: TeammatesActionTypes.TEAMMATE_DELETE,
  payload: RemoveTeammatePayload,
}

export interface fetchTeammatesAction {
  type: TeammatesActionTypes.TEAMMATE_FETCH,
  payload: GetTeammatesPayload,
}

export interface updateTeammateAction {
  type: TeammatesActionTypes.TEAMMATE_UPDATE,
  payload: Partial<TeammateUpdatePayload>,
}

interface addTeammatesAction {
  type: TeammatesActionTypes.TEAMMATES_ADD,
  payload: TeammateAddPayload[],
}

export type TeammatesAction =
  addTeammateAction
  | addTeammateSagaAction
  | deleteTeammateAction
  | fetchTeammatesAction
  | updateTeammateAction
  | addTeammatesAction
