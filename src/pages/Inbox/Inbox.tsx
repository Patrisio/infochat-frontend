import React, { useState, useEffect, useContext, Suspense, lazy } from 'react';
import { useHistory } from 'react-router-dom';
import { useParams } from 'react-router';

import { useActions } from 'hooks/useActions';
import { useTypedSelector } from 'hooks/useTypedSelector';

import Header from 'ui/Header/Header';
import Spin from 'ui/Spin/Spin';
import Button from 'ui/Button/Button';
import Modal, { ModalProps } from 'ui/Modal/Modal';
import ClientInfoSkeleton from 'ui/Skeleton/ClientInfoSkeleton/ClientInfoSkeleton';

import { getAllInboxMessages } from 'lib/utils/messages';
import { isProjectOwner } from 'lib/utils/accessRights';
import { getClientName } from 'lib/utils/clientData';

import AppealsContainerSelector from './components/AppealsContainerSelector/AppealsContainerSelector';
import InboxSidebar from './components/InboxSidebar/InboxSidebar';

import styles from './inbox.module.scss';
import man from '../../assets/man.png';
import { IUser, Context } from '../../context/Context';
import { DialogType, IIncomingMessage } from '../../types/inbox';

const AppealsContainerMessages = lazy(() => import('./components/AppealsContainerMessages/AppealsContainerMessages'));
const PersonInfo = lazy(() => import('./components/PersonInfo/PersonInfo'));

export default function Inbox() {
  let { projectId, dialogType } = useParams<{ projectId: string, dialogType: DialogType }>();
  const { currentUser, setCurrentUser } = useContext(Context);
  const isOwner = isProjectOwner(currentUser.role);

  const { selectedClient } = useTypedSelector(state => state.inbox);
  const { incomingMessages } = useTypedSelector(state => state.inbox);
  const { filters } = useTypedSelector(state => state.inbox);
  const { channels, fetching } = useTypedSelector(state => state.channels);

  const [currentModal, setModalProps] = useState<ModalProps>({
    show: false,
    title: '',
    body: null,
    footer: null,
    onClose: () => {
      setModalProps(prev => ({ ...prev, show: false }));
    },
    width: '',
    height: '',
  });

  const { fetchTeammates, fetchIncomingMessages, fetchChannels, getCurrentUser } = useActions();
  let history = useHistory();

  const inboxMessages = getAllInboxMessages(incomingMessages, currentUser);

  const filterByFilters = (incMsg: IIncomingMessage) => {
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
    return inboxMessages[dialogType]?.clientIds.filter(filterByFilters) ?? [];
  };

  useEffect(() => {
    if (!currentUser.email) {
      const successCallback = (currentUser: IUser) => {
        setCurrentUser(currentUser);
      };
      getCurrentUser({ successCallback });
    }

    fetchIncomingMessages({ projectId });
    fetchTeammates({ projectId });
    fetchChannels({ projectId });
  }, []);

  return (
    <div>
      <div className={styles.conversationsContainer}>
        <InboxSidebar
          inboxMessages={inboxMessages}
        />

        <AppealsContainerSelector
          inboxFilters={filters}
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
                  {
                    isOwner &&
                    <Button
                      type='button'
                      fluid
                      onClick={() => history.push(`/project/${projectId}/settings/channels`)}
                    >
                      Добавить канал
                    </Button>
                  }
                </div> :
                selectedClient.clientId === '' ?
                <div className={styles.notSelectedClientIdContainer}>
                  <p className={styles.notSelectedClientIdNotice}>Пожалуйста, выберите диалог, чтобы начать общение</p>
                </div> :
                <>
                  <Suspense fallback={<Spin />}>
                    <AppealsContainerMessages
                      clientName={getClientName(selectedClient.avatarColor, selectedClient.avatarName)}
                      messagesHistory={selectedClient.messagesHistory}
                      clientId={selectedClient.clientId}
                      closeModal={currentModal.onClose}
                      setModalProps={setModalProps}
                    />
                  </Suspense>

                  <Suspense fallback={<ClientInfoSkeleton />}>
                    <PersonInfo
                      selectedClient={selectedClient}
                      closeModal={currentModal.onClose}
                      setModalProps={setModalProps}
                    />
                  </Suspense>
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