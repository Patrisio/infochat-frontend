import React, { useState, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';

import InboxSidebar from '../Inbox/components/InboxSidebar/InboxSidebar';
import Title from '../../components/Typography/Title/Title';
import Header from '../../components/Header/Header';
import Modal from '../../components/Modal/Modal';
import Table from '../../components/Table/Table';
import Button from '../../components/Button/Button';
import Input from '../../components/Input/Input';

import useForm from '../../hooks/useForm';

import { Context } from '../../context/Context';
import { getAllInboxMessages } from '../../lib/utils/messages';
import cloneDeep from 'lodash/cloneDeep';
import { addProject } from '../../actions';
import { getTimezones, getTimezoneByCode, DEFAULT_TIME_ZONE } from '../../lib/utils/date';
import styles from './projects.module.scss';
import validateForm from './validateForm';

interface ModalProps {
  show: boolean,
  title: string,
  body: React.ReactElement | null,
  footer: React.ReactElement | null,
  onClose: () => void,
  width: string,
  height?: string,
}

export default function Projects() {
  const incomingMessages = useSelector((state: any) => state.inbox.incomingMessages);

  const [currentModal, setModalProps] = useState<ModalProps>({
    show: false,
    title: '',
    body: null,
    footer: null,
    onClose: () => setModalProps(Object.assign(currentModal, { show: false })),
    width: '',
    height: '',
  });

  const dispatch = useDispatch();
  const { currentUser, setCurrentUser } = useContext<any>(Context);
  const history = useHistory();

  const inboxMessages = getAllInboxMessages(incomingMessages, currentUser);
  const timezones = getTimezones();

  const columns = [
    {
      key: 'name',
      visible: true,
      headerComponent: (data: any) => (
        <Button
          type='button'
          background='transparent'
          stylesList={{
            fontSize: '14px',
            fontWeight: 500,
            color: '#0a86f9',
            padding: '0',
          }}
          onClick={() => {
            setModalProps({
              show: true,
              title: 'Добавить новый проект',
              body: <ModalBody />,
              footer: null,
              onClose: () => setModalProps(prev => cloneDeep(Object.assign(prev, { show: false }))),
              width: '520px',
            });
          }}
        >
          Добавить новый проект
        </Button>
      ),
      cellComponent: (data: any) => (
        <div className={styles.projectName}>
          {data.name}
        </div>
      ),
    },
    {
      key: 'teammates',
      visible: false,
      cellComponent: (data: any) => (
        <div className={styles.teammatesCount}>
          {`${data.teammatesCount} сотрудников`}
        </div>
      ),
    },
    {
      key: 'action',
      visible: true,
      headerComponent: (data: any) => (
        <Button
          type='button'
          background='edit'
          stylesList={{
            background: '#fff',
            color: '#0a86f9',
            fontWeight: 400,
            padding: '10px',
            fontSize: '13px',
          }}
          onClick={() => {
            setModalProps({
              show: true,
              title: 'Добавить новый проект',
              body: <ModalBody />,
              footer: null,
              onClose: () => setModalProps(prev => cloneDeep(Object.assign(prev, { show: false }))),
              width: '520px',
            });
          }}
        >
          + Новый
        </Button>
      ),
      cellComponent: (data: any) => (
        <Button
          type='button'
          background='edit'
          stylesList={{
            fontWeight: 500,
            fontSize: '13px',
            padding: '10px 14px',
          }}
          onClick={() => {
            history.push(`/project/${data.id}/settings/channels`)
          }}
        >
          Изменить
        </Button>
      ),
    },
  ];

  const ModalBody = () => {
    const [timezone, setTimezone] = useState<string>(DEFAULT_TIME_ZONE);

    const createNewProject = (values: any) => {
      const updateCurrentUser = (data: any) => {
        setCurrentUser((prev: any) => {
          const newProject = {
            id: data.id,
            name: values.projectName,
            teammatesCount: 1,
          };

          return {
            ...prev,
            projects: [...prev.projects, newProject],
          };
        });
        setModalProps(Object.assign(currentModal, { show: false }));
      };

      dispatch(addProject({
        name: values.name,
        email: currentUser.email,
        timezone,
        successCallback: updateCurrentUser,
      }));
    };

    const { handleChange, handleSubmit, values, errors } = useForm(
      {
        projectName: '',
      },
      validateForm,
      createNewProject,
    );

    const updateTimezone = (timezone: any) => {
      setTimezone(timezone);
    };

    return (
      <form
        method='POST'
        onSubmit={handleSubmit}
        className={styles.modalBodyContainer}
      >
        <div className={styles.field}>
          <Input
            type='text'
            name='projectName'
            placeholder='Название проекта'
            fluid
            onChange={handleChange}
            errorMessage={errors.projectName}
          />
        </div>

        <div className={styles.field}>
          <Input
            type='text'
            classNames={styles.timezones}
            fixedSelect
            data={timezones}
            fluid
            value={getTimezoneByCode(timezone)}
            readOnly
            onSelect={updateTimezone}
          />
        </div>

        <Button
          type='submit'
          fluid
        >
          Создать новый проект
        </Button>
      </form>
    );
  };

  return (
    <div  className={styles.projectsContainer}>
      <InboxSidebar
        inboxMessages={inboxMessages}
      />
      <div className={styles.contentContainer}>
        <Header />

        <div className={styles.channelsContainer}>
          <Title level='1' weight='bold'>Проекты</Title>

          <Table
            columns={columns}
            data={currentUser.projects}
          />

          <Modal
            {...currentModal}
          />
        </div>
      </div>
    </div>
  );
}