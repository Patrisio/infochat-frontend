import React, { useState, useEffect } from 'react';

import CSS from 'csstype';
import { useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { Location } from 'history';

import useForm from '../../hooks/useForm';

import Title from '../../components/Typography/Title/Title';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import Avatar from '../../components/Avatar/Avatar';
import Modal from '../../components/Modal/Modal';
import Table from '../../components/Table/Table';
import EditableUserForm from '../../modules/EditableUserForm/EditableUserForm';

import styles from './teammates.module.scss';
import { generateRandomHash } from '../../utils/string';
import { addTeammate, deleteTeammate, fetchTeammates, updateTeammate } from '../../actions';
import validateForm from './validateForm';
import cloneDeep from 'lodash/cloneDeep';

interface Teammate {
  id: string,
  username: string,
  phone: string,
  email: string,
  avatar: string,
  role: string,
  status: string,
}

interface IParams {
  projectId: string,
}

interface Teammate {
  [key: string]: string
}

interface RootState {
  teammates: {
    teammates: Teammate[]
  }
}

interface ModalProps {
  show: boolean,
  title: string,
  body: React.ReactElement | null,
  footer: React.ReactElement | null,
  onClose: () => void,
  width: string,
  height?: string,
  errors?: any,
}

export default function Teammates() {
  const [currentModal, setModalProps] = useState<ModalProps>({
    show: false,
    title: '',
    body: null,
    footer: null,
    onClose: () => setModalProps(Object.assign(currentModal, { show: false })),
    width: '',
    height: '',
  });
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    surname: '',
    password: '',
  });

  let { projectId } = useParams<IParams>();
  const teammates = useSelector((state: RootState) => state.teammates.teammates);

  const buttonStyles = {
    padding: '9px 30px 10px',
    fontSize: '13px',
    fontWeight: 400,
  };
  
  const dispatch = useDispatch();

  const inviteTeammate = (values: any) => {
    dispatch(addTeammate({
      id: generateRandomHash(),
      email: values.email,
      projectId,
      role: 'operator',
      status: 'pending',
      username: values.email.charAt(0).toUpperCase()
    }));
    setFormValues({});
  };

  const { handleChange, handleSubmit, setFormValues, values, errors } = useForm(
    { email: '' },
    validateForm,
    inviteTeammate,
  );

  const getRole = (role: string) => {
    return role === 'owner' ? 'Владелец' : 'Оператор';
  };

  const getStatus = (status: string) => {
    switch (status) {
      case 'active':
        return <p className={`${styles.operatorRole} ${styles.active}`}>Активен</p>
      case 'pending':
        return <p className={`${styles.operatorRole} ${styles.pending}`}>Ожидание</p>
      case 'notPaid':
        return <p className={`${styles.operatorRole} ${styles.notPaid}`}>Не оплачен</p>
    }
  };

  const removeTeammate = (email: string) => {
    dispatch(deleteTeammate({ email, projectId }));
  };

  const save = () => {
    console.log('SAVE');
  };

  const EditableUserFormFooter = () => {
    return (
      <Button
        type='button'
        onClick={() => {
          // removeTeammate(data.email);
          console.log('DELETE');
        }}
        background='transparent'
        fluid
      >
        Удалить
      </Button>
    );
  };

  const DeleteTeammateModalFooter = ({ email }: { email: string }) => {
    return (
      <div className={styles.confirmModalFooter}>
        <Button
          type='button'
          stylesList={{ marginRight: '10px', ...buttonStyles }}
          background='edit'
          onClick={() => currentModal.onClose()}
        >
          Отмена
        </Button>

        <Button
          type='button'
          stylesList={{ ...buttonStyles }}
          onClick={() => {
            currentModal.onClose();
            removeTeammate(email);
          }}
        >
          Удалить
        </Button>
      </div>
    );
  };

  useEffect(() => {
    dispatch(fetchTeammates({ projectId }));
  }, []);

  const columns = [
    {
      avatar: 'avatar',
      key: 'avatar',
      visible: false,
      cellComponent: (data: any) => (
        data.avatar ?
        <img
          src={data.avatar}
          alt="avatar"
          className={styles.operatorAvatar}
        /> :
        <Avatar
          name={data.username}
          size='large'
        />
      ),
    },
    {
      name: 'name',
      key: 'name',
      visible: false,
      cellComponent: (data: any) => (
        <div className={styles.operatorNameEmail}>
          <p className={styles.operatorName}>{ data.username }</p>
          <p className={styles.operatorEmail}>{ data.email }</p>
        </div>
      ),
    },
    {
      role: 'role',
      key: 'role',
      visible: false,
      cellComponent: (data: any) => (
        <div>
          <p className={styles.operatorRole}>{ getRole(data.role) }</p>
        </div>
      ),
    },
    {
      status: 'status',
      key: 'status',
      visible: false,
      cellComponent: (data: any) => (
        <div>
          { getStatus(data.status) }
        </div>
      ),
    },
    {
      action: 'action',
      key: 'action',
      visible: false,
      cellComponent: (data: any) => (
        data.status === 'pending' ?
        <Button
          type='button'
          size='small'
          background='delete'
          onClick={() => {
            setModalProps({
              show: true,
              title: 'Настройка профиля',
              body: (
                <div className={styles.confirmModalBody}>
                  Вы действительно хотите удалить этого сотрудника?
                </div>
              ),
              footer: (
                <DeleteTeammateModalFooter
                  email={data.email}
                />
              ),
              onClose: () => setModalProps(prev => cloneDeep(Object.assign(prev, { show: false }))),
              width: '498px',
            });
          }}
        >
          Удалить
        </Button>
        :
        <Button
          type='button'
          size='small'
          background='edit'
          onClick={() => {
            const [name, surname] = data.username.split(' ');

            setModalProps({
              show: true,
              title: 'Настройка профиля',
              body: (
                <EditableUserForm
                  saveData={saveData}
                  setFormData={setFormData}
                  email={data.email}
                  password={'fakePassword123'}
                  name={name}
                  surname={surname}
                  footer={<EditableUserFormFooter />}
                />
              ),
              footer: null,
              onClose: () => setModalProps(prev => cloneDeep(Object.assign(prev, { show: false }))),
              width: '498px',
            });
          }}
        >
          Изменить
        </Button>
      ),
    },
  ];

  const saveData = (values: any) => {
    const { name, surname, ...restFormData } = values;
    const username = `${name} ${surname}`;

    dispatch(updateTeammate({
      ...restFormData,
      username,
      projectId,
      successCallback: () => {
        currentModal.onClose();
      },
    }));
  };

  return (
    <div className={styles.teammateContainer}>
      <Title level='1' weight='bold'>Сотрудники</Title>
      <form
        method='POST'
        onSubmit={handleSubmit}
        className={styles.inviteTeammateContainer}
      >
        <Input
          type='text'
          placeholder='Чтобы пригласить нового сотрудника, введите его email'
          width={'550px'}
          name='email'
          value={values.email}
          errorMessage={errors.email}
          onChange={handleChange}
        />
        <Button
          type='submit'
          size='large'
        >
          Пригласить
        </Button>
      </form>

      <Table
        columns={columns}
        data={teammates}
      />

      <Modal
        { ...currentModal }
      />
    </div>
  );
}