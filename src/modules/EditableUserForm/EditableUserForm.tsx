import React, { useState, useEffect } from 'react';
import CSS from 'csstype';

import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';

import styles from './editableUserForm.module.scss';
import { skipPartiallyEmittedExpressions } from 'typescript';

interface EditableUserFormProps {
  setFormData?: (cb: any) => void,
  saveData?: () => void,
  body?: React.ReactNode,
  footer?: React.ReactNode,
  email: string,
  password: string,
  name: string,
  surname: string,
}

const save = () => {

};

export default function EditableUserForm({
  setFormData,
  saveData,
  body,
  footer,
  email,
  password,
  name = '',
  surname = '',
}: EditableUserFormProps) {
  const [isEditableEmail, toggleEditableEmail] = useState(false);
  const [isEditablePassword, toggleEditablePassword] = useState(false);
  const [errors, setErrors] = useState({
    email: '',
    confirmEmail: '',
    password: '',
    confirmPassword: '',
    name: '',
    surname: '',
  });

  const addonAfterStyle: CSS.Properties = {
    position: 'absolute',
    right: '10px',
    top: 0,
    color: '#0a86f9',
  };

  const editEmail = () => {
    toggleEditableEmail(true);
  };

  const editPassword = () => {
    toggleEditablePassword(true);
  };

  const executeConditionByFieldName = (fieldName: string, confirmFieldValue: string) => {
    const setErrorForEmailOrPassword = (fieldValue: string) => {
      const areFieldsValuesEqual = fieldValue === confirmFieldValue;
      const errorMessage = areFieldsValuesEqual ? 
        '' : `Не совпадает с введённым новым ${fieldName === 'confirmEmail' ? 'email' : 'паролем'}`;

      setErrors((prev) => {
        return {
          ...prev,
          [fieldName]: errorMessage,
        };
      });
    };

    const setErrorForUsername = (fieldValue: string) => {
      if (fieldValue.length === 0) {
        const errorMessage = fieldName === 'name' ? 'Заполните поле для имени' : 'Заполните поле для фамилии';

        setErrors((prev) => {
          return {
            ...prev,
            [fieldName]: errorMessage,
          }
        });
        return;
      }

      setErrors((prev) => {
        return {
          ...prev,
          [fieldName]: '',
        }
      });
    };

    switch (fieldName) {
      case 'confirmEmail':
        setErrorForEmailOrPassword(email);
        break;
      case 'confirmPassword':
        setErrorForEmailOrPassword(password);
        break;
      case 'name':
        setErrorForUsername(name);
        break;
      case 'surname':
        setErrorForUsername(surname);
        break;
    }
  };

  const validateFieldsByValue = (e: any, fieldName: string) => {
    const fieldValue = e.target.value;
    executeConditionByFieldName(fieldName, fieldValue);
  };

  const changeFieldValue = (e: any, fieldName: string) => {
    setFormData &&
    setFormData((prev: any) => {
      return {
        ...prev,
        [fieldName]: e.target.value,
      };
    });
  };

  const validatePasswordLength = (e: any) => {
    const password = e.target.value;

    setErrors((prev) => {
      return {
        ...prev,
        password: password.length < 6 ? 'Пароль должен содержать не менее 6 символов' : '',
      }
    });
  };

  return (
    <div>
      <div className={styles.modalBody}>
        <Input
          type='email'
          value={email}
          placeholder='Новый email'
          disabled={!isEditableEmail}
          fluid
          addonAfter={
            !isEditableEmail &&
            <Button
              type='button'
              background='transparent'
              stylesList={addonAfterStyle}
              onClick={editEmail}
            >
              Изменить email
            </Button>
          }
          onChange={(e: any) => changeFieldValue(e, 'email')}
          classNames={styles.field}
        />
        {
          isEditableEmail &&
          <Input
            type='email'
            placeholder='Подтвердите email'
            fluid
            errorMessage={errors.confirmEmail}
            onBlur={(e: any) => validateFieldsByValue(e, 'confirmEmail')}
            classNames={styles.field}
          />
        }
    
        <Input
          type='password'
          value={password}
          placeholder='Новый пароль'
          disabled={!isEditablePassword}
          fluid
          onBlur={validatePasswordLength}
          onChange={(e: any) => changeFieldValue(e, 'password')}
          errorMessage={errors.password}
          addonAfter={
            !isEditablePassword &&
            <Button
              type='button'
              background='transparent'
              stylesList={addonAfterStyle}
              onClick={editPassword}
            >
              Изменить пароль
            </Button>
          }
          classNames={styles.field}
        />
        {
          isEditablePassword &&
          <Input
            type='password'
            placeholder='Подтвердите пароль'
            fluid
            errorMessage={errors.confirmPassword}
            onBlur={(e: any) => validateFieldsByValue(e, 'confirmPassword')}
            classNames={styles.field}
          />
        }

        <Input
          type='text'
          value={name}
          placeholder='Имя'
          onChange={(e: any) => changeFieldValue(e, 'name')}
          onBlur={(e: any) => validateFieldsByValue(e, 'name')}
          errorMessage={errors.name}
          fluid
          classNames={styles.field}
        />

        <Input
          type='text'
          value={surname}
          placeholder='Фамилия'
          onChange={(e: any) => changeFieldValue(e, 'surname')}
          onBlur={(e: any) => validateFieldsByValue(e, 'surname')}
          errorMessage={errors.surname}
          fluid
          classNames={`${styles.field}`}
        />

        { body }
      </div>

      <div className={styles.modalFooter}>
        <Button
          type='button'
          onClick={saveData}
          stylesList={{ marginBottom: '15px' }}
          fluid
        >
          Сохранить изменения
        </Button>

        { footer }
      </div>
    </div>
  );
}