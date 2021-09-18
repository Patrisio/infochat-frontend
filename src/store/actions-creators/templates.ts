import { TemplatesActionTypes, TemplatesAction } from '../../types/templates';

export const fetchTemplates = (payload: { projectId: string }): TemplatesAction => ({
  type: TemplatesActionTypes.TEMPLATES_FETCH,
  payload,
});

export const addTemplate = (payload: any): TemplatesAction => ({
  type: TemplatesActionTypes.TEMPLATE_ADD,
  payload,
});

export const addTemplates = (payload: any): TemplatesAction => ({
  type: TemplatesActionTypes.TEMPLATES_ADD,
  payload,
});

export const editTemplate = (payload: any): TemplatesAction => ({
  type: TemplatesActionTypes.TEMPLATE_EDIT,
  payload,
});

export const deleteTemplate = (payload: { templateId: string, projectId: string }): TemplatesAction => ({
  type: TemplatesActionTypes.TEMPLATE_DELETE,
  payload,
});