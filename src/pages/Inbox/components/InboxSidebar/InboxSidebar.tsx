import React, { useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useParams } from 'react-router';
import { Context } from '../../../../context/Context';

import Sidebar from '../../../../components/Sidebar/Sidebar';
import SidebarList from '../../../../components/Sidebar/components/SidebarList/SidebarList';
import Avatar from '../../../../components/Avatar/Avatar';

import { faInbox, faEnvelope, faEnvelopeOpen, faAt, faComments, faCheckSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cloneDeep from 'lodash/cloneDeep';
import { useActions } from '../../../../hooks/useActions';
import { useTypedSelector } from '../../../../hooks/useTypedSelector';
import styles from './inboxSidebar.module.scss';
import { Teammate } from '../../../../types/teammates';

interface Channel {
  name: string,
}

interface InboxSidebarProps {
  inboxMessages: any,
}

export default function InboxSidebar({ inboxMessages }: InboxSidebarProps) {
  const { incomingMessages } = useTypedSelector(state => state.inbox);
  const { selectedClient } = useTypedSelector(state => state.inbox);
  const { channels } = useTypedSelector(state => state.channels);
  const { teammates } = useTypedSelector(state => state.teammates);

  const { currentUser } = useContext<any>(Context);
  let { projectId, dialogType } = useParams<{ projectId: string, dialogType: string }>();

  const { selectClient } = useActions();
  let history = useHistory();

  const hideOpenedMessagesArea = () => {
    if (selectedClient.clientId !== '') {
      selectClient(cloneDeep({
        id: '',
        projectId: '',
        clientId: '',
        messagesHistory: [],
        assigned_to: ''
      }));
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
    const closed = {
      name: 'Закрытые',
      count: inboxMessages.closed.count,
      icon: <FontAwesomeIcon icon={faCheckSquare} />,
      stylesList: {
        marginLeft: '8px',
      },
      closedClientIds: inboxMessages.closed.clientIds,
      onClick: () => switchDialog('closed')
    };

    const dialogs = [all, unread, opened, assigned, closed];

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