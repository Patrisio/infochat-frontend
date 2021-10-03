import React from 'react';

import { Meta } from '@storybook/react';

import Accordion from './Accordion';
import Accordion2 from 'ui/Accordion2/Accordion2';
import install from 'assets/install.svg';
import style from 'assets/style.svg';
import operators from 'assets/operators.svg';

export default {
  title: 'Components/Accordion',
  component: Accordion,
} as Meta;

const accordionPanels = [
  {
    title: 'Основное',
    count: null,
    isVisible: true,
    content: <div>test #1</div>,
  },
  {
    title: 'Назначить на',
    count: null,
    isVisible: true,
    content: <div>test #2</div>,
  },
  {
    title: 'Заметки',
    count: 5,
    isVisible: true,
    content: <div>test #3</div>,
  },
  {
    title: 'История изменений',
    count: 7,
    isVisible: true,
    content: <div>test #4</div>,
  },
];

const accordion2Panels = [
  {
    imageSrc: install,
    label: 'Установите чат на сайт',
    content: <div>test #1</div>,
  },
  {
    imageSrc: style,
    label: 'Основные настройки',
    content: <div>test #2</div>,
  },	
  {
    imageSrc: operators,
    label: 'Операторы',
    content: <div>test #2</div>,
  },
];

export const AccordionPersonInfo = () => (
  <Accordion panels={accordionPanels} />
);

export const AccordionChannelsSettings = () => (
  <Accordion2 panels={accordion2Panels} />
);