import { ProjectsActionTypes, ProjectsAction } from '../../types/projects';

export const addProject = (payload: any): ProjectsAction => ({
  type: ProjectsActionTypes.PROJECT_ADD,
  payload,
});