import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import cloneDeep from 'lodash/cloneDeep';

import Table from '../../components/Table/Table';
import Button from '../../components/Button/Button';
import Modal from '../../components/Modal/Modal';
import Title from '../../components/Typography/Title/Title';
import Switcher from '../../components/Switcher/Switcher';
import Accordion from '../../components/Accordion2/Accordion2';

import InstallBlock from './components/InstallBlock/InstallBlock';
import GeneralSettingsBlock from './components/GeneralSettingsBlock/GeneralSettingsBlock';
import OperatorsBlock from './components/OperatorsBlock/OperatorsBlock';
import ClockBlock from './components/ClockBlock/ClockBlock';
import AutomationBlock from './components/AutomationBlock/AutomationBlock';
import ChatPreview from './components/ChatPreview/ChatPreview';

import styles from './channels.module.scss';
import colors from '../../scss/variables.module.scss';
import { useActions } from '../../hooks/useActions';
import { useTypedSelector } from '../../hooks/useTypedSelector';

import chat from '../../assets/chat.svg';
import chatChannels from '../../assets/chat-channels.svg';
import invite from '../../assets/invite.svg';
import clock from '../../assets/clock.svg';
import install from '../../assets/install.svg';
import operators from '../../assets/operators.svg';
import style from '../../assets/style.svg';

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
  name: string,
  status: string,
}

export default function Channels() {
  const [currentModal, setModalProps] = useState<ModalProps>({
    show: false,
    title: '',
    body: null,
    footer: null,
    onClose: () => setModalProps(Object.assign(currentModal, { show: false })),
    width: '',
    height: '',
  });
  const { channels: connectedChannels } = useTypedSelector(state => state.channels);
  console.log(connectedChannels, 'connectedChannels');
  let { projectId } = useParams<{ projectId: string }>();
  const { addChannel, fetchChannels, fetchChatSettings, updateChannelStatusByChannelName } = useActions();

  const getChannelPreview = (data: string) => {
    switch(data) {
      case 'chat':
        return chatChannels;
    }
  };

  const getChannelName = (name: string) => {
    switch(name) {
      case 'chat':
        return 'Чат на сайте' as string;
    }
  };

  const getChannelStatus = (status: string) => {
    switch(status) {
      case 'pending':
        return 'Ожидание' as string;
      case 'disabled':
        return 'Выключено' as string;
    }
  };

  const StatusSwitcher = (data: CellData) => {
    const statuses = ['pending', 'disabled'];

    return (
      <div className={styles.switcher}>
        <span className={`
          ${styles.switcherLabel}
          ${data.status === 'pending' ? styles.pending :
            data.status === 'disabled' ? styles.disabled : ''}
        `}>
          { getChannelStatus(data.status) }
        </span>
        <Switcher
          onChange={(isActive: boolean) => {
            updateChannelStatusByChannelName({
              name: data.name,
              status: isActive ? 'pending' : statuses.find(((statusItem: string) => statusItem !== data.status)),
            });
          }}
          value={true}
        />
      </div>
    );
  };

  const panels = [
    {
      imageSrc: install,
      label: 'Установите чат на сайт',
      content: <InstallBlock />,
    },
    {
      imageSrc: style,
      label: 'Основные настройки',
      content: <GeneralSettingsBlock />,
    },	
    {
      imageSrc: operators,
      label: 'Операторы',
      content: <OperatorsBlock />,
    },
    {
      imageSrc: clock,
      label: 'Часы работы',
      content: <ClockBlock />,
    },
    {
      imageSrc: invite,
      label: 'Автоматические действия',
      content: <AutomationBlock />
    },
  ];

  const columns = [
    {
      key: 'avatar',
      visible: true,
      headerComponent: () => (
        <Button
          type='button'
          background='transparent'
          classNames={styles.addNewChannelBtn}
          onClick={() => {
            setModalProps({
              show: true,
              title: 'Добавить новый канал',
              body: <ModalBody />,
              footer: null,
              onClose: () => setModalProps(prev => cloneDeep(Object.assign(prev, { show: false }))),
              width: '520px',
            });
          }}
        >
          Добавить новый канал
        </Button>
      ),
      cellComponent: (data: CellData) => (
        <div className={styles.channelNameContainer}>
          <img src={getChannelPreview(data.name)} />
          <span className={styles.channelName}>{getChannelName(data.name)}</span>
        </div>
      ),
    },
    {
      key: 'name',
      visible: false,
      cellComponent: (data: CellData) => (
        <span className={styles.channel}>{getChannelName(data.name)}</span>
      )
    },
    {
      key: 'status',
      visible: false,
      cellComponent: StatusSwitcher,
    },
    {
      key: 'action',
      visible: true,
      headerComponent: (data: CellData) => (
        <Button
          type='button'
          background='edit'
          classNames={styles.addChannelBtn}
          onClick={() => {
            setModalProps({
              show: true,
              title: 'Добавить новый канал',
              body: <ModalBody />,
              footer: null,
              onClose: () => setModalProps(prev => cloneDeep(Object.assign(prev, { show: false }))),
              width: '520px',
            });
          }}
        >
          + Добавить
        </Button>
      ),
      cellComponent: (data: CellData) => (
        <Button
          type='button'
          background='edit'
          classNames={styles.changeChannelSettingsBtn}
          onClick={() => {
            fetchChatSettings({ projectId });

            setModalProps({
              show: true,
              title: 'Редактировать чат на сайте',
              body: (
                <div className={styles.modalBody}>
                  <div
                    key='1'
                    className={styles.chatSettingsContainer}
                  >
                    <Accordion panels={panels}/>
                  </div>
                  
                  <ChatPreview key='2' />
                </div>
              ),
              footer: null,
              onClose: () => setModalProps(prev => cloneDeep(Object.assign(prev, { show: false }))),
              width: '900px',
              height: '90%',
            });
          }}
        >
          Изменить
        </Button>
      ),
    },
  ];
  const channels = [
    {
      imageSrc: chat,
      alt: 'chat',
      backgroundColor: colors.blue1,
      title: 'Чат на сайте',
      id: 'chat',
    },
    {
      imageSrc: chat,
      alt: 'chat',
      backgroundColor: colors.blue1,
      title: 'Чат на сайте',
      id: 'chat',
    },
    {
      imageSrc: chat,
      alt: 'chat',
      backgroundColor: colors.blue1,
      title: 'Чат на сайте',
      id: 'chat',
    },
    {
      imageSrc: chat,
      alt: 'chat',
      backgroundColor: colors.blue1,
      title: 'Чат на сайте',
      id: 'chat',
    },
    {
      imageSrc: chat,
      alt: 'chat',
      backgroundColor: colors.blue1,
      title: 'Чат на сайте',
      id: 'chat',
    },
    {
      imageSrc: chat,
      alt: 'chat',
      backgroundColor: colors.blue1,
      title: 'Чат на сайте',
      id: 'chat',
    },
  ];

  useEffect(() => {
    getChannels();
  }, []);

  const getChannels = () => {
    fetchChannels({ projectId });
  };

  const addNewChannel = (id: string) => {
    addChannel({ projectId, name: id });
  };

  const ModalBody = () => {
    return (
      <div className={styles.modalBody}>
        {
          channels.map(({  imageSrc, alt, backgroundColor, title, id }, idx) => {
            const isAlreadyConnectedChannel = connectedChannels.find(channel => channel.name === id);

            return (
              <div
                key={idx}
                className={`
                  ${styles.channelCard}
                  ${isAlreadyConnectedChannel && styles.disabledChannel}
                `}
                onClick={() => {
                  if (isAlreadyConnectedChannel) return;

                  addNewChannel(id);
                  setModalProps(Object.assign(currentModal, { show: false }));
                }}
              >
                <div
                  className={styles.imageContainer}
                  style={{ backgroundColor }}
                >
                  <img
                    src={imageSrc}
                    alt={alt}
                  />
                </div>
                <p className={styles.title}>{title}</p>
              </div>
            );
          })
        }
      </div>
    );
  };

  return (
    <div className={styles.channelsContainer}>
      <Title level='1' weight='bold'>Каналы</Title>

      <Table
        columns={columns}
        data={connectedChannels}
      />

      <Modal
        {...currentModal}
      />
    </div>
  );
}