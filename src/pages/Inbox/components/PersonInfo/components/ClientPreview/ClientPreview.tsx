import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV, faUserLock, faUnlockAlt } from '@fortawesome/free-solid-svg-icons';

import Animal from 'ui/Animal/Animal';
import Textarea from 'ui/Textarea/Textarea';
import Popup from 'ui/Popup/Popup';

import { getClientName } from '../../../../../../utils/clientData';
import styles from './clientPreview.module.scss';
import { InboxState } from '../../../../../../types/inbox';
import { useActions } from 'hooks/useActions';
import socket from '../../../../../../socket';
import { ClientData } from '../../PersonInfo';

interface ClientPreviewProps {
  clientData: ClientData,
  selectedClient: InboxState['selectedClient'],
  updateClientData: (e: any, fieldName: string) => void,
}

export default function ClientPreview({ clientData, selectedClient, updateClientData: updateClient }: ClientPreviewProps) {
  const [isOpenBlockClientPopup, toggleIsOpenBlockClientPopup] = useState(false);
  const { updateClientData, updateIncomingMessage, updateSelectedClient } = useActions();

  const blockOrUnblockClient = () => {
    toggleIsOpenBlockClientPopup(false);

    const successCallback = () => {
      updateIncomingMessage({
        clientId: selectedClient?.clientId,
        isBlocked: !selectedClient.isBlocked
      });
      updateSelectedClient({
        isBlocked: !selectedClient.isBlocked,
      });

      if (!selectedClient.isBlocked) {
        socket.emit('blockClient', { room: selectedClient.clientId });
      }
    };

    updateClientData(
      Object.assign(clientData, {
        isBlocked: !selectedClient.isBlocked,
        successCallback,
      })
    );
  };
  
  const BlockUserPopupBody = () => {
    return (
      <div className={styles.popupBodyContainer}>
        <div
          className={styles.blockClientContainer}
          onClick={blockOrUnblockClient}
        >
          {
            selectedClient.isBlocked ?
            <>
              <FontAwesomeIcon icon={faUnlockAlt} />
              <div className={styles.textContainer}>
                <p className={styles.title}>Снять блокировку</p>
                <p className={styles.description}>Возобновить получение сообщений от собеседника</p>
              </div>
            </> :
            <>
              <FontAwesomeIcon icon={faUserLock} />
              <div className={styles.textContainer}>
                <p className={styles.title}>Блокировать собеседника</p>
                <p className={styles.description}>Вы не будете больше получать сообщения от собеседника</p>
              </div>
            </>
          }
        </div>
      </div>
    );
  };

  return (
    <div className={styles.personGeneralInfo}>
      <div>
        <Animal
          name={selectedClient.avatarName}
          color={selectedClient.avatarColor}
          size='60px'
        />
      </div>

      <Textarea
        classNames={styles.clientName}
        value={getClientName(selectedClient.avatarColor, selectedClient.avatarName)}
        onBlur={(e) => updateClient(e, 'avatarName')}
      />
      <Popup
        body={<BlockUserPopupBody />}
        width='270px'
        position='downRight'
        isOpenPopup={isOpenBlockClientPopup}
        onClick={(bool?: boolean) => {
          if (typeof bool === 'boolean') {
            toggleIsOpenBlockClientPopup(bool);
          } else {
            toggleIsOpenBlockClientPopup(true);
          }
        }}
      >
        <div className={styles.blackListIcon}>
          <FontAwesomeIcon icon={faEllipsisV} color='$brown-5' />
        </div>
      </Popup>
    </div>
  );
}