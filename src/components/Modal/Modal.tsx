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

  const getPositionStyles = () => {
    switch (position) {
      case 'top':
        return show ? styles.modalContentTopVisible : styles.modalContentTopHidden;
      case 'center':
        return styles.center;
      default:
        return '';
    }
  };

  return (
    <div
      className={`
        ${styles.overlay}
        ${show ? styles.overlayVisible : styles.overlayHidden}
      `}>
      <div
        className={`
          ${styles.modalContent}
          ${show ? styles.modalContentVisible : styles.modalContentHidden}
          ${getPositionStyles()}
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
              color='$grey-23'
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
  );
}