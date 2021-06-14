import React, { useEffect, useState, useContext, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';

import Button from '../../../../components/Button/Button';
import Popup from '../../../../components/Popup/Popup';

import socket from '../../../../socket';
import styles from './messageInputContainer.module.scss';
import {
  addIncomingMessage, assignTeammate,
  addIncomingMessageForSelectedClient,
  addToInboxIncomingMessage,
  fetchTemplates, changeMessagesStatus
} from '../../../../actions';
import { Context } from '../../../../context/Context';

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
}

interface IClient {
  projectId: string,
  clientId: string,
  messagesHistory: IMessagesHistory[],
}

interface Template {
  id: string,
  name: string,
  message: string,
}

interface Templates {
  templates: Template[]
}

interface RootState {
  inbox: {
    messages: IMessagesHistory[],
    incomingMessages: IIncomingMessage[],
    selectedClient: IIncomingMessage
  },
  templates: Templates
}

export default function MessageInputContainer() {
  let { projectId, dialogType } = useParams<{ projectId: string, dialogType: string }>();
  let pressed = new Set();

  const { currentUser } = useContext(Context);
  const inputAreaRef = useRef<HTMLDivElement>(null);

  const selectedClient = useSelector((state: RootState) => state.inbox.selectedClient);
  const templates = useSelector((state: RootState) => state.templates.templates);
  const isAssigned = Boolean(selectedClient.assignedTo);
  const dispatch = useDispatch();

  const [isOpenTemplatesPopup, toggleTemplatesPopup] = useState(false);
  const [userTemplatesInput, setUserTemplatesInput] = useState('');

  const clearInputArea = (inputArea: any) => {
    setTimeout(() => {
      for (let i = 0; i < inputArea.children.length; i++) {
        inputArea.children[i].remove();
      }
    }, 0)
  };

  const sendMessage = (inputArea: any) => {
    const message = inputArea.innerHTML;
    const timestamp = Date.now();
    const newMessage = {
      clientId: selectedClient.clientId,
      username: 'operator',
      message,
      timestamp,
      assignedTo: selectedClient.assignedTo
    };

    const successCallback = () => {
      dispatch(addIncomingMessage({
        clientId: selectedClient.clientId,
        projectId,
        messagesHistory: [newMessage]
      }));

      dispatch(addIncomingMessageForSelectedClient(newMessage));

      inputArea.innerHTML = '';
      clearInputArea(inputArea);
      socket.emit('operatorMessageFromInfochat', {
        room: selectedClient.clientId,
        message: {
          clientId: selectedClient.clientId,
          projectId,
          message: newMessage,
          timestamp,
        }
      }, 
      (data: any) => console.log(data));
    };

    dispatch(addToInboxIncomingMessage({
      clientId: selectedClient.clientId,
      projectId,
      message: newMessage,
      timestamp,
      successCallback,
    }));
  };

  const runOnKeys = (event: any, func: any) => {
    const inputArea = event.target;

    pressed.add(event.which);

    if (pressed.has(16)) {
      return;
    }

    if (pressed.has(13) && pressed.size === 1 && inputArea.textContent !== '') {
      func(inputArea);
    }
    
    pressed.clear();

    document.addEventListener('keyup', function(event) {
      pressed.delete(event.which);
    });
  }

  const appointDialog = () => {
    dispatch(changeMessagesStatus({
      messagesStatus: 'opened',
      assignedTo: currentUser.email,
      projectId,
      clientId: selectedClient.clientId,
    }));
  };

  const checkForTemplates = (e: any) => {
    const inputAreaValue = e.target.textContent;
    
    if (inputAreaValue.includes('/')) {
      toggleTemplatesPopup(true);
      setUserTemplatesInput(inputAreaValue.substr(1));
    } else {
      toggleTemplatesPopup(false);
    }
  };

  const filteredTemplates = () => {
    return templates.filter((template) => {
      const templateName = template.name.toLowerCase();
      const userTemplateInput = userTemplatesInput.toLowerCase();

      return templateName.includes(userTemplateInput);
    });
  };

  const insertTemplate = (message: string) => {
    const inputArea = inputAreaRef.current;

    if (inputArea) {
      inputArea.innerHTML = message;
      inputArea.focus();
      toggleTemplatesPopup(false);
    }
  };

  const Templates = () => {
    const templates = filteredTemplates();

    return (
      <div className={styles.templatesContainer}>
        {
          templates.length > 0 ?
          templates.map(({ id, name, message }) => {
            return (
              <div
                key={id}
                className={styles.templateEntity}
                onClick={() => insertTemplate(message)}
              >
                <div className={styles.templateName}>{ name }</div>
                <div
                  className={styles.templateMessage}
                  dangerouslySetInnerHTML={{ __html: message }}
                />
              </div>
            );
          }) :
          <p className={styles.noMatchesFound}>Совпадений не найдено</p>
        }
      </div>
    )
  }

  useEffect(() => {
    dispatch(fetchTemplates({ projectId }));
  }, []);

  return (
    <>
      {
        isAssigned ?
        <Popup
          body={<Templates />}
          width='100%'
          isOpenPopup={isOpenTemplatesPopup}
          position='top'
        >
          <div
            ref={inputAreaRef}
            className={styles.inputArea}
            placeholder='Введите сообщение'
            contentEditable
            onKeyDown={(e) => runOnKeys(e, sendMessage)}
            onKeyUp={(e) => checkForTemplates(e)}
          />
        </Popup>:
        <div className={styles.appointedContainer}>
          <div className={styles.appointedArea}>
            <Button
              type='button'
              fluid
              background='success'
              onClick={appointDialog}
              stylesList={{
                padding: '7px 5px',
              }}
            >
              Взять в работу
            </Button>

            <p className={styles.appointedNotice}>Диалог будет закреплен за вами</p>
          </div>
        </div>
      }
    </>
  );
}