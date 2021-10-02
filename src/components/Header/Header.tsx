import React, { useState, useEffect, useContext } from 'react';
import { useParams, useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserEdit, faLayerGroup, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

import socket from '../../socket';
import { Context } from 'context/Context';

import Switcher from 'ui/Switcher/Switcher';
import Popup from 'ui/Popup/Popup';
import Avatar from 'ui/Avatar/Avatar';

import { useActions } from 'hooks/useActions';

import styles from './header.module.scss';
import { isProjectOwner } from 'lib/utils/accessRights';
import { updateToken } from 'lib/utils/token';

export default function Header() {
  const { currentUser, setCurrentUser } = useContext(Context);
  const [isOnline, toggleIsOnline] = useState(currentUser.isOnline);

  const history = useHistory();
  const { projectId } = useParams<{projectId: string }>();
  const { updateTeammate } = useActions();
  const balance = currentUser.balance;
  const isOwner = isProjectOwner(currentUser.role);

  const switchIsOnline = (isOnline: boolean) => {
    toggleIsOnline(isOnline);
    updateTeammate({
      oldEmail: currentUser.email,
      isOnline,
      projectId,
      successCallback: () => setCurrentUser(
        (prev: any) => {
          socket.emit('updateTeammateOnlineStatus', {
            isOnline,
            email: currentUser.email,
          });
          return {
            ...prev,
            isOnline,
          };
        }
      ),
    });
  };

  const PopupBodyUser = () => {
    const logout = () => {
      updateToken('');
      history.push('/signin');
    };

    return (
      <div className={styles.popup}>
        <p className={styles.email}>{ currentUser.email }</p>

        <div>
          <ul className={styles.list}>
            <li>
              <Link
                className={styles.link}
                to={`/project/${projectId}/profile`}
              >
                <div className={styles.icon}>
                  <FontAwesomeIcon icon={faUserEdit} />
                </div>
                <span>Изменить профиль</span>
              </Link>
            </li>
            {
              isOwner &&
              <li>
                <Link
                  className={styles.link}
                  to={`/project/${projectId}/projects`}
                >
                  <div className={styles.icon}>
                    <FontAwesomeIcon icon={faLayerGroup} />
                  </div>
                  <span>Мои проекты</span>
                </Link>
              </li>
            }
          </ul>
        </div>

        <div
          className={styles.link}
          onClick={logout}
        >
          <div className={styles.icon}>
            <FontAwesomeIcon icon={faSignOutAlt} />
          </div>
          <span>Выход</span>
        </div>
      </div>
    );
  };

  useEffect(() => {
    toggleIsOnline(currentUser.isOnline);
  }, [currentUser.isOnline]);

  return (
    <header className={styles.headerContainer}>
      <div className={styles.userBlock}>
        <div className={styles.userMenu}>
          <Avatar
            name={currentUser.username}
            size='medium'
          />
          <Popup
            body={<PopupBodyUser />}
            width='215px'
            position='center'
            arrow
          >
            <div className={styles.currentUserInfo}>
              {currentUser.username}
            </div>
          </Popup>
        </div>

        {
          balance !== null && isOwner &&
          <div className={styles.currentUserBalance}>
            Баланс: <span className={styles.balanceValue}>{ balance } ₽</span>
          </div>
        }

        <div className={styles.switcherBlock}>
          <span className={styles.stateLabel}>{ isOnline ? 'в сети' : 'не доступен' }</span>
          <Switcher
            onChange={switchIsOnline}
            value={isOnline}
          />
        </div>
      </div>
    </header>
  );
}