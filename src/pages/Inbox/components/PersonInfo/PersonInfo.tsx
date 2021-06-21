import React from 'react';
import { useParams } from 'react-router';
import { useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';

import Accordion from '../../../../components/Accordion/Accordion';
import Animal from '../../../../components/Animal/Animal';
import Textarea from '../../../../components/Textarea/Textarea';

import ChangesHistory from './components/ChangesHistory/ChangesHistory';
import Notes from './components/Notes/Notes';
import GeneralInfo from './components/GeneralInfo/GeneralInfo';
import AssignedTeammates from './components/AssignedTeammates/AssignedTeammates';
import { ModalProps } from '../../../../components/Modal/Modal';

import {
  updateIncomingMessage, updateSelectedClient,
  updateClientData as updateClientDataAction
} from '../../../../actions';
import { SelectedClient } from '../../../../reducers/inbox';
import styles from './personInfo.module.scss';
import { getClientName, getChangeInFieldValue } from '../../../../utils/clientData';

interface PersonInfoProps {
  selectedClient: SelectedClient,
  closeModal: ModalProps['onClose'],
  setModalProps: (data: ModalProps) => void
}

export default function PersonInfo({ selectedClient, closeModal, setModalProps }: PersonInfoProps) {
  let fieldInitialValue: string | null = '';
  
  const dispatch = useDispatch();
  let { projectId } = useParams<{ projectId: string }>();

  const clientData = {
    avatarName: selectedClient.avatarName,
    email: selectedClient.email,
    phone: selectedClient.phone,
    assignedTo: selectedClient.assignedTo,
    clientId: selectedClient.clientId,
    projectId,
  };

  const updateClientData = (e: any, fieldName: string) => {
    const target = e.target;
    const fieldValue: string | null = target.value;
    const isDifferentFieldValues = fieldInitialValue !== fieldValue;

    if (fieldName && isDifferentFieldValues) {
      const successCallback = () => {
        dispatch(updateIncomingMessage({
          clientId: selectedClient?.clientId,
          [fieldName]: fieldValue
        }));
        dispatch(updateSelectedClient({
          [fieldName]: fieldValue,
          changesHistory: [
            ...selectedClient.changesHistory,
            {
              before: selectedClient[fieldName],
              after: fieldValue,
              changeInFieldValue: getChangeInFieldValue(fieldName),
              timestamp: Date.now(),
            }
          ],
        }));
      };

      dispatch(updateClientDataAction(Object.assign(clientData, {
        updatedBy: 'operator',
        [fieldName]: fieldValue,
        changeInFieldValue: getChangeInFieldValue(fieldName),
        successCallback,
      })));
    }
  };

  const panels = [
    {
      title: 'Основное',
      count: null,
      content: (
        <GeneralInfo
          selectedClient={selectedClient}
          updateClientData={updateClientData}
        />
      ),
    },
    {
      title: 'Назначить на',
      count: null,
      content: <AssignedTeammates selectedClient={selectedClient} />,
    },
    {
      title: 'Заметки',
      count: selectedClient.notes && selectedClient.notes.length,
      content: (
        <Notes
          selectedClient={selectedClient}
          setModalProps={setModalProps}
          closeModal={closeModal}
        />
      ),
    },
    {
      title: 'История изменений',
      count: selectedClient.changesHistory && selectedClient.changesHistory.length,
      content: <ChangesHistory selectedClient={selectedClient} />,
    },
  ];

  return (
    <div className={styles.personInfoContainer}>
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

        <div className={styles.blackListIcon}>
          <FontAwesomeIcon icon={faEllipsisV} color='#444' />
        </div>
      </div>

      <Accordion
        panels={panels}
      />
    </div>
  );
}