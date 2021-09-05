import React, { useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';

import useForm from '../../hooks/useForm';

import { useActions } from '../../hooks/useActions';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';

import styles from './SignUpPage.module.scss';
import validateForm from './validateForm';
import { NotificationContext } from '../../context/NotificationContext';
import { updateToken } from '../../lib/utils/token';

export default function SignUpPage()  {
  const { authSignUp } = useActions();
  const history = useHistory();
  const { notification, updateNotification } = useContext(NotificationContext);

  const signUpUser = async (values: any) => {
    const successCallback = (data: {
      accessToken: string,
      projectId: string,
    }) => {
      updateToken(data.accessToken);

      if (notification.isShow) {
        updateNotification({
          isShow: false,
          text: null,
        });
      }

      history.push(`/project/${data.projectId}/inbox/opened`);
    };
    const errorCallback = (response: any) => {
      updateNotification({
        isShow: true,
        text: response.message,
      });
    };

    authSignUp({
      ...values,
      role: 'owner',
      status: 'active',
      successCallback,
      errorCallback,
    });
  };

  const { handleChange, handleSubmit, errors } = useForm(
    {
      username: '',
      phone: '',
      email: '',
      password: '',
    },
    validateForm,
    signUpUser
  );

  return (
    <div className={styles.formWrapper}>
      <form
        method='POST'
        onSubmit={handleSubmit}
        className={styles.form}
      >
        <h1 className={styles.h1}>Регистрация в InfoChat</h1>
        <Input
          placeholder='Имя и фамилия'
          type='text'
          name='username'
          fluid
          onChange={handleChange}
          errorMessage={errors.username}
          classNames={styles.inputField}
        />
        <Input
          placeholder='Телефон'
          type='phone'
          name='phone'
          fluid
          onChange={handleChange}
          errorMessage={errors.phone}
          classNames={styles.inputField}
        />
        <Input
          placeholder='E-mail'
          type='email'
          name='email'
          fluid
          onChange={handleChange}
          errorMessage={errors.email}
          classNames={styles.inputField}
        />
        <Input
          placeholder='Пароль'
          type='password'
          name='password'
          fluid
          onChange={handleChange}
          errorMessage={errors.password}
          classNames={styles.inputField}
        />
        <Button
          type='submit'
          fluid
        >
          Зарегистрироваться
        </Button>
        <p className={styles.formFooter}>
          Уже есть аккаунт?
          <Link
            to='/signin'
            className={styles.link}
          >
            Войти
          </Link>
        </p>
      </form>
    </div>
  );
}