import React from 'react';
import { useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';

import Accordion from '../../../../components/Accordion/Accordion';
import ClientInfoSkeleton from '../../../../components/Skeleton/ClientInfoSkeleton/ClientInfoSkeleton';

import ChangesHistory from './components/ChangesHistory/ChangesHistory';
import Notes from './components/Notes/Notes';
import GeneralInfo from './components/GeneralInfo/GeneralInfo';
import AssignedTeammates from './components/AssignedTeammates/AssignedTeammates';
import ClientPreview from './components/ClientPreview/ClientPreview';
import { ModalProps } from '../../../../components/Modal/Modal';

import { useActions } from '../../../../hooks/useActions';
import { SelectedClient } from '../../../../types/inbox';
import styles from './personInfo.module.scss';
import { getClientName, getChangeInFieldValue } from '../../../../utils/clientData';

interface PersonInfoProps {
  selectedClient: SelectedClient,
  closeModal: ModalProps['onClose'],
  setModalProps: (data: ModalProps) => void
}

export default function PersonInfo({ selectedClient, closeModal, setModalProps }: PersonInfoProps) {
  const isFetchingSelectedClienInfo = useSelector((state: any) => state.inbox.isFetchingSelectedClienInfo);

  let fieldInitialValue: string | null = '';
  
  const dispatch = useDispatch();
  const { updateIncomingMessage, updateSelectedClient, updateClientData } = useActions();
  let { projectId } = useParams<{ projectId: string }>();

  const clientData = {
    avatarName: selectedClient.avatarName,
    email: selectedClient.email,
    phone: selectedClient.phone,
    assignedTo: selectedClient.assignedTo,
    clientId: selectedClient.clientId,
    projectId,
  };

  const updateClient = (e: any, fieldName: string) => {
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

      dispatch(updateClientData(Object.assign(clientData, {
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
      isVisible: true,
      content: (
        <GeneralInfo
          selectedClient={selectedClient}
          updateClientData={updateClient}
        />
      ),
    },
    {
      title: 'Назначить на',
      count: null,
      isVisible: true,
      content: <AssignedTeammates selectedClient={selectedClient} />,
    },
    {
      title: 'Заметки',
      count: selectedClient.notes && selectedClient.notes.length,
      isVisible: true,
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
      isVisible: selectedClient.changesHistory && selectedClient.changesHistory.length > 0,
      content: <ChangesHistory selectedClient={selectedClient} />,
    },
  ];

  return (
    <div className={styles.personInfoContainer}>
      {
        isFetchingSelectedClienInfo ?
        <ClientInfoSkeleton />:
        <>
          <ClientPreview
            selectedClient={selectedClient}
            updateClientData={updateClient}
          />

          <Accordion
            panels={panels}
          />
        </>
      }
    </div>
  );
}