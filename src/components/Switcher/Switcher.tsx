import React, { useEffect, useState } from 'react';
import styles from './switcher.module.scss';

interface IProps {
  value?: boolean,
  onChange: (isActive: boolean) => void,
}

export default function Switcher({ onChange, value = false }: IProps) {
  const [isActive, toggle] = useState(value);

  useEffect(() => toggle(value), [value]);

  return (
    <label className={styles.toggleControl}>
      <input
        type='checkbox'
        checked={isActive}
        onChange={() => {
          toggle(prev => {
            console.log(!prev);
            onChange(!prev);
            return !prev;
          });
        }}
      />
      <span
        className={styles.control}
      />
    </label>
  );
}