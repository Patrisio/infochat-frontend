import React, { useState, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { useParams } from 'react-router';
import { Context } from '../../../../context/Context';


import Sidebar from '../../../../components/Sidebar/Sidebar';
import SidebarList from '../../../../components/Sidebar/components/SidebarList/SidebarList';
import Avatar from '../../../../components/Avatar/Avatar';

import { faInbox, faEnvelope, faEnvelopeOpen, faAt, faComments, faDoorClosed } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { generateRandomHash } from '../../../../utils/string';
import cloneDeep from 'lodash/cloneDeep';
import {
  addIncomingMessage, addIncomingMessageForSelectedClient,
  selectClient, fetchTeammates,
  fetchIncomingMessages, fetchChannels
} from '../../../../actions';
import styles from './inboxSidebar.module.scss';

interface IMessagesHistory {
  message: string,
  clientId: string,
  username: string
}

type MessagesStatus = 'unread' | 'assigned' | 'opened' | 'closed';

interface IIncomingMessage {
  id: string,
  projectId: string,
  clientId: string,
  messagesHistory: IMessagesHistory[],
  assigned_to: string | null,
  avatarName: string,
  avatarColor: string,
  email: string,
  phone: string,
  messagesStatus: MessagesStatus,
}

interface InboxProps {
  messagesCount?: number,
  clientIds: string[]
}

interface IClient {
  projectId: string,
  clientId: string,
  message: IMessagesHistory,
  avatarName: string,
  avatarColor: string,
}

interface Teammate {
  avatar: string,
  email: string,
  role: string,
  status: string,
  username: string,
  allClientIds: IClient[],
  unreadCount: number,
  unreadClientIds: IClient[],
  assignedCount: number,
  assignedClientIds: IClient[],
  openedCount: number,
  openedClientIds: IClient[],
}

interface IMessagesHistory {
  message: string,
  clientId: string,
  username: string
}

interface IIncomingMessage {
  id: string,
  projectId: string,
  clientId: string,
  messagesHistory: IMessagesHistory[],
  assigned_to: string | null,
  assignedTo: string | null
}

interface Filters {
  searchBy: {
    value: string,
    tag: string,
  },
  channel: string,
  assigned: string,
}

interface RootState {
  inbox: {
    filters: Filters,
    messages: IMessagesHistory[],
    incomingMessages: IIncomingMessage[],
    selectedClient: IIncomingMessage,
  },
  teammates: {
    teammates: Teammate[],
  },
  channels: {
    channels: Channel[],
    fetching: boolean,
  },
}

interface Channel {
  name: string,
}

interface Dialog {
  count: number,
  clientIds: IIncomingMessage[]
}

interface InitialDialogs {
  [key: string]: Dialog,
}

interface InboxSidebarProps {
  inboxMessages: any,
}

export default function InboxSidebar({ inboxMessages }: InboxSidebarProps) {
  const incomingMessages = useSelector((state: RootState) => state.inbox.incomingMessages);
  const selectedClient = useSelector((state: RootState) => state.inbox.selectedClient);
  const { channels, fetching } = useSelector((state: RootState) => state.channels);
  const teammates = useSelector((state: RootState) => state.teammates.teammates);

  const { currentUser, setCurrentUser } = useContext<any>(Context);
  let { projectId, dialogType } = useParams<{ projectId: string, dialogType: string }>();

  const dispatch = useDispatch();
  let history = useHistory();

  const hideOpenedMessagesArea = () => {
    if (selectedClient.clientId !== '') {
      dispatch(selectClient(cloneDeep({
        id: '',
        projectId: '',
        clientId: '',
        messagesHistory: [],
        assigned_to: ''
      })));
    }
  };

  const switchDialog = (dialog: string) => {
    if (dialogType !== dialog) {
      history.push(`/project/${projectId}/inbox/${dialog}`);
      hideOpenedMessagesArea();
    }
  };

  const getChannelName = (name: string) => {
    switch (name) {
      case 'chat':
        return 'Чат на сайте';
    }
  };

  const dialogTitle = () => <h3 className={styles.title}>Диалоги</h3>;
  const teammatesTitle = () => (
    <Link
      className={styles.title}
      to={`/project/${projectId}/settings/teammates`}
    >
      Сотрудники
    </Link>
  );
  const channelsTitle = () => (
    <Link
      className={styles.title}
      to={`/project/${projectId}/settings/channels`}
    >
      Каналы
    </Link>
  );

  const formatDialogs = () => {
    const all = {
      name: 'Все',
      allClientIds: incomingMessages,
      icon: <FontAwesomeIcon icon={faInbox} />,
      stylesList: {
        marginLeft: '8px',
      },
      onClick: () => switchDialog('all'),
    };
    const unread = {
      name: 'Непрочитанные',
      count: inboxMessages.unread.count,
      icon: <FontAwesomeIcon icon={faEnvelope} />,
      stylesList: {
        marginLeft: '8px',
      },
      unreadClientIds: inboxMessages.unread.clientIds,
      onClick: () => switchDialog('unread')
    };
    const opened = {
      name: 'Открытые',
      count: inboxMessages.opened.count,
      icon: <FontAwesomeIcon icon={faEnvelopeOpen} />,
      stylesList: {
        marginLeft: '8px',
      },
      openedClientIds: inboxMessages.opened.clientIds,
      onClick: () => switchDialog('opened')
    };
    const closed = {
      name: 'Закрытые',
      count: inboxMessages.closed.count,
      icon: <FontAwesomeIcon icon={faDoorClosed} />,
      stylesList: {
        marginLeft: '8px',
      },
      closedClientIds: inboxMessages.closed.clientIds,
      onClick: () => switchDialog('closed')
    };
    const assigned = {
      name: 'Назначенные мне',
      count: inboxMessages.assigned.count,
      icon: <FontAwesomeIcon icon={faAt} />,
      stylesList: {
        marginLeft: '8px',
      },
      assignedClientIds: inboxMessages.assigned.clientIds,
      onClick: () => switchDialog('assigned')
    };

    const dialogs = [all, unread, opened, closed, assigned];

    return dialogs;
  };

  const formatChannels = (channels: Channel[]) => {
    const result = [];

    if (channels.length > 0) {
      for (let { name } of channels) {
        result.push({
          name: getChannelName(name),
          icon: <FontAwesomeIcon icon={faComments} />,
          stylesList: {
            marginLeft: '8px',
          },
        });
      }
  
      if (currentUser.role === 'owner') {
        result.push({
          name: 'Добавить канал',
          stylesList: {
            color: '#4eaaff',
            fontWeight: '500',
          },
          onClick: () => history.push(`/project/${projectId}/settings/channels`),
        });
      }
    }

    return result;
  };

  const formatTeammates = (teammates: Teammate[]) => {
    const result = [];

    for (let { username } of teammates) {
      result.push({
        name: username,
        icon: <Avatar name={username} size='small' />
      });
    }

    if (currentUser.role === 'owner') {
      result.push({
        name: 'Добавить сотрудника',
        stylesList: {
          color: '#4eaaff',
          fontWeight: '500',
        },
        onClick: () => history.push(`/project/${projectId}/settings/teammates`),
      });
    }

    return result;
  };

  return (
    <Sidebar>
      <SidebarList
        title={dialogTitle()}
        listItems={formatDialogs()}
      />

      <SidebarList
        title={channelsTitle()}
        listItems={formatChannels(channels)}
      />

      <SidebarList
        title={teammatesTitle()}
        listItems={formatTeammates(teammates)}
      />

      <div className={styles.fixedSidebarSection}>
        <SidebarList
          listItems={[{
            name: 'Настройки',
            onClick: () => history.push(`/project/${projectId}/settings/start`),
          }]}
        />
      </div>
    </Sidebar>
  );
}