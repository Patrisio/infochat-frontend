import { TemplatesState, TemplatesAction, TemplatesActionTypes } from '../../types/templates';

import cloneDeep from 'lodash/cloneDeep';

const initialState: TemplatesState = {
  templates: [],
};

export const templatesReducer = (state = initialState, action: TemplatesAction): TemplatesState => {
  switch (action.type) {
    case TemplatesActionTypes.TEMPLATES_ADD:
      return {
        ...state,
        templates: action.payload,
      };

    case TemplatesActionTypes.TEMPLATE_ADD:
      return {
        ...state,
        templates: [...state.templates, action.payload]
      };

    case TemplatesActionTypes.TEMPLATE_EDIT:
      const copy = cloneDeep(state.templates);
      const foundTemplateIndex = copy.findIndex((template) => (template.id === action.payload.id));

      copy.splice(foundTemplateIndex, 1, action.payload);
      
      return {
        ...state,
        templates: copy
      };

    case TemplatesActionTypes.TEMPLATE_DELETE:
      return { templates: state.templates.filter((template) => template.id !== action.payload.templateId) };
    
    default:
      return state;
  }
}