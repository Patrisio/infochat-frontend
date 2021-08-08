import React, { useState, useEffect, cloneElement } from 'react';
import styles from './modal.module.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

export interface ModalProps {
  show: boolean,
  onClose: () => void,
  title?: string,
  body: React.ReactElement | null,
  footer?: React.ReactElement | null,
  width?: string,
  height?: string,
  errors?: any,
  position?: 'center' | 'top',
}

export default function Modal({
  show, onClose, title, body, footer,
  width, height, errors, position = 'center'
}: ModalProps) {
  const closeModal = () => {
    onClose();
  };

  return (
    show ?
    <div>
      <div className={styles.overlay}>
        <div
          className={`
            ${styles.modalContent}
            ${position === 'center' ? styles.center : styles.top}
          `}
          style={{ width, height }}
        >
          <div className={styles.header}>
            <h3 className={styles.title}>{ title }</h3>
            <div
              className={styles.closeIcon}
              onClick={closeModal}
            >
              <FontAwesomeIcon
                icon={faTimes}
                color='#ccc'
              />
            </div>
          </div>

          <div className={styles.modalBody}>
            { body && cloneElement(body, { errors }) }
          </div>

          {
            footer && 
            <div>
              { footer }
            </div>
          }
        </div>
      </div>
    </div> :
    null
  );
}