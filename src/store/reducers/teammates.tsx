import { TeammatesState, TeammatesAction, TeammatesActionTypes } from '../../types/teammates';

const initialState: TeammatesState = {
  teammates: [],
};

export const teammatesReducer = (state = initialState, action: TeammatesAction): TeammatesState => {
  switch (action.type) {
    case TeammatesActionTypes.TEAMMATE_ADD:
      return {
        ...state,
        teammates: [
          ...state.teammates,
          action.teammate,
        ],
      };

    case TeammatesActionTypes.TEAMMATES_ADD:
      return {
        ...state,
        teammates: action.teammate,
      };

    case TeammatesActionTypes.TEAMMATE_DELETE:
      return {
        ...state,
        teammates: [...state.teammates].filter(teammate => teammate.email !== action.teammate.email),
      };

    case TeammatesActionTypes.TEAMMATE_UPDATE:
      const { isOnline, username, oldEmail } = action.payload;
      const hasIsOnlineProperty = action.payload.hasOwnProperty('isOnline');

      if (hasIsOnlineProperty || username) {
        const foundTeammate = state.teammates.find(teammate => teammate.email === oldEmail);

        if (foundTeammate) {
          foundTeammate.isOnline = hasIsOnlineProperty ? isOnline : foundTeammate.isOnline;
          foundTeammate.username = username ? username : foundTeammate.username;
        }
      }
      
      return {
        ...state,
        teammates: state.teammates,
      };

    default:
      return state;
  }
};