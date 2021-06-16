import React, { useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons'

import Popup from '../../../../components/Popup/Popup';

import { Context, Project } from '../../../../context/Context';
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
                    color='#ccc'
                  />
                </a>
              </li>
            );
          })
        }
      </ul>
    );
  };


  const ProjectPreview = () => {
    return (
      <div className={`
        ${styles.projectsSelectorContainer}
        ${mode === 'light' ? styles.light : styles.dark}
      `}>
        { currentProject?.name }
      </div>
    );
  };

  return currentUserProjectsWithoutCurrentProject.length > 0 ?
  <Popup
    isOpenPopup={isOpenProjectsPopup}
    body={<PopupBodyProjects />}
    center
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