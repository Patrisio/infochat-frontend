import React from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import useForm from '../../hooks/useForm';

import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';

import { authSignIn } from '../../actions';
import styles from './SignInPage.module.scss';
import validateForm from './validateForm';

export default function SignUpPage()  {
  const dispatch = useDispatch();

  const signInUser = (values: any) => {
    const successCallback = (data: any) => {
      if (localStorage.getItem('token')) {
        localStorage.removeItem('token');
      }

      localStorage.setItem('token', data.accessToken);
      window.location.href = `/project/${data.projectId}/inbox/opened`;
    };

    dispatch(authSignIn({
      ...values,
      successCallback,
    }));
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