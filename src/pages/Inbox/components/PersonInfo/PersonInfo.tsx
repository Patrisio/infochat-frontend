import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import cloneDeep from 'lodash/cloneDeep';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';

import Accordion from '../../../../components/Accordion/Accordion';
import Animal from '../../../../components/Animal/Animal';
import Input from '../../../../components/Input/Input';
import Textarea from '../../../../components/Textarea/Textarea';
import Tabs from '../../../../components/Tabs/Tabs';
import Button from '../../../../components/Button/Button';
import Note from '../Note/Note';
import Modification from '../Modification/Modification';

import {
  updateIncomingMessage, updateSelectedClient, changeMessagesStatus,
  updateClientData as updateClientDataAction, addNote, deleteNote
} from '../../../../actions';
import { Context } from '../../../../context/Context';
import { SelectedClient } from '../../../../reducers/inbox';
import styles from './personInfo.module.scss';
import { getClientName, getChangeInFieldValue } from '../../../../utils/clientData';
import { notStrictEqual } from 'assert';

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
  selectedClient: SelectedClient,
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
  const [noteText, setNoteText] = useState<string>('');
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
    const assignedTeammate = {
      value: selectedClient.assignedTo,
    };
    const generalClientData = generalInfo.reduce((acc: IGeneralInfoItem[], field: IGeneralInfoItem) => {
      if (field.field === 'phone') {
        field.value = selectedClient.phone || '';
      }

      if (field.field === 'email') {
        field.value = selectedClient.email || '';
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

  const saveInitialFieldValue = (e: any) => {
    const target = e.target;
    fieldInitialValue = target.value;
  };

  const makeNote = () => {
    if (noteText) {
      const noteData = {
        text: noteText,
        madeBy: currentUser.username,
      };
      const addNewNote = ({ id, timestamp }: { id: number, timestamp: number }) => {
        dispatch(updateSelectedClient({
          notes: selectedClient.notes.concat({
            id,
            ...noteData,
            timestamp,
          })
        }));
        setNoteText('');
      };

      dispatch(addNote({
        ...noteData,
        clientId: selectedClient.clientId,
        successCallback: addNewNote
      }));
    }
  };

  const removeNote = (id: number) => {
    dispatch(deleteNote({
      id,
      successCallback: () => dispatch(updateSelectedClient({
        notes: selectedClient.notes.filter((note) => note.id !== id),
      }))
    }));
  };

  return (
    <div className={styles.personInfoContainer}>
      <div className={styles.personGeneralInfo}>
        <Animal
          name={selectedClient.avatarName}
          color={selectedClient.avatarColor}
          size='60px'
        />

        <Textarea
          classNames={styles.clientName}
          value={getClientName(selectedClient.avatarColor, selectedClient.avatarName)}
          onBlur={(e) => updateClientData(e, 'avatarName')}
        />
        {/* <div
          className={styles.clientName}
        >
          { getClientName(selectedClient.avatarColor, selectedClient.avatarName) }
        </div> */}

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
                >
                  <span className={styles.nameField}>{field.name}:</span>
                  <Input
                    type='text'
                    placeholder='Добавить'
                    value={field.value}
                    classNames={styles.valueField}
                    onBlur={(e) => updateClientData(e, field.field)}
                    onFocus={() => saveInitialFieldValue}
                    onChange={(e) => {
                      const value = e.target.value;
                      setGeneralInfo((prev: any) => {
                        const copy = cloneDeep(prev);
                        const foundItem = copy.find((item: any) => item.field === field.field);
                        const foundItemIndex = copy.findIndex((item: any) => item.field === field.field);

                        foundItem.value = value;
                        copy.splice(foundItemIndex, 1, foundItem);

                        return copy;
                      });
                    }}
                  />
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
        title='Заметки'
      >
        <Textarea
          placeholder='Сделайте запись'
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
        />

        <div className={styles.butonsGroup}>
          <Button
            type='button'
            stylesList={{
              padding: '7px 25px',
              fontSize: '13px',
              flexBasis: '50%',
              marginRight: '15px',
            }}
            onClick={makeNote}
          >
            Создать
          </Button>
          <Button
            type='button'
            background='edit'
            stylesList={{
              padding: '7px 25px',
              fontSize: '13px',
              flexBasis: '50%',
            }}
          >
            Отмена
          </Button>
        </div>

        <>
          {
            selectedClient.notes &&
            selectedClient.notes.map(({ id, madeBy, text, timestamp }) => {
              return (
                <Note
                  key={id}
                  id={id}
                  madeBy={madeBy}
                  text={text}
                  timestamp={timestamp}
                  removeNote={removeNote}
                />
              );
            })
          }
        </>
      </Accordion>

      <Accordion
        title='История изменений'
      >
        <>
          {
            selectedClient.changesHistory &&
            selectedClient.changesHistory.map(({ before, after, changeInFieldValue, timestamp }, idx) => {
              return (
                <Modification
                  key={idx}
                  before={before}
                  after={after}
                  changeInFieldValue={changeInFieldValue}
                  timestamp={timestamp}
                />
              )
            })
          }
        </>
      </Accordion>
    </div>
  );
}