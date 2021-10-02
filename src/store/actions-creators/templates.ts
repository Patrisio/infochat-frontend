import { TemplatesActionTypes, TemplatesAction } from '../../types/templates';
import { TemplateAddPayload, GetTemplatesPayload, TemplateEditPayload, TemplateDeletePayload } from 'api/types';

export const fetchTemplates = (payload: GetTemplatesPayload): TemplatesAction => ({
  type: TemplatesActionTypes.TEMPLATES_FETCH,
  payload,
});

export const addTemplate = (payload: TemplateAddPayload): TemplatesAction => ({
  type: TemplatesActionTypes.TEMPLATE_ADD,
  payload,
});

export const addTemplates = (payload: TemplateAddPayload[]): TemplatesAction => ({
  type: TemplatesActionTypes.TEMPLATES_ADD,
  payload,
});

export const editTemplate = (payload: TemplateEditPayload): TemplatesAction => ({
  type: TemplatesActionTypes.TEMPLATE_EDIT,
  payload,
});

export const deleteTemplate = (payload: TemplateDeletePayload): TemplatesAction => ({
  type: TemplatesActionTypes.TEMPLATE_DELETE,
  payload,
});