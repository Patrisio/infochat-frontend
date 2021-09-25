import React, { useState, useEffect } from 'react';
import OutsideClickHandler from 'react-outside-click-handler';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

import styles from './popup.module.scss';
import { isUndefined } from 'lodash';


interface IProps {
  children: React.ReactNode,
  body: React.ReactNode,
  width?: string,
  position?: 'top' | 'down' | 'downRight' | 'center',
  isOpenPopup?: boolean,
  arrow?: boolean,
  onClick?: (bool?: boolean) => void,
}

export default function Popup({
  children,
  width = '200px',
  body,
  position = 'down',
  isOpenPopup,
  arrow = false,
  onClick
}: IProps) {
  const [isOpen, toggle] = useState<boolean>(Boolean(isOpenPopup));

  const getPositionStyles = () => {
    switch (position) {
      case 'center':
        return isOpen ? styles.popupCenterVisible : styles.popupCenterHidden;
      case 'top':
        return styles.top;
      case 'downRight':
        return styles.downRight;
      default: 
        return styles.down;
    }
  };

  useEffect(() => {
    toggle(Boolean(isOpenPopup));
  }, [isOpenPopup]);

  return (
    <OutsideClickHandler
      onOutsideClick={() => {
        if (isUndefined(isOpenPopup)) {
          toggle(false);
        } else {
          onClick && onClick!(false);
        }
      }}
    >
      <div className={styles.popupContainer}>
        <div
          className={styles.popupTriggerContainer}
          onClick={() => {
            if (isUndefined(isOpenPopup)) {
              toggle(prev => !prev);
            }
            
            onClick && onClick!();
          }}
        >
          {children}
          {
            arrow &&
            <div className={`
              ${styles.arrowIconDown}
              ${isOpen && styles.arrowIconUp}
            `}>
              <FontAwesomeIcon
                icon={faChevronDown}
                color='$grey-4'
                size='xs'
              />
            </div>
          }
        </div>

        <div
          className={`
            ${styles.popup}
            ${isOpen ? styles.popupVisible : styles.popupHidden}
            ${getPositionStyles()}
          `}
          style={{ width }}
        >
          { body }
        </div>
      </div>
    </OutsideClickHandler>
  );
}