import React, { useState, useEffect, useContext } from 'react';
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
import Modal, { ModalProps } from '../../components//Modal/Modal';

import AppealsContainerSelector from './components/AppealsContainerSelector/AppealsContainerSelector';
import AppealsContainerMessages from './components/AppealsContainerMessages/AppealsContainerMessages';
import PersonInfo from './components/PersonInfo/PersonInfo';
import InboxSidebar from './components/InboxSidebar/InboxSidebar';

import { State } from '../../reducers/inbox';
import styles from './inbox.module.scss';
import man from '../../assets/man.png';
import { getAllInboxMessages } from '../../lib/utils/messages';

interface IMessagesHistory {
  message: string,
  clientId: string,
  username: string
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

interface RootState {
  inbox: State
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

export default function Inbox() {
  let { projectId, dialogType } = useParams<{ projectId: string, dialogType: string }>();
  const { currentUser } = useContext<any>(Context);

  const selectedClient = useSelector((state: RootState) => state.inbox.selectedClient);
  const incomingMessages = useSelector((state: RootState) => state.inbox.incomingMessages);
  const filters = useSelector((state: RootState) => state.inbox.filters);
  const teammates = useSelector((state: RootState) => state.teammates.teammates);
  const { channels, fetching } = useSelector((state: RootState) => state.channels);

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
                  <AppealsContainerMessages
                    closeModal={currentModal.onClose}
                    setModalProps={setModalProps}
                  />
                  <PersonInfo
                    selectedClient={selectedClient}
                    closeModal={currentModal.onClose}
                    setModalProps={setModalProps}
                  />
                </>
              }
            </div>
          }
        </div>
      </div>

      <Modal
        {...currentModal}
      />
    </div>
  );
}