import React from 'react';
import { Link, useHistory } from 'react-router-dom';

import useForm from '../../hooks/useForm';

import { useActions } from '../../hooks/useActions';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';

import styles from './SignUpPage.module.scss';
import validateForm from './validateForm';

export default function SignUpPage()  {
  const { authSignUp } = useActions();
  const history = useHistory();

  const signUpUser = async (values: any) => {
    const successCallback = (data: {
      accessToken: string,
      projectId: string,
    }) => {
      if (localStorage.getItem('token')) {
        localStorage.removeItem('token');
      }

      localStorage.setItem('token', data.accessToken);
      history.push(`/project/${data.projectId}/inbox/opened`);
    };

    authSignUp({
      ...values,
      role: 'owner',
      status: 'active',
      successCallback,
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
          placeholder='Имя'
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