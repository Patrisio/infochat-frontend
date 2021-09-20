import { ProjectsActionTypes, ProjectsAction } from '../../types/projects';
import { ProjectAddPayload } from '../../api/types';

export const addProject = (payload: ProjectAddPayload): ProjectsAction => ({
  type: ProjectsActionTypes.PROJECT_ADD,
  payload,
});