import React, { useState, useContext, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './appealsContainerMessages.module.scss';
import MessageInputContainer from '../MessageInputContainer/MessageInputContainer';
import Button from '../../../../components/Button/Button';
import MessageInner from '../MessageInner/MessageInner';
import Modal from '../../../../components/Modal/Modal';
import { Context } from '../../../../context/Context';
import socket from '../../../../socket';
import { useParams } from 'react-router';
import { selectClient, changeMessagesStatus } from '../../../../actions';
import { getClientName } from '../../../../utils/clientData';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArchive } from '@fortawesome/free-solid-svg-icons'

type IMessagesHistory = {
  message: string,
  clientId: string,
  username: string
};

interface IClient {
  projectId: string,
  clientId: string,
  messagesHistory: IMessagesHistory[],
}

type IIncomingMessage = {
  id: string,
  projectId: string,
  clientId: string,
  messagesHistory: IMessagesHistory[],
  assigned_to: string,
  assignedTo: string,
  avatarName: string,
  avatarColor: string,
};

interface RootState {
  inbox: {
    messages: IMessagesHistory[]
    incomingMessages: IIncomingMessage[],
    selectedClient: IIncomingMessage,
  },
}

interface AppealsContainerMessagesProps {
  clientIds: string[]
}

export default function AppealsContainerMessages() {
  const [isDeleteAppealModalVisible, setModalState] = useState(false);
  const selectedClient = useSelector((state: RootState) => state.inbox.selectedClient);
  const incomingMessages = useSelector((state: RootState) => state.inbox.incomingMessages);
  const dispatch = useDispatch();
  let { projectId } = useParams<{ projectId: string }>();
  const messagesHistoryContainerRef = useRef<HTMLDivElement>(null);

  const isDisabled = () => !incomingMessages.find((incMsg: IClient) => incMsg.clientId === selectedClient.clientId)?.assignedTo;

  const closeDialog = () => {
    dispatch(changeMessagesStatus({
      messagesStatus: 'closed',
      projectId,
      clientId: selectedClient.clientId,
    }));
  };

  const buttonStyles = {
    padding: '9px 30px 10px',
    fontSize: '13px',
    fontWeight: 400,
  };

  const archiveDialog = () => {
    setModalState(true);
  };

  const closeModal = () => {
    setModalState(false);
  };

  const ModalBody = () => <p className={styles.modalBody}>Вы действительно хотите удалить обращение?</p>;

  const ModalFooter = () => {
    return (
      <div className={styles.modalFooter}>
        <Button
          type='button'
          stylesList={{ marginRight: '10px', ...buttonStyles }}
          background='edit'
          onClick={closeModal}
        >
          Отмена
        </Button>

        <Button
          type='button'
          stylesList={{ ...buttonStyles }}
          onClick={closeModal}
        >
          Удалить
        </Button>
      </div>
    );
  };

  return (
    <>
      <div className={styles.converasationChatContainer}>
        <div className={styles.dialogHeader}>
          <div>
            <p className={styles.clientName}>{ getClientName(selectedClient.avatarColor, selectedClient.avatarName) }</p>
          </div>

          <div
            onClick={archiveDialog}
            className={styles.archiveIconContainer}
          >
            <FontAwesomeIcon icon={faArchive} className={styles.iconArchive}/>
          </div>

          <div className={styles.buttonContainer}>
            <Button
              type='button'
              fluid
              background='edit'
              stylesList={{
                color: '#0a86f9',
                fontSize: '13px',
                padding: '6px 0'
              }}
              onClick={closeDialog}
              disabled={isDisabled()}
            >
              Закрыть диалог
            </Button>
          </div>
        </div>

        <div
          className={styles.messagesHistoryContainer}
          ref={messagesHistoryContainerRef}
        >
          {
            selectedClient.messagesHistory.map((message, idx) => {
              return (
                <MessageInner
                  key={idx}
                  message={message}
                />
              );
            })
          }
        </div>
        <MessageInputContainer
          messagesHistoryContainerElement={messagesHistoryContainerRef.current}
        />
      </div>

      <Modal
        show={isDeleteAppealModalVisible}
        onClose={() => setModalState(false)}
        title='Удалить обращение?'
        body={<ModalBody />}
        footer={<ModalFooter />}
        width='500px'
        position='top'
      />
    </>
  );
}