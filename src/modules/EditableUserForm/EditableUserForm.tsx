import React, { useState, useEffect, useContext } from 'react';
import CSS from 'csstype';

import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';

import useForm from '../../hooks/useForm';

import { Context } from '../../context/Context';
import styles from './editableUserForm.module.scss';
import validateForm from './validateForm';

interface EditableUserFormProps {
  setFormData?: (cb: any) => void,
  saveData?: (formData: any) => void,
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

  const { currentUser } = useContext<any>(Context);
  const [userName, userSurname] = currentUser.username.split(' ');

  const { handleChange, handleSubmit, values, errors, setFormValues } = useForm(
    {
      email,
      confirmEmail: '',
      password,
      confirmPassword: '',
      name: name ? name : userName,
      surname: surname ? surname : userSurname,
    },
    validateForm,
    saveData,
    {
      isEditableEmail,
      isEditablePassword,
    },
  );

  const editEmail = () => {
    toggleEditableEmail(true);
  };

  const editPassword = () => {
    toggleEditablePassword(true);
  };

  useEffect(() => {
    setFormValues({
      email,
      confirmEmail: '',
      password,
      confirmPassword: '',
      name: name ? name : userName,
      surname: surname ? surname : userSurname,
    });
  }, [email]);

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className={styles.modalBody}>
        <Input
          type='email'
          name='email'
          value={email}
          placeholder='Новый email'
          disabled={!isEditableEmail}
          fluid
          addonAfter={
            !isEditableEmail &&
            <Button
              type='button'
              background='transparent'
              classNames={styles.changeDataBtn}
              onClick={editEmail}
            >
              Изменить email
            </Button>
          }
          onChange={handleChange}
          classNames={styles.field}
          errorMessage={errors.email}
        />
        {
          isEditableEmail &&
          <Input
            type='email'
            name='confirmEmail'
            placeholder='Подтвердите email'
            fluid
            errorMessage={errors.confirmEmail}
            onChange={handleChange}
            classNames={styles.field}
          />
        }
    
        <Input
          type='password'
          value={password}
          name='password'
          placeholder='Новый пароль'
          disabled={!isEditablePassword}
          fluid
          onChange={handleChange}
          errorMessage={errors.password}
          addonAfter={
            !isEditablePassword &&
            <Button
              type='button'
              background='transparent'
              classNames={styles.changeDataBtn}
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
            name='confirmPassword'
            placeholder='Подтвердите пароль'
            fluid
            errorMessage={errors.confirmPassword}
            onChange={handleChange}
            classNames={styles.field}
          />
        }

        <Input
          type='text'
          value={name}
          name='name'
          placeholder='Имя'
          onChange={handleChange}
          errorMessage={errors.name}
          fluid
          classNames={styles.field}
        />

        <Input
          type='text'
          value={surname}
          name='surname'
          placeholder='Фамилия'
          onChange={handleChange}
          errorMessage={errors.surname}
          fluid
          classNames={`${styles.field}`}
        />

        { body }
      </div>

      <div className={styles.modalFooter}>
        <Button
          type='submit'
          classNames={styles.saveBtn}
          fluid
        >
          Сохранить изменения
        </Button>

        { footer }
      </div>
    </form>
  );
}