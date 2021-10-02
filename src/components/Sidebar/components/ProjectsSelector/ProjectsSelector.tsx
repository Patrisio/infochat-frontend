import React, { useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons'

import Popup from 'ui/Popup/Popup';

import { Context, Project } from 'context/Context';
import styles from './projectsSelector.module.scss';

interface ProjectsSelectorProps {
  mode: 'light' | 'dark',
}

export default function ProjectsSelector({ mode }: ProjectsSelectorProps) {
  const [isOpenProjectsPopup, toggleOpenProjectsPopup] = useState<boolean>(false);
  const { projectId } = useParams<{ projectId: string }>();
  const { currentUser } = useContext(Context);
  const currentUserProjects = currentUser.projects;
  const currentProject = currentUserProjects.find((project: Project) => project.id === parseInt(projectId));
  const currentUserProjectsWithoutCurrentProject = currentUserProjects.filter((project: Project) => project.id !== currentProject?.id);

  const PopupBodyProjects = () => {
    return (
      <ul className={styles.projectsList}>
        {
          currentUserProjectsWithoutCurrentProject.map(({ id, name }) => {
            const { pathname } = window.location;
            const regExp = new RegExp(projectId, 'i');
            const replacedRoute = pathname.replace(regExp, String(id));

            return (
              <li
                key={id}
                className={styles.projectName}
              >
                <Link
                  className={styles.projectLink}
                  to={replacedRoute}
                >
                  { name }
                </Link>
                
                <a
                  href={replacedRoute}
                  target='_blank'
                >
                  <FontAwesomeIcon
                    icon={faExternalLinkAlt}
                    color='$grey-23'
                  />
                </a>
              </li>
            );
          })
        }
      </ul>
    );
  };

  const projectPreviewClassName = mode === 'light' ? styles.light : styles.dark;
  const hasData = currentUserProjectsWithoutCurrentProject.length > 0;

  const ProjectPreview = () => {
    return (
      <div
        className={`
          ${styles.projectsSelectorContainer}
          ${projectPreviewClassName}
          ${hasData && styles.projectsSelectorContainerHovered}
        `}
      >
        { currentProject?.name }
      </div>
    );
  };

  return hasData ?
    <Popup
      isOpenPopup={isOpenProjectsPopup}
      body={<PopupBodyProjects />}
      position='center'
      width='190px'
      onClick={(bool?: boolean) => {
        if (typeof bool === 'boolean') {
          toggleOpenProjectsPopup(bool);
        } else {
          toggleOpenProjectsPopup(true);
        }
      }}
    >
      <ProjectPreview />
    </Popup> :
    <ProjectPreview />
}