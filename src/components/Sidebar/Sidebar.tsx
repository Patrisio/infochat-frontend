import React from 'react';

import ProjectsSelector from './components/ProjectsSelector/ProjectsSelector';

import styles from './sidebar.module.scss';

interface IClient {
  projectId: string,
  clientId: string,
  message: IMessagesHistory,
  avatarName: string,
  avatarColor: string,
}

interface Teammate {
  avatar: string,
  email: string,
  role: string,
  status: string,
  username: string,
  allClientIds: IClient[],
  unreadCount: number,
  unreadClientIds: IClient[],
  assignedCount: number,
  assignedClientIds: IClient[],
  openedCount: number,
  openedClientIds: IClient[],
}

interface IMessagesHistory {
  message: string,
  clientId: string,
  username: string
}

interface IIncomingMessage {
  id: string,
  projectId: string,
  clientId: string,
  messagesHistory: IMessagesHistory[],
  assigned_to: string | null
}

interface SidebarProps {
  children: React.ReactNode,
  mode?: 'light' | 'dark',
}

export default function Sidebar({ children, mode = 'dark' }: SidebarProps) {
  return (
    <div
      className={`
        ${styles.sidebarContainer}
        ${mode === 'light' ? styles.lightMode : styles.darkMode}
      `}
    >
      <ProjectsSelector
        mode={mode}
      />
      {children}
    </div>
  );
}