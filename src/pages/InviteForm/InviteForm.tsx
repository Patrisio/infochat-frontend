import React, { useEffect } from 'react';
import { useParams } from 'react-router';
import { useDispatch } from 'react-redux';

import useForm from '../../hooks/useForm';

import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';

import styles from './inviteForm.module.scss';
import { authInvite } from '../../actions';
import validateForm from './validateForm';

interface ParamTypes {
  inviteId: string,
  projectId: string
}

export default function InviteForm() {
  let { inviteId, projectId } = useParams<ParamTypes>();
  const dispatch = useDispatch();
  
  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      localStorage.removeItem('token');
    }

    localStorage.setItem('token', inviteId);
  }, []);

  const joinToProject = async (values: any) => {
    const successCallback = (data: any) => {
      if (data.code === 200) {
        window.location.href = `/project/${projectId}/inbox/opened`;
      }
    };

    dispatch(authInvite({
      username: `${values.name} ${values.surname}`,
      password: values.password,
      projectId,
      inviteId,
      successCallback,
    }));
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
        />
        <Input
          placeholder='Фамилия'
          type='text'
          name='surname'
          fluid
          onChange={handleChange}
          errorMessage={errors.surname}
        />
        <Input
          placeholder='Пароль'
          type='password'
          name='password'
          fluid
          onChange={handleChange}
          errorMessage={errors.password}
        />
        <Input
          placeholder='Подтвердите пароль'
          type='password'
          name='confirmPassword'
          fluid
          onChange={handleChange}
          errorMessage={errors.confirmPassword}
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