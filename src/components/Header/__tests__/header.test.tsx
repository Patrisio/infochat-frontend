import React from 'react';
import { mount, shallow } from 'enzyme';
import { findByTestAttr } from '../../../test/testUtils';
import Header from '../Header';
import styles from '../contactField.module.scss';
import Button from '../../Button/Button';
import Input from '../../Input/Input';
import { updateTeammate } from '../../../store/actions-creators/teammates';
import { TeammatesActionTypes, TeammatesAction } from '../../../types/teammates';
import {
  TeammateAddPayload, RemoveTeammatePayload, TeammateUpdatePayload,
  GetTeammatesPayload, TeammateUpdateSaga,
} from '../../../api/types';

describe('Тестирование Header', () => {
  test('Должен создать экшен обновления данных сотрудника', () => {
    const payload = {
      projectId: '123',
      oldEmail: 'email@test.com',
      isOnline: true,
    };
    const expectedAction = {
      type: TeammatesActionTypes.TEAMMATE_UPDATE,
      payload,
    };

    expect(updateTeammate(payload)).toEqual(expectedAction);
  });
});