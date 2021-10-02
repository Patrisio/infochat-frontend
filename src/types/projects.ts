import { ProjectAddPayload } from 'api/types';

export enum ProjectsActionTypes {
  PROJECT_ADD = 'PROJECT_ADD',
}

interface addProjectAction {
  type: ProjectsActionTypes.PROJECT_ADD,
  payload: ProjectAddPayload,
}

export type ProjectsAction = 
  addProjectAction