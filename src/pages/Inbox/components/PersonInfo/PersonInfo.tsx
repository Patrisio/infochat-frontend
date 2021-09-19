import React from 'react';
import { useParams } from 'react-router';

import Accordion from '../../../../components/Accordion/Accordion';
import ClientInfoSkeleton from '../../../../components/Skeleton/ClientInfoSkeleton/ClientInfoSkeleton';

import ChangesHistory from './components/ChangesHistory/ChangesHistory';
import Notes from './components/Notes/Notes';
import GeneralInfo from './components/GeneralInfo/GeneralInfo';
import AssignedTeammates from './components/AssignedTeammates/AssignedTeammates';
import ClientPreview from './components/ClientPreview/ClientPreview';
import { ModalProps } from '../../../../components/Modal/Modal';

import { useActions } from '../../../../hooks/useActions';
import { useTypedSelector } from '../../../../hooks/useTypedSelector';
import { SelectedClient, ModificationInterface } from '../../../../types/inbox';
import styles from './personInfo.module.scss';
import { getChangeInFieldValue } from '../../../../utils/clientData';
import socket from '../../../../socket';

interface PersonInfoProps {
  selectedClient: SelectedClient,
  closeModal: ModalProps['onClose'],
  setModalProps: (data: ModalProps) => void
}

export interface ClientData {
  avatarName: SelectedClient['avatarName'],
  email: SelectedClient['email'],
  phone: SelectedClient['phone'],
  assignedTo: SelectedClient['assignedTo'],
  clientId: SelectedClient['clientId'],
  isBlocked: SelectedClient['isBlocked'],
  projectId: string,
}

export default function PersonInfo({ selectedClient, closeModal, setModalProps }: PersonInfoProps) {
  const { isFetchingSelectedClienInfo } = useTypedSelector((state) => state.inbox);

  let fieldInitialValue: string | null = '';
  
  const { updateIncomingMessage, updateSelectedClient, updateClientData } = useActions();
  let { projectId } = useParams<{ projectId: string }>();

  const clientData: ClientData = {
    avatarName: selectedClient.avatarName,
    email: selectedClient.email,
    phone: selectedClient.phone,
    assignedTo: selectedClient.assignedTo,
    clientId: selectedClient.clientId,
    isBlocked: selectedClient.isBlocked,
    projectId,
  };

  const updateClient = (e: any, fieldName: string) => {
    const target = e.target;
    const fieldValue: string | null = target.value;
    const isDifferentFieldValues = fieldInitialValue !== fieldValue;

    if (fieldName && isDifferentFieldValues) {
      const successCallback = () => {
        const updateIncomingMessageData = {
          clientId: selectedClient?.clientId,
          [fieldName]: fieldValue
        }
        const updateSelectedClientData: Partial<SelectedClient> = {
          [fieldName]: fieldValue,
          changesHistory: [
            ...selectedClient.changesHistory,
            {
              before: selectedClient[fieldName],
              after: fieldValue,
              changeInFieldValue: getChangeInFieldValue(fieldName),
              timestamp: Date.now(),
            }
          ] as ModificationInterface[],
        };
        updateIncomingMessage(updateIncomingMessageData);
        updateSelectedClient(updateSelectedClientData);

        socket.emit('updateIncomingMessage', updateIncomingMessageData);
        socket.emit('updateSelectedClient', updateSelectedClientData);
      };

      // export interface IIncomingMessage extends Partial<Callbacks> {
      //   [key: string]: any,
        
      //   projectId: string,
      //   clientId: string,
      //   messagesHistory: IMessagesHistory[],
      //   assignedTo: string | null,
      //   phone: string,
      //   email: string,
      //   avatarName: string,
      //   avatarColor: string,
      //   messagesStatus: 'unread' | 'opened' | 'closed',
      //   message?: IMessagesHistory,
      //   timestamp?: number,
      // }

      // export interface SelectedClientUpdatePayload extends Callbacks {
      //   projectId: string,
      //   clientId: string,
      //   assignedTo: string,
      //   avatarName: string,
      //   changeInFieldValue: string,
      //   email: string,
      //   isBlocked: boolean,
      //   phone: string,
      //   updatedBy: Role | 'client',
      // }

      updateClientData(
        // Object.assign(clientData,
          {
            updatedBy: 'operator',
            [fieldName]: fieldValue,
            changeInFieldValue: getChangeInFieldValue(fieldName),
            successCallback,
          }
      // )
      );
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
        <ClientInfoSkeleton /> :
        <>
          <ClientPreview
            clientData={clientData}
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