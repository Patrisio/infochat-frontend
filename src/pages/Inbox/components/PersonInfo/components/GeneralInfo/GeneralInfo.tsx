import React, { useState, useEffect } from 'react';

import Input from '../../../../../../components/Input/Input';

import styles from './generalInfo.module.scss';
import cloneDeep from 'lodash/cloneDeep';
import { State } from '../../../../../../reducers/inbox';

interface GeneralInfoItem {
  name: string,
  field: string,
  value: string,
  isEditable: boolean,
}

interface GeneralInfoProps {
  selectedClient: State['selectedClient'],
  updateClientData: (e: any, fieldName: string) => void,
}

export default function GeneralInfo({ selectedClient, updateClientData }: GeneralInfoProps) {
  let fieldInitialValue: string | null = '';
  const defaultGeneralInfo = [
    {
      name: 'Телефон',
      field: 'phone',
      value: 'Добавить',
      isEditable: true,
    },
    {
      name: 'E-mail',
      field: 'email',
      value: 'Добавить',
      isEditable: true,
    },
  ];

  const [generalInfo, setGeneralInfo] = useState<GeneralInfoItem[]>(defaultGeneralInfo);

  const saveInitialFieldValue = (e: any) => {
    const target = e.target;
    fieldInitialValue = target.value;
  };

  const changeField = (fieldValue: string, fieldEntity: any) => {
    setGeneralInfo((prev: any) => {
      const copy = cloneDeep(prev);
      const foundItem = copy.find((item: any) => item.field === fieldEntity.field);
      const foundItemIndex = copy.findIndex((item: any) => item.field === fieldEntity.field);

      foundItem.value = fieldValue;
      copy.splice(foundItemIndex, 1, foundItem);

      return copy;
    });
  };

  useEffect(() => {
    const generalClientData = generalInfo.reduce((acc: GeneralInfoItem[], field: GeneralInfoItem) => {
      if (field.field === 'phone') {
        field.value = selectedClient.phone || '';
      }

      if (field.field === 'email') {
        field.value = selectedClient.email || '';
      }
      
      return acc.concat(field);
    }, []);

    setGeneralInfo(generalClientData);
  }, [selectedClient.clientId]);

  return (
    <ul className={styles.generalList}>
      {
        generalInfo.map((field, idx) => {
          return (
            <li
              key={idx}
              className={styles.generalListItem}
            >
              <span className={styles.nameField}>{field.name}:</span>
              <Input
                type='text'
                placeholder='Добавить'
                value={field.value}
                classNames={styles.valueField}
                onBlur={(e) => updateClientData(e, field.field)}
                onFocus={() => saveInitialFieldValue}
                onChange={(e) => changeField(e.target.value, field)}
              />
            </li>
          );
        })
      }
    </ul>
  );
}