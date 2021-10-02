import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router';
import cloneDeep from 'lodash/cloneDeep';

import InboxSidebar from '../Inbox/components/InboxSidebar/InboxSidebar';
import Title from 'ui/Typography/Title/Title';
import Header from 'ui/Header/Header';
import Modal from 'ui/Modal/Modal';
import Table from 'ui/Table/Table';
import Button from 'ui/Button/Button';
import Input from 'ui/Input/Input';

import useForm from '../../hooks/useForm';

import { Context } from '../../context/Context';
import { getAllInboxMessages } from '../../lib/utils/messages';
import { useActions } from '../../hooks/useActions';
import { useTypedSelector } from '../../hooks/useTypedSelector';
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

interface CellData {
  id: number,
  name: string,
  teammatesCount: number,
}

export default function Projects() {
  const { incomingMessages } = useTypedSelector(state => state.inbox);

  const [currentModal, setModalProps] = useState<ModalProps>({
    show: false,
    title: '',
    body: null,
    footer: null,
    onClose: () => setModalProps(Object.assign(currentModal, { show: false })),
    width: '',
    height: '',
  });

  const { addProject } = useActions();
  const { currentUser, setCurrentUser } = useContext(Context);
  const history = useHistory();

  const inboxMessages = getAllInboxMessages(incomingMessages, currentUser);
  const timezones = getTimezones();

  const columns = [
    {
      key: 'name',
      visible: true,
      headerComponent: () => (
        <Button
          type='button'
          background='transparent'
          classNames={styles.addNewProjectBtn}
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
      cellComponent: (data: CellData) => (
        <div className={styles.projectName}>
          {data.name}
        </div>
      ),
    },
    {
      key: 'teammates',
      visible: false,
      cellComponent: (data: CellData) => (
        <div className={styles.teammatesCount}>
          {`${data.teammatesCount} сотрудников`}
        </div>
      ),
    },
    {
      key: 'action',
      visible: true,
      headerComponent: () => (
        <Button
          type='button'
          background='edit'
          classNames={styles.newProjectBtn}
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
      cellComponent: (data: CellData) => (
        <Button
          type='button'
          background='edit'
          classNames={styles.changeProjectBtn}
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

    const createNewProject = (values: { name: string, projectName: string }) => {
      const updateCurrentUser = (data: { id: number }) => {
        setCurrentUser((prev) => {
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

      addProject({
        name: values.name,
        email: currentUser.email,
        timezone,
        successCallback: updateCurrentUser,
      });
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