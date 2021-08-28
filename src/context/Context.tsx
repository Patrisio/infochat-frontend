import { createContext } from 'react';
import { Role } from '../lib/utils/accessRights';

export interface Project {
  id: number,
  name: string,
  teammatesCount: number,
}

export interface IUser {
  avatar: string,
  email: string,
  role: Role,
  status: string,
  username: string,
  projectId: number | null,
  timezone: string | null,
  balance: number | null,
  isOnline: boolean,
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
    role: 'operator',
    status: '',
    username: '',
    projectId: null,
    timezone: null,
    balance: null,
    isOnline: true,
    projects: [],
  },
  setCurrentUser: () => {},
});