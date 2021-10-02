import { TeammatesState, TeammatesAction, TeammatesActionTypes } from 'types/teammates';

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
          action.payload,
        ],
      };

    case TeammatesActionTypes.TEAMMATES_ADD:
      return {
        ...state,
        teammates: action.payload,
      };

    case TeammatesActionTypes.TEAMMATE_DELETE:
      return {
        ...state,
        teammates: [...state.teammates].filter(teammate => teammate.email !== action.payload.email),
      };

    case TeammatesActionTypes.TEAMMATE_UPDATE:
      const { isOnline, username, oldEmail, email, status } = action.payload;
      const hasIsOnlineProperty = action.payload.hasOwnProperty('isOnline');

      let foundTeammate = state.teammates.find(teammate => teammate.email === oldEmail);
      let foundTeammateIndex = state.teammates.findIndex(teammate => teammate.email === oldEmail);

      if (foundTeammate) {
        foundTeammate = {
          ...foundTeammate,
          isOnline: hasIsOnlineProperty ? isOnline as boolean : foundTeammate.isOnline as boolean,
          username: username ? username : foundTeammate.username,
          status: status ? status : foundTeammate.status,
          email: email ? email as string : oldEmail as string,
        };

        state.teammates.splice(foundTeammateIndex, 1, foundTeammate);
      }

      return {
        ...state,
        teammates: state.teammates,
      };

    default:
      return state;
  }
};