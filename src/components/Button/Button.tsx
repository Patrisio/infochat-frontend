import React from 'react';
import styles from './button.module.scss';

interface IButtonProps {
  children: React.ReactNode,
  type: 'submit' | 'reset' | 'button',
  fluid?: boolean,
  size?: string,
  background?: string,
  onClick?: (e?: any) => void,
  disabled?: boolean,
  classNames?: string,
}

export default function Button({
  children,
  type,
  fluid,
  size,
  background,
  onClick,
  disabled,
  classNames,
}: IButtonProps) {

  return (
    <button
      className={`
        ${styles.button}
        ${background === 'edit' ? styles.edit :
          background === 'delete' ? styles.delete :
          background === 'success' ? styles.success : 
          background === 'transparent' ? styles.transparent : styles.default
        }
        ${fluid ? styles.fluid : null}
        ${size === 'large' ? styles.large :
          size === 'medium' ? styles.medium :
          size === 'small' ? styles.small : null
        }
        ${classNames}
      `}
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
      { children }
    </button>
  );
}