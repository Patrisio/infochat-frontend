import React, { useState, useEffect, useContext, Suspense, lazy } from 'react';
import { useHistory } from 'react-router-dom';
import { useParams } from 'react-router';

import { Context } from '../../context/Context';
import { useActions } from '../../hooks/useActions';
import { useTypedSelector } from '../../hooks/useTypedSelector';

import Header from '../../components/Header/Header';
import Spin from '../../components/Spin/Spin';
import Button from '../../components/Button/Button';
import Modal, { ModalProps } from '../../components//Modal/Modal';
import ClientInfoSkeleton from '../../components/Skeleton/ClientInfoSkeleton/ClientInfoSkeleton';

import AppealsContainerSelector from './components/AppealsContainerSelector/AppealsContainerSelector';
import InboxSidebar from './components/InboxSidebar/InboxSidebar';

import styles from './inbox.module.scss';
import man from '../../assets/man.png';
import { getAllInboxMessages } from '../../lib/utils/messages';
import { isProjectOwner } from '../../lib/utils/accessRights';
import { getClientName } from '../../utils/clientData';

const AppealsContainerMessages = lazy(() => import('./components/AppealsContainerMessages/AppealsContainerMessages'));
const PersonInfo = lazy(() => import('./components/PersonInfo/PersonInfo'));

export default function Inbox() {
  let { projectId, dialogType } = useParams<{ projectId: string, dialogType: string }>();
  const { currentUser } = useContext<any>(Context);
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

  const { fetchTeammates, fetchIncomingMessages, fetchChannels } = useActions();
  let history = useHistory();

  const inboxMessages = getAllInboxMessages(incomingMessages, currentUser);

  useEffect(() => {
    fetchIncomingMessages({ projectId });
    fetchTeammates({ projectId });
    fetchChannels({ projectId });
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

  useEffect(() => {
    console.log(currentModal, 'currentModalcurrentModalcurrentModalcurrentModalcurrentModal');
  }, [currentModal]);

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