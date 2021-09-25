import React, { useEffect, useState } from 'react';
import styles from './switcher.module.scss';

interface SwitcherProps {
  value?: boolean,
  onChange: (isActive: boolean) => void,
}

export default function Switcher({ onChange, value = false }: SwitcherProps) {
  const [isActive, toggle] = useState<boolean>(value);

  useEffect(() => toggle(value), [value]);
  useEffect(() => {
    onChange(isActive);
  }, [isActive]);

  return (
    <label className={styles.toggleControl}>
      <input
        type='checkbox'
        checked={isActive}
        onChange={() => {
          toggle(prev => {
            console.log(!prev);
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