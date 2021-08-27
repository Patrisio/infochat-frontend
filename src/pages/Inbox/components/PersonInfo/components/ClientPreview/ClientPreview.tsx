import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV, faUserLock } from '@fortawesome/free-solid-svg-icons';

import Animal from '../../../../../../components/Animal/Animal';
import Textarea from '../../../../../../components/Textarea/Textarea';
import Popup from '../../../../../../components/Popup/Popup';

import { getClientName } from '../../../../../../utils/clientData';
import styles from './clientPreview.module.scss';
import { InboxState } from '../../../../../../types/inbox';

interface ClientPreviewProps {
  selectedClient: InboxState['selectedClient'],
  updateClientData: (e: any, fieldName: string) => void,
}

export default function ClientPreview({ selectedClient, updateClientData }: ClientPreviewProps) {
  const blockClient = () => {

  };
  
  const BlockUserPopupBody = () => {
    return (
      <div className={styles.popupBodyContainer}>
        <div
          className={styles.blockClientContainer}
          onClick={blockClient}
        >
          <FontAwesomeIcon icon={faUserLock} />
          <div className={styles.textContainer}>
            <p className={styles.title}>Блокировать собеседника</p>
            <p className={styles.description}>Вы не будете больше получать сообщения от собеседника</p>
          </div>
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
        onBlur={(e) => updateClientData(e, 'avatarName')}
      />
      <Popup
        body={<BlockUserPopupBody />}
        width='270px'
        position='downRight'
      >
        <div className={styles.blackListIcon}>
          <FontAwesomeIcon icon={faEllipsisV} color='$brown-5' />
        </div>
      </Popup>
    </div>
  );
}