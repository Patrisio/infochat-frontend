import React, { useContext } from 'react';
import { SidebarContext } from '../../../../context/SidebarContext';
import CSS from 'csstype';
import styles from './sidebarItem.module.scss';

interface SidebarItemProps {
  type?: string,
  name?: string,
  label?: string,
  count?: number,
  icon?: React.ReactNode,
  onClick?: () => void,
  stylesList?: CSS.Properties | undefined,
  mode?: 'light' | 'dark',
}

export default function SidebarItem({
  type, name, label, count, icon,
  onClick, stylesList, mode = 'dark',
}: SidebarItemProps ) {
  const { sidebar, updateSidebar } = useContext(SidebarContext);

  const isActiveSidebarItem = (label: string) => {
    return sidebar[type as string] === label;
  };

  const displayMesssagesCount = Boolean(count && count > 0) && <span className={styles.count}>{count}</span>;

  return (
    <div
      className={`
        ${styles.listItem}
        ${mode === 'light' ? styles.light : styles.dark}
        ${label && isActiveSidebarItem(label) && styles.active}
      `}
      data-label={label}
      onClick={() => {
        if (type) {
          updateSidebar(prev => ({
            ...prev,
            [type]: label as string,
          }));
        }
        onClick!();
      }}
    >
      <div className={styles.iconAndName}>
        {icon}
        <span style={stylesList}>{name}</span>
      </div>
      { displayMesssagesCount }
    </div>
  );
}