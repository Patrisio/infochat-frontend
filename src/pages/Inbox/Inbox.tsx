import React, { useEffect, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useParams } from 'react-router';

import { Context } from '../../context/Context';
import {
  fetchTeammates, fetchIncomingMessages, fetchChannels
} from '../../actions';

import Header from '../../components/Header/Header';
import Spin from '../../components/Spin/Spin';
import Button from '../../components/Button/Button';

import AppealsContainerSelector from './components/AppealsContainerSelector/AppealsContainerSelector';
import AppealsContainerMessages from './components/AppealsContainerMessages/AppealsContainerMessages';
import PersonInfo from './components/PersonInfo/PersonInfo';
import InboxSidebar from './components/InboxSidebar/InboxSidebar';

import styles from './inbox.module.scss';
import man from '../../assets/man.png';
import { getAllInboxMessages } from '../../lib/utils/messages';

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

export default function Inbox() {
  let { projectId, dialogType } = useParams<{ projectId: string, dialogType: string }>();
  const { currentUser } = useContext<any>(Context);

  const selectedClient = useSelector((state: RootState) => state.inbox.selectedClient);
  const incomingMessages = useSelector((state: RootState) => state.inbox.incomingMessages);
  const filters = useSelector((state: RootState) => state.inbox.filters);
  const teammates = useSelector((state: RootState) => state.teammates.teammates);
  const { channels, fetching } = useSelector((state: RootState) => state.channels);

  const dispatch = useDispatch();
  let history = useHistory();

  const inboxMessages = getAllInboxMessages(incomingMessages, currentUser);

  useEffect(() => {
    dispatch(fetchIncomingMessages({ projectId }));
    dispatch(fetchTeammates({ projectId }));
    dispatch(fetchChannels({ projectId }));
  }, []);

  const filterByFilters = (incMsg: any) => {
    const checkList = {
      searchBy: false,
      channel: true,
      assigned: false,
    };

    const checkOnSearchbyFilter = () => {
      if (filters.searchBy.value === '') {
        checkList.searchBy = true;
      } else {
        if (filters.searchBy.tag === 'text') {
          const foundMessage = incMsg.messagesHistory
            .find((msgEntity: any) => msgEntity.message.includes(filters.searchBy.value));
  
          if (foundMessage) {
            checkList.searchBy = true;
          }
        }
      }
    };

    const checkOnAssignedFilter = () => {
      if (filters.assigned === 'all') {
        checkList.assigned = true;
      } else {
        if (incMsg.assignedTo === filters.assigned) {
          checkList.assigned = true;
        }
      }
    }

    checkOnSearchbyFilter();
    checkOnAssignedFilter();

    return checkList.searchBy && checkList.channel && checkList.assigned;
  };

  const getIncomingMessagesByDialogTypeAndFilters = () => {
    return inboxMessages[dialogType].clientIds.filter(filterByFilters);
  };

  return (
    <div>
      <div className={styles.conversationsContainer}>
        <InboxSidebar
          inboxMessages={inboxMessages}
        />

        <AppealsContainerSelector
          messages={dialogType === 'all' ? incomingMessages : getIncomingMessagesByDialogTypeAndFilters()}
        />

        <div className={styles.conversationsHeaderDialogs}>
          <Header />
          {
            fetching ?
            <Spin /> :
            <div className={styles.conversationsDialogs}>
              {
                channels.length === 0 ?
                <div className={styles.noChannelsContainer}>
                  <img
                    src={man}
                    alt='man'
                    className={styles.manImage}
                  />
                  <p>У вас ещё нет ни одного канала</p>
                  <Button
                    type='button'
                    fluid
                    onClick={() => history.push(`/project/${projectId}/settings/channels`)}
                  >
                    Добавить канал
                  </Button>
                </div> :
                selectedClient.clientId === '' ?
                <div className={styles.notSelectedClientIdContainer}>
                  <p className={styles.notSelectedClientIdNotice}>Пожалуйста, выберите диалог, чтобы начать общение</p>
                </div> :
                <>
                  <AppealsContainerMessages />
                  <PersonInfo selectedClient={selectedClient} />
                </>
              }
            </div>
          }
        </div>
      </div>
    </div>
  );
}