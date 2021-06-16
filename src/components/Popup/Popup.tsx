import React, { useState, useEffect } from 'react';

import OutsideClickHandler from 'react-outside-click-handler';

import styles from './popup.module.scss';
import { isUndefined } from 'lodash';


interface IProps {
  children: React.ReactNode,
  body: React.ReactNode,
  width?: string,
  center?: boolean,
  position?: 'top' | 'down',
  isOpenPopup?: boolean,
  onClick?: (bool?: boolean) => void,
}

export default function Popup({
  children,
  width = '200px',
  body,
  center,
  position = 'down',
  isOpenPopup,
  onClick
}: IProps) {
  const [isOpen, toggle] = useState(Boolean(isOpenPopup));

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
        <div onClick={() => {
          if (isUndefined(isOpenPopup)) {
            toggle(prev => !prev);
          }
          
          onClick && onClick!();
        }}>
          {children}
        </div>

        {
          isOpen &&
          <div
            className={`
              ${styles.popup}
              ${center && styles.center}
              ${position === 'top' ? styles.top : styles.down}
            `}
            style={{
              width
            }}
          >
            { body }
          </div>
        }
      </div>
    </OutsideClickHandler>
  );
}