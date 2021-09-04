import React, { useState, useEffect } from 'react';

import { useParams } from 'react-router';

import useForm from '../../hooks/useForm';

import Title from '../../components/Typography/Title/Title';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import Avatar from '../../components/Avatar/Avatar';
import Modal from '../../components/Modal/Modal';
import Table from '../../components/Table/Table';
import EditableUserForm from '../../modules/EditableUserForm/EditableUserForm';

import { useActions } from '../../hooks/useActions';
import { useTypedSelector } from '../../hooks/useTypedSelector';

import styles from './teammates.module.scss';
import { generateRandomHash } from '../../utils/string';
import { isProjectOwner, Role } from '../../lib/utils/accessRights';
import validateForm from './validateForm';
import cloneDeep from 'lodash/cloneDeep';
import Badge from '../../components/Badge/Badge';
import { updateToken } from '../../lib/utils/token';

interface IParams {
  projectId: string,
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
  const { teammates } = useTypedSelector(state => state.teammates);
  const { incomingMessages } = useTypedSelector(state => state.inbox);
  
  const {
    addTeammate, deleteTeammate, fetchTeammates,
    updateTeammate, fetchIncomingMessages, remapDialogsToSelectedTeammate,
  } = useActions();

  const inviteTeammate = (values: any) => {
    addTeammate({
      id: generateRandomHash(),
      email: values.email,
      projectId,
      role: 'operator',
      status: 'pending',
      username: values.email.charAt(0).toUpperCase()
    });
    setFormValues({});
  };

  const { handleChange, handleSubmit, setFormValues, values, errors } = useForm(
    { email: '' },
    validateForm,
    inviteTeammate,
  );

  const getRole = (role: Role) => {
    return isProjectOwner(role)? 'Владелец' : 'Оператор';
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

  const formattedTeammates = (email: string) => {
    return teammates
      .filter((teammate) => teammate.email !== email && teammate.status === 'active')
      .map((teammate) => ({
        id: teammate.email,
        value: teammate.username,
      }));
  };

  const removeTeammate = (email: string) => {
    deleteTeammate({ email, projectId });
  };

  const save = () => {
    console.log('SAVE');
  };

  const EditableUserFormFooter = ({ role, email }: { role: Role, email: string }) => {
    let selectedTeammateForRemapDialogs: string | number | null = null;

    return !isProjectOwner(role) ?
    (
      <Button
        type='button'
        onClick={() => {
          // removeTeammate(data.email);
          console.log('DELETE');
          console.log(incomingMessages, 'incomingMessages');
          console.log(email, 'email');
          

          const hasAttachedDialogs = incomingMessages.filter(incMsg => incMsg.assignedTo === email).length > 0;
          console.log(hasAttachedDialogs, 'hasAttachedDialogs');
          if (hasAttachedDialogs) {
            setModalProps({
              show: true,
              title: 'Удалить профиль сотрудника',
              body: (
                <div
                  className={`
                    ${styles.confirmModalBodyAttachedDialogs}
                    ${styles.modalBodyContainer}
                  `}
                >
                  У удаляемого сотрудника есть прикрепленные диалоги. Выберите другого сотрудника, чтобы закрепить за ним эти диалоги или не выбирайте, чтобы диалоги стали общими.
                </div>
              ),
              footer: (
                <div className={styles.attachedDialogsConfirmModalFooter}>
                  <div className={styles.teammateOptions}>
                    <Input
                      type='text'
                      placeholder='Закрепить диалоги за другим сотрудником'
                      data={formattedTeammates(email)}
                      readOnly
                      fluid
                      fixedSelect
                      onSelect={(email: string | number) => selectedTeammateForRemapDialogs = email}
                    />
                  </div>
                  
                  <Button
                    type='button'
                    classNames={styles.attachedDialogsButton}
                    background='delete'
                    onClick={() => {
                      remapDialogsToSelectedTeammate({
                        deletedTeammateEmail: email,
                        teammateEmailForRemapDialogs: selectedTeammateForRemapDialogs,
                        projectId,
                        successCallback: () => {
                          removeTeammate(email);
                          currentModal.onClose();
                        },
                      });
                    }}
                  >
                    Удалить профиль сотрудника
                  </Button>
  
                  <Button
                    type='button'
                    classNames={`${styles.marginTop} ${styles.attachedDialogsButton}`}
                    background='edit'
                    onClick={() => currentModal.onClose()}
                  >
                    Отмена
                  </Button>
                </div>
              ),
              onClose: () => {
                setModalProps(prev => cloneDeep(Object.assign(prev, { show: false })));
              },
              width: '498px',
            });

            return;
          }

          removeTeammate(email);
          setModalProps(prev => cloneDeep(Object.assign(prev, { show: false })));
        }}
        background='transparent'
        fluid
      >
        Удалить
      </Button>
    ) : null;
  };

  const DeleteTeammateModalFooter = ({ email }: { email: string }) => {
    return (
      <div className={styles.confirmModalFooter}>
        <Button
          type='button'
          classNames={`${styles.marginRight} ${styles.button}`}
          background='edit'
          onClick={() => currentModal.onClose()}
        >
          Отмена
        </Button>

        <Button
          type='button'
          classNames={styles.button}
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
    fetchTeammates({ projectId });
    fetchIncomingMessages({ projectId });
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
          alt='avatar'
          className={styles.operatorAvatar}
        /> :
        <Badge color={data.isOnline ? styles.isOnline : styles.isOffline}>
          <Avatar
            name={data.username}
            size='large'
          />
        </Badge>
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
                  saveData={(values: any) => saveData({ oldEmail: data.email, role: data.role }, values)}
                  setFormData={setFormData}
                  email={data.email}
                  password={'fakePassword123'}
                  name={name}
                  surname={surname}
                  footer={
                    <EditableUserFormFooter
                      role={data.role}
                      email={data.email}
                    />
                  }
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

  const saveData = ({ oldEmail, role }: { oldEmail: string, role: string }, values: any) => {
    const { name, surname, ...restFormData } = values;
    console.log(values, 'UP__');
    const username = `${name} ${surname}`;

    updateTeammate({
      ...restFormData,
      username,
      projectId,
      oldEmail,
      role,
      successCallback: (data: any) => {
        const token = data.token;
        if (token && role === 'owner') {
          updateToken(token);
        }

        currentModal.onClose();
      },
    });
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
          classNames={styles.teammateEmailField}
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