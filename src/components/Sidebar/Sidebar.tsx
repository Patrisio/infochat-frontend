import React from 'react';

import ProjectsSelector from './components/ProjectsSelector/ProjectsSelector';

import styles from './sidebar.module.scss';

interface SidebarProps {
  children: React.ReactNode,
  mode?: 'light' | 'dark',
}

export default function Sidebar({ children, mode = 'dark' }: SidebarProps) {
  return (
    <>
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

      <div className={styles.sidebarClone} />
    </>
  );
}