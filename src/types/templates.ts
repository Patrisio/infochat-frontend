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
  template: any,
  projectId: any,
}
interface deleteTemplateAction {
  type: TemplatesActionTypes.TEMPLATE_DELETE,
  templateId: any,
  projectId: any,
}
interface editTemplateAction {
  type: TemplatesActionTypes.TEMPLATE_EDIT,
  template: any,
  projectId: any,
}
interface addTemplatesAction {
  type: TemplatesActionTypes.TEMPLATES_ADD,
  templates: any,
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
