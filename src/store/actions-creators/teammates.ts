import { TeammatesActionTypes, TeammatesAction } from '../../types/teammates';

export const addTeammate = (payload: any): TeammatesAction => ({
  type: TeammatesActionTypes.TEAMMATE_ADD,
  payload,
});

export const addTeammateSaga = (payload: any): TeammatesAction => ({
  type: TeammatesActionTypes.TEAMMATE_ADD_SAGA,
  payload,
});

export const deleteTeammate = (payload: any): TeammatesAction => ({
  type: TeammatesActionTypes.TEAMMATE_DELETE,
  payload,
});

export const updateTeammate = (payload: any): TeammatesAction => ({
  type: TeammatesActionTypes.TEAMMATE_UPDATE,
  payload,
});

export const fetchTeammates = (payload: any): TeammatesAction => ({
  type: TeammatesActionTypes.TEAMMATE_FETCH,
  payload,
});