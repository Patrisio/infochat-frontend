import React, { useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';

import useForm from '../../hooks/useForm';

import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';

import { useActions } from '../../hooks/useActions';
import styles from './SignInPage.module.scss';
import validateForm from './validateForm';
import { NotificationContext } from '../../context/NotificationContext'

export default function SignUpPage()  {
  const { authSignIn } = useActions();
  const history = useHistory();
  const { updateNotification } = useContext(NotificationContext);

  const signInUser = (values: any) => {
    const successCallback = (data: any) => {
      if (localStorage.getItem('token')) {
        localStorage.removeItem('token');
      }

      localStorage.setItem('token', data.accessToken);
      history.push(`/project/${data.projectId}/inbox/opened`);
    };
    const errorCallback = (response: any) => {
      updateNotification({
        isShow: true,
        text: response.message,
      });
    };

    authSignIn({
      ...values,
      successCallback,
      errorCallback,
    });
  };

  const { handleChange, handleSubmit, errors } = useForm(
    {
      email: '',
      password: '',
    },
    validateForm,
    signInUser
  );

  return (
    <div className={styles.formWrapper}>
      <form
        className={styles.form}
        method='POST'
        onSubmit={handleSubmit}
      >
        <h1 className={styles.h1}>Войдите в свой аккаунт</h1>
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
          Войти
        </Button>
        <p className={styles.formFooter}>
          Еще нет аккаунта? 
          <Link
            to='/signup'
            className={styles.link}
          >
            Зарегистрируйтесь
          </Link>
          , это бесплатно!
        </p>
      </form>
    </div>
  );
}