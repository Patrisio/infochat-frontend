import { createContext } from 'react';

export interface Project {
  id: number,
  name: string,
  teammatesCount: number,
}

interface IUser {
  avatar: string,
  email: string,
  role: string,
  status: string,
  username: string,
  projectId: number | null,
  timezone: string | null,
  balance: number | null,
  projects: Project[],
}

interface ContextProps {
  currentUser: IUser,
  setCurrentUser: (prev: any) => void,
};

export const Context = createContext<ContextProps>({
  currentUser: {
    avatar: '',
    email: '',
    role: '',
    status: '',
    username: '',
    projectId: null,
    timezone: null,
    balance: null,
    projects: [],
  },
  setCurrentUser: () => {},
});