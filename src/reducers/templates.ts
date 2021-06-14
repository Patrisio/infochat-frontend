import { TEMPLATES, TEMPLATE } from '../constants/templates';
import cloneDeep from 'lodash/cloneDeep';
import { generateRandomHash } from '../utils/string';

interface Template {
  id: string,
  name: string,
  message: string,
}

interface State {
  templates: Template[],
}

const initialState: State = {
  templates: [],
};

export const templatesReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case TEMPLATES.ADD:
      return {
        ...state,
        templates: action.templates
      };

    case TEMPLATE.ADD:
      return {
        ...state,
        templates: [...state.templates, action.template]
      };

    case TEMPLATE.EDIT:
      const copy = cloneDeep(state.templates);
      const foundTemplateIndex = copy.findIndex((template) => (template.id === action.template.id));

      copy.splice(foundTemplateIndex, 1, action.template);
      
      return {
        ...state,
        templates: copy
      };

    case TEMPLATE.DELETE:
      return { templates: state.templates.filter((template) => template.id !== action.templateId) };
    
    default:
      return state;
  }
}