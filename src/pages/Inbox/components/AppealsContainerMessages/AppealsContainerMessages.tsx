import React, { useRef, useEffect } from 'react';
import { useParams } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArchive } from '@fortawesome/free-solid-svg-icons';

import Button from '../../../../components/Button/Button';
import { ModalProps } from '../../../../components/Modal/Modal';
import MessageInner from '../MessageInner/MessageInner';
import MessageInputContainer from '../MessageInputContainer/MessageInputContainer';

import styles from './appealsContainerMessages.module.scss';
import { useActions } from '../../../../hooks/useActions';
import usePrevious from '../../../../hooks/usePrevious';
import { useTypedSelector } from '../../../../hooks/useTypedSelector';
import { SelectedClient } from '../../../../types/inbox';
import { defaultSelectedClient } from '../../../../store/reducers/inbox';
import socket from '../../../../socket';

interface AppealsContainerMessagesProps {
  clientName: string,
  messagesHistory: SelectedClient['messagesHistory'],
  clientId: string,
  closeModal: ModalProps['onClose'],
  setModalProps: (data: ModalProps) => void,
}

export default function AppealsContainerMessages({ clientName, messagesHistory, clientId, closeModal, setModalProps }: AppealsContainerMessagesProps) {
  const { incomingMessages, selectedClient } = useTypedSelector(state => state.inbox);
  const {
    changeMessagesStatus, deleteClientAppeal,
    updateSelectedClient, deleteFromInboxIncomingMessage,
  } = useActions();
  let { projectId } = useParams<{ projectId: string }>();
  const messagesHistoryContainerRef = useRef<HTMLDivElement>(null);

  const isDisabled = () => !incomingMessages.find(incMsg => incMsg.clientId === clientId)?.assignedTo;

  const closeDialog = () => {
    const changeMessagesStatusData = {
      messagesStatus: 'closed',
      projectId,
      clientId,
    };
    changeMessagesStatus({
      ...changeMessagesStatusData,
      successCallback: () => socket.emit('changeMessagesStatus', changeMessagesStatusData),
    });
  };

  const archiveDialog = () => {
    setModalProps({
      show: true,
      title: 'Удалить обращение?',
      body: <ModalBody />,
      footer: <ModalFooter />,
      width: '500px',
      position: 'top',
      onClose: closeModal,
    });
  };

  const ModalBody = () => <p className={styles.modalBody}>Вы действительно хотите удалить обращение?</p>;

  const ModalFooter = () => {
    return (
      <div className={styles.modalFooter}>
        <Button
          type='button'
          classNames={`${styles.button} ${styles.marginRight}`}
          background='edit'
          onClick={() => closeModal()}
        >
          Отмена
        </Button>

        <Button
          type='button'
          classNames={styles.button}
          onClick={() => {
            const removeIncomingAppealAndResetSelectedClient = () => {
              updateSelectedClient(defaultSelectedClient);
              deleteFromInboxIncomingMessage({ clientId });
              socket.emit('updateSelectedClient', defaultSelectedClient);
              socket.emit('deleteFromInboxIncomingMessage', { clientId });
              closeModal();
            };

            deleteClientAppeal({
              clientId,
              projectId,
              successCallback: () => removeIncomingAppealAndResetSelectedClient(),
            });
          }}
        >
          Удалить
        </Button>
      </div>
    );
  };
  
  const setAnimationClass = (childrenNodesLength: number, childrenNodes: HTMLCollection) => {
    for (let i = childrenNodesLength; i > 0; i--) {
      const node = childrenNodes[i - 1];
      
      setTimeout(() => {
        if (node.classList.contains(styles.animationClass)) return;
        node.className = node.className.concat(` ${styles.animationClass}`);
      }, (childrenNodesLength - i) * 50);
    }
  };

  const removeAnimationClass = (childrenNodesLength: number, childrenNodes: HTMLCollection) => {
    for (let i = childrenNodesLength; i > 0; i--) {
      const node = childrenNodes[i - 1];
      node?.classList.remove(styles.animationClass);
    }
  };

  const prevClientId = usePrevious(clientId);

  useEffect(() => {
    const messagesHistoryContainerElement = messagesHistoryContainerRef.current;

    if (messagesHistoryContainerElement) {
      const childrenNodes = messagesHistoryContainerElement.children;
      const childrenNodesLength = childrenNodes.length;

      setAnimationClass(childrenNodesLength, childrenNodes);

      return () => {
        if (prevClientId !== clientId) {
          removeAnimationClass(childrenNodesLength, childrenNodes);
        }
      };
    }
  }, [clientId, selectedClient.messagesHistory]);

  return (
    <div className={styles.converasationChatContainer}>
      <div className={styles.dialogHeader}>
        <div>
          <p className={styles.clientName}>{ clientName }</p>
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
            classNames={styles.closeDialogBtn}
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
          messagesHistory.map((message, idx) => {
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
  );
}