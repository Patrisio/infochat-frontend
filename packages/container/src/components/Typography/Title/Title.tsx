import React, { AllHTMLAttributes, ElementType } from 'react';
import styles from './title.module.scss';

interface TitleProps extends AllHTMLAttributes<HTMLElement> {
  weight: 'heavy' | 'bold' | 'semibold' | 'medium' | 'regular';
  level: '1' | '2' | '3' | '4';
  Component?: ElementType;
  classNames?: string,
}

export default function Title({ Component, children, level, weight, classNames }: TitleProps) {
  const getComponent = (level: TitleProps['level']): ElementType => {
    if (!level) {
      return 'div';
    }
  
    return ('h' + level) as ElementType;
  };

  const TitleComponent = Component || getComponent(level);

  return (
    <TitleComponent
      className={`
        ${styles.title}
        ${styles[`Title--w-${weight}`]}
        ${styles[`Title--l-${level}`]}
        ${classNames}
      `}
    >
      { children }
    </TitleComponent>
  );
}