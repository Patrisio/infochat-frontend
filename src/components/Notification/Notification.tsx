import React, { useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

import { NotificationContext, NotificationContextProps } from '../../context/NotificationContext';
import styles from './notification.module.scss';

export default function Notification() {
  const { notification, updateNotification } = useContext<NotificationContextProps>(NotificationContext);

  const closeNotification = () => {
    updateNotification((prev) => ({
      ...prev,
      isShow: false,
    }));
  };

  return (
    <div className={styles.notificationContainer}>
      { notification.text }

      <div
        className={styles.closeIcon}
        onClick={closeNotification}
      >
        <FontAwesomeIcon
          icon={faTimes}
          color='$grey-23'
        />
      </div>
    </div>
  );
}