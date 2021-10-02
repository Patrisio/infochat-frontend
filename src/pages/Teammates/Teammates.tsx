import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router';
import cloneDeep from 'lodash/cloneDeep';

import Title from 'ui/Typography/Title/Title';
import Input from 'ui/Input/Input';
import Button from 'ui/Button/Button';
import Avatar from 'ui/Avatar/Avatar';
import Modal from 'ui/Modal/Modal';
import Table from 'ui/Table/Table';
import Badge from 'ui/Badge/Badge';
import EditableUserForm from 'modules/EditableUserForm/EditableUserForm';

import useForm from 'hooks/useForm';
import { useActions } from 'hooks/useActions';
import { useTypedSelector } from 'hooks/useTypedSelector';

import { generateRandomHash } from 'lib/utils/string';
import { isProjectOwner, Role } from 'lib/utils/accessRights';
import { updateToken } from 'lib/utils/token';

import styles from './teammates.module.scss';
import validateForm from './validateForm';
import { NotificationContext } from 'context/NotificationContext';
import socket from '../../socket';
import { Response } from 'api/types';
import { Teammate } from 'types/teammates';

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

interface InviteTeammate {
  confirmEmail: string,
  confirmPassword: string,
  email: string,
  name: string,
  password: string,
  surname: string,
}

interface CellData {
  id: number,
  email: string
  isOnline: boolean,
  role: Role,
  status: string
  username: string,
  avatar?: string,
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
    addTeammateSaga, deleteTeammate, fetchTeammates,
    updateTeammate, fetchIncomingMessages, remapDialogsToSelectedTeammate,
  } = useActions();

  const { updateNotification } = useContext(NotificationContext);

  const inviteTeammate = (values: InviteTeammate) => {
    addTeammateSaga({
      id: generateRandomHash(),
      email: values.email,
      projectId,
      role: 'operator',
      status: 'pending',
      username: values.email.charAt(0).toUpperCase(),
      errorCallback: (response: Response) => updateNotification({ isShow: true, text: response.message as string }),
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

  const removeTeammate = (email: string) => {
    deleteTeammate({ email, projectId });
  };

  const AttachedDialogsModalFooter = ({ email }: { email: string }) => {
    let selectedTeammateForRemapDialogs: string | null = null;
    const getTeammates = (teammates: Teammate[], email: string) => {
      return teammates
        .filter((teammate) => teammate.email !== email && teammate.status === 'active')
        .map((teammate) => ({
          id: teammate.email,
          value: teammate.username,
        }));
    };
  
    const [formattedTeammates, setTeammates] = useState(getTeammates(teammates, email));

    const filterTeammates = (e: any) => {
      const value = e.target.value.toLowerCase();
      const filteredTeammates = getTeammates(teammates, email)
        .filter((teammate) => teammate.value.toLowerCase().includes(value));

      setTeammates(filteredTeammates);
    };

    return (
      <div className={styles.attachedDialogsConfirmModalFooter}>
        <div className={styles.teammateOptions}>
          <Input
            type='text'
            placeholder='Закрепить диалоги за другим сотрудником'
            data={formattedTeammates}
            fluid
            fixedSelect
            onChange={filterTeammates}
            onSelect={(email: string) => selectedTeammateForRemapDialogs = email}
          />
        </div>
        
        <Button
          type='button'
          classNames={styles.attachedDialogsButton}
          background='delete'
          onClick={() => {
            const remapDialogsToSelectedTeammateData = {
              deletedTeammateEmail: email,
              teammateEmailForRemapDialogs: selectedTeammateForRemapDialogs,
              projectId,
            };
            remapDialogsToSelectedTeammate({
              ...remapDialogsToSelectedTeammateData,
              successCallback: () => {
                removeTeammate(email);
                socket.emit('remapDialogsToSelectedTeammate', remapDialogsToSelectedTeammateData);
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
    );
  };

  const EditableUserFormFooter = ({ role, email }: { role: Role, email: string }) => {
    return !isProjectOwner(role) ?
    (
      <Button
        type='button'
        onClick={() => {
          const hasAttachedDialogs = incomingMessages.filter(incMsg => incMsg.assignedTo === email).length > 0;

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
              footer: <AttachedDialogsModalFooter email={email}/>,
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
      cellComponent: (data: CellData) => (
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
      cellComponent: (data: CellData) => (
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
      cellComponent: (data: CellData) => (
        <div>
          <p className={styles.operatorRole}>{ getRole(data.role) }</p>
        </div>
      ),
    },
    {
      status: 'status',
      key: 'status',
      visible: false,
      cellComponent: (data: CellData) => (
        <div>
          { getStatus(data.status) }
        </div>
      ),
    },
    {
      action: 'action',
      key: 'action',
      visible: false,
      cellComponent: (data: CellData) => (
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
                  saveData={(values) => saveData({ oldEmail: data.email, role: data.role }, values)}
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

  const saveData = ({ oldEmail, role }: { oldEmail: string, role: Role }, values: InviteTeammate) => {
    console.log(values, '__VALLLLL');
    const { name, surname, ...restFormData } = values;
    const username = `${name} ${surname}`;

    updateTeammate({
      ...restFormData,
      username,
      projectId,
      oldEmail,
      role,
      successCallback: (data: {
        code: number,
        status: 'success' | 'error',
        token: string,
      }) => {
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