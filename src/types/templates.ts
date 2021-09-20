import { TemplateAddPayload, GetTemplatesPayload, TemplateEditPayload, TemplateDeletePayload } from '../api/types';

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

export interface addTemplateAction {
  type: TemplatesActionTypes.TEMPLATE_ADD,
  payload: TemplateAddPayload,
}
export interface deleteTemplateAction {
  type: TemplatesActionTypes.TEMPLATE_DELETE,
  payload: TemplateDeletePayload,
}
export interface editTemplateAction {
  type: TemplatesActionTypes.TEMPLATE_EDIT,
  payload: TemplateEditPayload,
}
export interface addTemplatesAction {
  type: TemplatesActionTypes.TEMPLATES_ADD,
  payload: TemplateAddPayload[],
}
export interface fetchTemplatesAction {
  type: TemplatesActionTypes.TEMPLATES_FETCH,
  payload: GetTemplatesPayload,
}

export type TemplatesAction =
  addTemplateAction
  | deleteTemplateAction
  | editTemplateAction
  | addTemplatesAction
  | fetchTemplatesAction
