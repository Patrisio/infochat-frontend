export enum ProjectsActionTypes {
  PROJECT_ADD = 'PROJECT_ADD',
}

interface addProjectAction {
  type: ProjectsActionTypes.PROJECT_ADD,
  payload: any,//teammate: any,
}

export type ProjectsAction = 
  addProjectAction