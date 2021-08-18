import React, { useState, useContext } from 'react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';

import CurrentUserInfo from '../CurrentUserInfo/CurrentUserInfo';
import { Context } from '../../context/Context';

import Switcher from '../Switcher/Switcher';
import Popup from '../Popup/Popup';
import Avatar from '../Avatar/Avatar';

import styles from './header.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserEdit, faLayerGroup, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

export default function Header() {
  const [isOnline, toggleState] = useState(true);

  const { currentUser } = useContext(Context);
  const { projectId } = useParams<{projectId: string }>();
  const balance = currentUser.balance;

  const switchState = (value: boolean) => {
    toggleState(value);
  };

  const PopupBodyUser = () => {
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
          </ul>
        </div>

        <Link
          className={styles.link}
          to={`/project/${projectId}/projects`}
        >
          <div className={styles.icon}>
            <FontAwesomeIcon icon={faSignOutAlt} />
          </div>
          <span>Выход</span>
        </Link>
      </div>
    );
  };

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
            center
            arrow
          >
            <div className={styles.currentUserInfo}>
              <CurrentUserInfo />
            </div>
          </Popup>
        </div>

        {
          balance !== null &&
          <div className={styles.currentUserBalance}>
            Баланс: <span className={styles.balanceValue}>{ balance } ₽</span>
          </div>
        }

        <div className={styles.switcherBlock}>
          <span className={styles.stateLabel}>{ isOnline ? 'в сети' : 'не доступен' }</span>
          <Switcher
            onChange={switchState}
            value={true}
          />
        </div>
      </div>
    </header>
  );
}