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
          action.teammate
        ]
      };

    case TeammatesActionTypes.TEAMMATES_ADD:
      return {
        ...state,
        teammates: action.teammate
      };

    case TeammatesActionTypes.TEAMMATE_DELETE:
      return {
        ...state,
        teammates: [...state.teammates].filter(teammate => teammate.email !== action.teammate.email)
      };

    default:
      return state;
  }
};