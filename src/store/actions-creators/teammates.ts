import { TeammatesActionTypes, TeammatesAction } from '../../types/teammates';

export const addTeammate = (teammate: any): TeammatesAction => ({
  type: TeammatesActionTypes.TEAMMATE_ADD,
  teammate,
});

export const addTeammateSaga = (teammate: any): TeammatesAction => ({
  type: TeammatesActionTypes.TEAMMATE_ADD_SAGA,
  teammate,
});

export const deleteTeammate = (teammate: any): TeammatesAction => ({
  type: TeammatesActionTypes.TEAMMATE_DELETE,
  teammate,
});

export const updateTeammate = (payload: any): TeammatesAction => ({
  type: TeammatesActionTypes.TEAMMATE_UPDATE,
  payload,
});

export const fetchTeammates = (payload: any): TeammatesAction => ({
  type: TeammatesActionTypes.TEAMMATE_FETCH,
  payload,
});