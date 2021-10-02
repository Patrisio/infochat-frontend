import { TeammatesActionTypes, TeammatesAction } from 'types/teammates';
import {
  TeammateAddPayload, RemoveTeammatePayload, TeammateUpdatePayload,
  GetTeammatesPayload, TeammateUpdateSaga,
} from 'api/types';

export const addTeammate = (payload: TeammateAddPayload): TeammatesAction => ({
  type: TeammatesActionTypes.TEAMMATE_ADD,
  payload,
});

export const addTeammateSaga = (payload: TeammateUpdateSaga): TeammatesAction => ({
  type: TeammatesActionTypes.TEAMMATE_ADD_SAGA,
  payload,
});

export const deleteTeammate = (payload: RemoveTeammatePayload): TeammatesAction => ({
  type: TeammatesActionTypes.TEAMMATE_DELETE,
  payload,
});

export const updateTeammate = (payload: Partial<TeammateUpdatePayload>): TeammatesAction => ({
  type: TeammatesActionTypes.TEAMMATE_UPDATE,
  payload,
});

export const fetchTeammates = (payload: GetTeammatesPayload): TeammatesAction => ({
  type: TeammatesActionTypes.TEAMMATE_FETCH,
  payload,
});