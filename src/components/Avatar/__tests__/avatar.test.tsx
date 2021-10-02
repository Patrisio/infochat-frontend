import React from 'react';
import '../../../../setupTests';
import { mount } from 'enzyme';
import { findByTestAttr } from "../../../test/testUtils";
import Avatar from '../Avatar';
import styles from './avatar.module.scss';

const setup = () => {
  return mount(
    <Avatar
      name='Александр Плотников'
      size='small'
    />
  );
};

describe('Тестирование аватарки', () => {
  test('Компонент успешно рендерится', () => {
    const wrapper = setup();
    const appComponent = findByTestAttr(wrapper, 'avatar-component');
    expect(appComponent).toHaveLength(1);
  });

  test('getUserInitials работает корректно', () => {
    const wrapper = setup();
    expect(wrapper.text()).toEqual('АП');
  });

  test('Устанавливается корректный класс по пропсу size', () => {
    const wrapper = setup();
    const appComponent = findByTestAttr(wrapper, 'avatar-component');
    expect(appComponent.hasClass(styles.small)).toEqual(true);
  });
});