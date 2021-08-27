import { TemplatesActionTypes, TemplatesAction } from '../../types/templates';

export const fetchTemplates = (payload: { projectId: string }): TemplatesAction => ({
  type: TemplatesActionTypes.TEMPLATES_FETCH,
  payload,
});

export const addTemplate = (template: any, projectId: string): TemplatesAction => ({
  type: TemplatesActionTypes.TEMPLATE_ADD,
  template,
  projectId,
});

export const addTemplates = (templates: any): TemplatesAction => ({
  type: TemplatesActionTypes.TEMPLATES_ADD,
  templates,
});

export const editTemplate = (template: any, projectId: string): TemplatesAction => ({
  type: TemplatesActionTypes.TEMPLATE_EDIT,
  template,
  projectId,
});

export const deleteTemplate = (templateId: string, projectId: string): TemplatesAction => ({
  type: TemplatesActionTypes.TEMPLATE_DELETE,
  templateId,
  projectId,
});