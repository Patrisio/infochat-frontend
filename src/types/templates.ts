interface Template {
  id: string,
  name: string,
  message: string,
}

export interface TemplatesState {
  templates: Template[],
}

export enum TemplatesActionTypes {
  TEMPLATE_ADD = 'TEMPLATE_ADD',
  TEMPLATE_DELETE = 'TEMPLATE_DELETE',
  TEMPLATE_EDIT = 'TEMPLATE_EDIT',
  TEMPLATES_ADD = 'TEMPLATES_ADD',
  TEMPLATES_FETCH = 'TEMPLATES_FETCH',
}

interface addTemplateAction {
  type: TemplatesActionTypes.TEMPLATE_ADD,
  payload: any,
}
interface deleteTemplateAction {
  type: TemplatesActionTypes.TEMPLATE_DELETE,
  payload: any,
}
interface editTemplateAction {
  type: TemplatesActionTypes.TEMPLATE_EDIT,
  payload: any,
}
interface addTemplatesAction {
  type: TemplatesActionTypes.TEMPLATES_ADD,
  payload: any,
}
interface fetchTemplatesAction {
  type: TemplatesActionTypes.TEMPLATES_FETCH,
  payload: any,
}

export type TemplatesAction =
  addTemplateAction
  | deleteTemplateAction
  | editTemplateAction
  | addTemplatesAction
  | fetchTemplatesAction
