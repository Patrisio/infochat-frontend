import React from 'react';

import { Meta } from '@storybook/react';

import Button from './Button';

export default {
  title: 'Components/Button',
  component: Button,
} as Meta;

export const Primary = () => <Button type='submit'>Подключить</Button>;
export const FluidButton = () => (
  <Button
    type='submit'
    fluid
  >
    Подключить
  </Button>
);
export const EditButton = () => (
  <Button
    type='button'
    background='edit'
  >
    Отмена
  </Button>
);
export const ClickButton = () => (
  <Button
    type='button'
    onClick={() => {
      console.log('click event');
    }}
  >
    Кликни на меня
  </Button>
);