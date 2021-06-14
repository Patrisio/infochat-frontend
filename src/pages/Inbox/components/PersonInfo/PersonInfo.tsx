import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';

import Accordion from '../../../../components/Accordion/Accordion';
import Animal from '../../../../components/Animal/Animal';
import Input from '../../../../components/Input/Input';
import Tabs from '../../../../components/Tabs/Tabs';

import {
  updateIncomingMessage, updateSelectedClient, changeMessagesStatus,
  updateClientData as updateClientDataAction
} from '../../../../actions';
import { Context } from '../../../../context/Context';

import styles from './personInfo.module.scss';
import { getClientName } from '../../../../utils/clientData';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import cloneDeep from 'lodash/cloneDeep';

interface IMessagesHistory {
  message: string,
  clientId: string,
  username: string
}

interface IIncomingMessage {
  id: string,
  projectId: string,
  clientId: string,
  messagesHistory: IMessagesHistory[],
  assignedTo: string | null,
  avatarName: string,
  avatarColor: string,
  email: string,
  phone: string,
}

interface IClient {
  projectId: string,
  clientId: string,
  messagesHistory: IMessagesHistory[],
}

interface RootState {
  inbox: {
    messages: IMessagesHistory[],
    incomingMessages: IIncomingMessage[],
    selectedClient: IIncomingMessage
  },
  teammates: {
    teammates: Teammate[],
  },
}

interface Teammate {
  avatar: string,
  email: string,
  role: string,
  status: string,
  username: string,
}

interface ITeammate {
  id?: string,
  icon?: string,
  value: string | '' |  null,
}

interface IProps {
  selectedClient: IIncomingMessage
}

interface IGeneralInfoItem {
  name: string,
  field: string,
  value: string,
  isEditable: boolean,
}

export default function PersonInfo({ selectedClient }: IProps) {
  const defaultGeneralInfo = [
    {
      name: 'Телефон',
      field: 'phone',
      value: 'Добавить',
      isEditable: true,
    },
    {
      name: 'E-mail',
      field: 'email',
      value: 'Добавить',
      isEditable: true,
    },
  ];
  let fieldInitialValue: string | null = '';
  const [assignedTeammates, setAssignedTeammate] = useState<ITeammate[]>([]);
  const [generalInfo, setGeneralInfo] = useState<IGeneralInfoItem[]>(defaultGeneralInfo);
  const teammates = useSelector((state: RootState) => state.teammates.teammates);
  const incomingMessages = useSelector((state: RootState) => state.inbox.incomingMessages);
  const dispatch = useDispatch();
  let { projectId } = useParams<{ projectId: string }>();
  const { currentUser } = useContext(Context);

  const clientData = {
    avatarName: selectedClient.avatarName,
    email: selectedClient.email,
    phone: selectedClient.phone,
    assignedTo: selectedClient.assignedTo,
    clientId: selectedClient.clientId,
    projectId,
  };

  useEffect(() => {
    console.log('aaaaaaaaaa');
    const assignedTeammate = {
      value: selectedClient.assignedTo,
    };
    const generalClientData = generalInfo.reduce((acc: IGeneralInfoItem[], field: IGeneralInfoItem) => {
      if (field.field === 'phone') {
        field.value = selectedClient.phone;
      }

      if (field.field === 'email') {
        field.value = selectedClient.email;
      }
      
      return acc.concat(field);
    }, []);

    setAssignedTeammate([assignedTeammate].filter(item => item.value !== '' && item.value !== null));
    setGeneralInfo(generalClientData);
  }, [selectedClient.clientId]);

  const assignTeammate = (teammate: ITeammate) => {
    dispatch(changeMessagesStatus({
      clientId: selectedClient.clientId,
      projectId,
      assignedTo: teammate.id,
      messagesStatus: 'opened',
    }));
    setAssignedTeammate((prev) => prev.concat(teammate));
  };

  const removeAssignedTeammate = (teammate: ITeammate) => {
    dispatch(changeMessagesStatus({
      clientId: selectedClient.clientId,
      projectId,
      assignedTo: '',
      messagesStatus: 'opened',
    }));

    setAssignedTeammate((prev) => prev.filter((assignedTeammate) => assignedTeammate.value !== teammate.value));
  };

  const getTeammates = () => {
    return teammates.map((teammate) => ({
      id: teammate.email,
      value: teammate.username
    }));
  };

  const updateClientData = (e: React.SyntheticEvent) => {
    const target = e.currentTarget;
    const fieldValue: string | null = target.textContent;
    const fieldName: string | null | undefined = target.parentElement?.getAttribute('data-field');
    const isDifferentFieldValues = fieldInitialValue !== fieldValue;

    if (fieldName && isDifferentFieldValues) {
      const successCallback = () => {
        dispatch(updateIncomingMessage({
          clientId: selectedClient?.clientId,
          [fieldName]: fieldValue
        }));
      };

      dispatch(updateClientDataAction(Object.assign(clientData, {
        [fieldName]: fieldValue,
        successCallback,
      })));
    }
  };

  const saveInitialFieldValue = (e: React.SyntheticEvent) => {
    const target = e.currentTarget;
    fieldInitialValue = target.textContent;
  };

  return (
    <div className={styles.personInfoContainer}>
      <div className={styles.personGeneralInfo}>
        <Animal
          name={selectedClient.avatarName}
          color={selectedClient.avatarColor}
          size='60px'
        />

        <div
          className={styles.clientName}
        >
          { getClientName(selectedClient.avatarColor, selectedClient.avatarName) }
        </div>

        <div className={styles.blackListIcon}>
          <FontAwesomeIcon icon={faEllipsisV} color='#444' />
        </div>
      </div>

      <Accordion
        title='Основное'
      >
        <ul className={styles.generalList}>
          {
            generalInfo.map((field, idx) => {
              return (
                <li
                  key={idx}
                  className={styles.generalListItem}
                  data-field={field.field}
                >
                  <span className={styles.nameField}>{field.name}:</span>
                  <span
                    className={styles.valueField}
                    contentEditable={field.isEditable}
                    suppressContentEditableWarning={true}
                    onBlur={updateClientData}
                    onFocus={saveInitialFieldValue}
                  >
                    {field.value}
                  </span>
                </li>
              );
            })
          }
        </ul>
      </Accordion>

      <Accordion
        title='Назначить на'
      >
        <div>
          <Input
            type='text'
            placeholder='+ Выбрать сотрудника'
            classNames={styles.checkTeammateInput}
            fluid
            onClick={assignTeammate}
            data={getTeammates()}
          />

          <Tabs
            data={assignedTeammates}
            removeTab={removeAssignedTeammate}
          />
        </div>
      </Accordion>

      <Accordion
        title='История изменений'
      >

      </Accordion>
    </div>
  );
}