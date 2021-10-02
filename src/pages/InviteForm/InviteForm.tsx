import React, { useEffect } from 'react';
import { useParams, useHistory } from 'react-router';

import useForm from 'hooks/useForm';
import { useActions } from 'hooks/useActions';

import Input from 'ui/Input/Input';
import Button from 'ui/Button/Button';

import styles from './inviteForm.module.scss';
import validateForm from './validateForm';
import { updateToken } from 'lib/utils/token';
import socket from '../../socket';
import { Response } from 'api/types';

interface ParamTypes {
  inviteId: string,
  projectId: string
}

export default function InviteForm() {
  let { inviteId, projectId } = useParams<ParamTypes>();
  const { authInvite, decodeJwt } = useActions();
  const history = useHistory();
  
  useEffect(() => {
    updateToken(inviteId);
  }, []);

  const joinToProject = async (values: {
    confirmPassword: string,
    name: string,
    password: string,
    surname: string,
  }) => {
    const username = `${values.name} ${values.surname}`;

    const successCallback = (data: Response) => {
      if (data.statusCode === 200) {
        decodeJwt({
          token: inviteId,
          successCallback: (decodeToken: {
            email: string,
            iat: number,
            exp: number,
          }) => {
            console.log(decodeToken, 'decodeToken');
            socket.emit('setActiveTeammateStatus', {
              username,
              email: decodeToken.email,
            });
            history.push(`/project/${projectId}/inbox/opened`);
          },
        });
      }
    };

    authInvite({
      username,
      password: values.password,
      projectId,
      inviteId,
      successCallback,
    });
  };

  const { handleChange, handleSubmit, errors } = useForm(
    {
      name: '',
      surname: '',
      password: '',
      confirmPassword: '',
    },
    validateForm,
    joinToProject
  );

  return (
    <div className={styles.formWrapper}>
      <form
        method='POST'
        onSubmit={handleSubmit}
        className={styles.form}
      >
        <h1 className={styles.h1}>Добро пожаловать в InfoChat</h1>
        <Input
          placeholder='Имя'
          type='text'
          name='name'
          fluid
          onChange={handleChange}
          errorMessage={errors.name}
          classNames={styles.field}
        />
        <Input
          placeholder='Фамилия'
          type='text'
          name='surname'
          fluid
          onChange={handleChange}
          errorMessage={errors.surname}
          classNames={styles.field}
        />
        <Input
          placeholder='Пароль'
          type='password'
          name='password'
          fluid
          onChange={handleChange}
          errorMessage={errors.password}
          classNames={styles.field}
        />
        <Input
          placeholder='Подтвердите пароль'
          type='password'
          name='confirmPassword'
          fluid
          onChange={handleChange}
          errorMessage={errors.confirmPassword}
          classNames={styles.field}
        />
        <Button
          type='submit'
          fluid
        >
          Присоединиться к проекту
        </Button>
      </form>
    </div>
  );
}