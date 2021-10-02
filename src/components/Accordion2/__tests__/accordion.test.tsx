import React from 'react';
import { mount, shallow } from 'enzyme';
import { findByTestAttr } from "../../../test/testUtils";
import Accordion from '../Accordion2';
import install from '../../../assets/install.svg';

const panels = [
  {
    imageSrc: install,
    label: 'Установите чат на сайт',
    content: <div />,
  },
  {
    imageSrc: install,
    label: 'Установите чат на сайт',
    content: <div />,
  },
  {
    imageSrc: install,
    label: 'Установите чат на сайт',
    content: <div />,
  },
];

const setup = () => {
  return mount(<Accordion panels={panels} />);
};

describe('Тестирование аккордиона', () => {
  test('Компонент успешно рендерится', () => {
    const wrapper = setup();
    const appComponent = findByTestAttr(wrapper, 'accordion2-component');
    expect(appComponent).toHaveLength(1);
  });

  test('Рендерится три panels', () => {
    const wrapper = setup();
    expect(wrapper.find('.panel').length).toEqual(3);
  });
});