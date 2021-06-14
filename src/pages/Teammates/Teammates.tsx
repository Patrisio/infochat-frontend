import React, { useState, useEffect } from 'react';

import CSS from 'csstype';
import { useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { Location } from 'history';

import Title from '../../components/Typography/Title/Title';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import Avatar from '../../components/Avatar/Avatar';
import Modal from '../../components/Modal/Modal';
import Table from '../../components/Table/Table';
import EditableUserForm from '../../modules/EditableUserForm/EditableUserForm';

import styles from './teammates.module.scss';
import { generateRandomHash } from '../../utils/string';
import { addTeammate, deleteTeammate, fetchTeammates } from '../../actions';

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

export default function Teammates() {
  const [isModalEditTeammateShow, setStateModal] = useState(false);

  let { projectId } = useParams<IParams>();
  const teammates = useSelector((state: RootState) => state.teammates.teammates);
  
  const dispatch = useDispatch();

  const inviteTeammate = (e: React.SyntheticEvent) => {
    e.preventDefault();

    const target = e.target as typeof e.target & {
      email: { value: string },
    };
    const email = target.email.value;

    dispatch(addTeammate({
      id: generateRandomHash(),
      email,
      projectId,
      role: 'operator',
      status: 'pending',
      username: email.charAt(0).toUpperCase()
    }));
  };

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
          onClick={() => removeTeammate(data.email)}
        >
          Удалить
        </Button>
        :
        <Button
          type='button'
          size='small'
          background='edit'
          onClick={() => setStateModal(true)}
        >
          Изменить
        </Button>
      ),
    },
  ];

  return (
    <div className={styles.teammateContainer}>
      <Title level='1' weight='bold'>Сотрудники</Title>

      <form
        method='POST'
        onSubmit={inviteTeammate}
        className={styles.inviteTeammateContainer}
      >
        <Input
          type='text'
          placeholder='Чтобы пригласить нового сотрудника, введите его email'
          width={'550px'}
          name='email'
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
        show={isModalEditTeammateShow}
        title='Настройка профиля'
        body={
          <></>
          // <EditableUserForm
          //   saveData={saveData}
          //   setFormData={setFormData}
          //   email={formData.email}
          //   password={formData.password}
          //   name={formData.name}
          //   surname={formData.surname}
          //   footer={<EditableUserFormFooter />}
          // />
        }
        onClose={() => {
          setStateModal(false);
        }}
        width='498px'
      />
    </div>
  );
}