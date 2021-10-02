import React, { useContext, useEffect } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import { faInbox, faEnvelope, faEnvelopeOpen, faAt, faComments, faCheckSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cloneDeep from 'lodash/cloneDeep';
import { defaultSelectedClient } from '..//reducers/inbox';

import Sidebar from 'ui/Sidebar/Sidebar';
import SidebarList from 'ui/Sidebar/components/SidebarList/SidebarList';
import Avatar from 'ui/Avatar/Avatar';
import Badge from 'ui/Badge/Badge';

import { useActions } from 'hooks/useActions';
import { useTypedSelector } from 'hooks/useTypedSelector';
import styles from './inboxSidebar.module.scss';
import { Teammate } from 'types/teammates';
import { isProjectOwner } from 'lib/utils/accessRights';
import { Context } from 'context/Context';
import { SidebarContext } from 'context/SidebarContext';

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

  const { currentUser } = useContext(Context);
  const { updateSidebar } = useContext(SidebarContext);

  const isOwner = isProjectOwner(currentUser.role);
  let { projectId, dialogType } = useParams<{ projectId: string, dialogType: string }>();

  const { selectClient, updateTeammate, updateIncomingMessagesFilters } = useActions();
  let history = useHistory();

  const hideOpenedMessagesArea = () => {
    if (selectedClient.clientId !== '') {
      selectClient(cloneDeep(defaultSelectedClient));
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
    isOwner ?
    <Link
      className={styles.title}
      to={`/project/${projectId}/settings/channels`}
    >
      Каналы
    </Link> :
    <h3 className={styles.title}>Каналы</h3>
  );

  const formatDialogs = () => {
    const all = {
      name: 'Все',
      label: 'all',
      allClientIds: incomingMessages,
      icon: <FontAwesomeIcon icon={faInbox} />,
      stylesList: {
        marginLeft: '8px',
      },
      onClick: () => switchDialog('all'),
    };
    const unread = {
      name: 'Непрочитанные',
      label: 'unread',
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
      label: 'opened',
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
      label: 'assigned',
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
      label: 'closed',
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
          label: name,
          icon: <FontAwesomeIcon icon={faComments} />,
          stylesList: {
            marginLeft: '8px',
          },
          onClick: () => updateIncomingMessagesFilters({ channel: name }),
        });
      }
  
      if (isOwner) {
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
    const teammatesWithoutCurrentUser = teammates.filter(teammate => teammate.email !== currentUser.email);

    for (let { username, isOnline, email } of teammatesWithoutCurrentUser) {
      result.push({
        name: username,
        label: email,
        icon: (
          <Badge
            size='small'
            color={isOnline ? styles.isOnline : styles.isOffline}
          >
            <Avatar
              name={username}
              size='small'
            />
          </Badge>
        ),
        onClick: () => updateIncomingMessagesFilters({ assigned: email }),
      });
    }

    if (isOwner) {
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

  useEffect(() => {
    updateSidebar(prev => ({
      ...prev,
      dialogs: dialogType,
    }));
  }, []);

  return (
    <Sidebar>
      <SidebarList
        type='dialogs'
        title={dialogTitle()}
        listItems={formatDialogs()}
      />

      <SidebarList
        type='channel'
        title={channelsTitle()}
        listItems={formatChannels(channels)}
      />

      {
        isOwner &&
        <SidebarList
          type='assigned'
          title={teammatesTitle()}
          listItems={formatTeammates(teammates)}
        />
      }

      {
        isOwner &&
        <div className={styles.fixedSidebarSection}>
          <SidebarList
            listItems={[{
              name: 'Настройки',
              onClick: () => history.push(`/project/${projectId}/settings/start`),
            }]}
          />
        </div>
      }
    </Sidebar>
  );
}