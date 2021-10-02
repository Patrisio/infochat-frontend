import React from 'react';
import { mount, shallow } from 'enzyme';
import { findByTestAttr } from 'lib/utils/testUtils';
import Accordion from '../Accordion';
import Panel from '../components/Panel/Panel';
import styles from '../accordion.module.scss';

interface Panel {
  title: string,
  count: number | undefined | null,
  content: React.ReactElement,
  isVisible: boolean,
}

const panels: Panel[] = [
  {
    title: 'Основное',
    count: null,
    isVisible: true,
    content: <div>erfe</div>,
  },
  {
    title: 'Основное',
    count: null,
    isVisible: true,
    content: <div>657687</div>,
  },
  {
    title: 'Основное',
    count: null,
    isVisible: true,
    content: <div>alohaaaaaaa</div>,
  }
];

const setup = () => {
  return mount(<Accordion panels={panels} />);
};

describe('Тестирование аккордиона', () => {
  test('Компонент успешно рендерится', () => {
    const wrapper = setup();
    const appComponent = findByTestAttr(wrapper, 'accordion-component');
    expect(appComponent).toHaveLength(1);
  });

  test('Рендерится 3 panels', () => {
    const wrapper = setup();
    expect(wrapper.find('.accordion').length).toEqual(3);
  });

  test('Панель аккордиона закроется/откроется при клике на хедер панели', () => {
    const wrapper = mount(
      <Panel
        title='Основное'
        count={null}
        content={<div>erfe</div>}
      />
    );

    wrapper.find('.accordionHeader').simulate('click');
    expect(wrapper.find('.accordionBody').length).toEqual(0);

    wrapper.find('.accordionHeader').at(0).simulate('click');
    expect(wrapper.find('.accordionBody').length).toEqual(1);
  });
});