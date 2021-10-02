import React, { useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';

import useForm from 'hooks/useForm';
import { useActions } from 'hooks/useActions';

import Input from 'ui/Input/Input';
import Button from 'ui/Button/Button';

import styles from './SignInPage.module.scss';
import validateForm from './validateForm';
import { NotificationContext } from '../../context/NotificationContext';
import { updateToken } from 'lib/utils/token';
import { Response } from '../../api/types';

export default function SignUpPage()  {
  const { authSignIn } = useActions();
  const history = useHistory();
  const { updateNotification } = useContext(NotificationContext);

  const signInUser = (values: { email: string, password: string }, activateCallback: () => void) => {
    const successCallback = (data: { accessToken: string, projectId: number }) => {
      updateToken(data.accessToken);
      activateCallback();
      history.push(`/project/${data.projectId}/inbox/opened`);
    };
    const errorCallback = (response: Response) => {
      updateNotification({
        isShow: true,
        text: response.message as string,
      });
      activateCallback();
    };

    authSignIn({
      ...values,
      successCallback,
      errorCallback,
    });
  };

  const { handleChange, handleSubmit, errors, isSubmitting } = useForm(
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
          disabled={isSubmitting}
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