import React from 'react';
import { mount, shallow } from 'enzyme';
import { findByTestAttr } from 'lib/utils/testUtils';
import ContactField from '../ContactField';
import styles from '../contactField.module.scss';
import Button from '../../Button/Button';
import Input from '../../Input/Input';

const setup = () => {
  return mount(
    <ContactField
      field='email'
      onClick={() => {}}
    />
  );
};

describe('Тестирование ContactField', () => {
  test('ContactField рендерится без ошибки', () => {
    const wrapper = setup();
    const appComponent = findByTestAttr(wrapper, 'contact-field-component');
    expect(appComponent).toHaveLength(1);
  });

  test('При отправке данных, вместо кнопки появляется иконка с галочкой', () => {
    const wrapper = shallow(
      <ContactField
        field='email'
        onClick={() => {}}
      />
    );
    wrapper.find(Button).simulate('click');
    expect(wrapper.find(Button).dive().hasClass(styles.contactSuccessBtn)).toEqual(true);
  });

  test('После отправки данных кнопка с иконкой дизейблится', () => {
    const wrapper = shallow(
      <ContactField
        field='email'
        onClick={() => {}}
      />
    );
    wrapper.find(Button).simulate('click');
    expect(wrapper.find(Button).prop('disabled')).toEqual(true);
  });

  test('При вводе символов в поле, в нем отображаются эти значения', () => {
    const wrapper = shallow(
      <ContactField
        field='email'
        onClick={() => {}}
      />
    );
    wrapper.find(Input).simulate('change', { target: { value: 'hello man' } });
    expect(wrapper.find(Input).prop('value')).toEqual('hello man');
  });
});