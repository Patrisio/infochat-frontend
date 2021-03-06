import React from 'react';
import CSS from 'csstype';

import styles from './sidebarList.module.scss';
import SidebarItem from '../SidebarItem/SidebarItem';

interface SidebarListProps {
  type?: string,
  title?: string | React.ReactNode,
  listItems: any,
  mode?: 'light' | 'dark',
}

interface Item {
  name: string,
  label: string,
  count?: number,
  icon?: React.ReactNode,
  stylesList?: CSS.Properties | undefined,
  onClick?: () => void,
}

export default function SidebarList({ type, title, listItems, mode = 'dark' }: SidebarListProps ) {
  return (
    <div className={styles.sidebarListContainer}>
      {
        title &&
        <span>{ title }</span>
      }
      
      {
        listItems.map((item: Item, idx: number) => {
          return (
            <SidebarItem
              key={idx}
              type={type}
              mode={mode}
              onClick={item.onClick}
              name={item.name}
              label={item.label}
              count={item.count}
              icon={item.icon}
              stylesList={item.stylesList}
            />
          );
        })
      }
    </div>
  );
}