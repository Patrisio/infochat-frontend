import React, { useEffect, useState, useContext, useRef } from 'react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';

import Popup from '../../../../components/Popup/Popup';
import Textarea from '../../../../components/Textarea/Textarea';

import socket from '../../../../socket';
import styles from './messageInputContainer.module.scss';
import { scrollToBottomOfWrapper } from '../../../../lib/utils/scroll';
import { replaceBrToWhiteSpace, replaceWhiteSpaceToBr } from '../../../../utils/string';
import { useActions } from '../../../../hooks/useActions';
import { useTypedSelector } from '../../../../hooks/useTypedSelector';
import { Context } from '../../../../context/Context';

interface MessageInputContainerProps {
  messagesHistoryContainerElement: HTMLDivElement | null,
}

export default function MessageInputContainer({ messagesHistoryContainerElement }: MessageInputContainerProps) {
  let { projectId } = useParams<{ projectId: string }>();

  const { currentUser } = useContext(Context);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { selectedClient } = useTypedSelector(state => state.inbox);
  const { templates } = useTypedSelector(state => state.templates);
  const isAssigned = Boolean(selectedClient.assignedTo);
  const {
    addIncomingMessage, addIncomingMessageForSelectedClient,
    addToInboxIncomingMessage, fetchTemplates, changeMessagesStatus,
  } = useActions();

  const [isOpenTemplatesPopup, toggleTemplatesPopup] = useState(false);
  const [userTemplatesInput, setUserTemplatesInput] = useState('');
  const [inputAreaValue, setInputAreaValue] = useState('');

  const sendMessage = (inputArea: any) => {
    const message = inputArea;
    const timestamp = Date.now();
    const newMessage = {
      clientId: selectedClient.clientId,
      username: 'operator',
      message,
      timestamp,
      assignedTo: selectedClient.assignedTo
    };

    const successCallback = () => {
      addIncomingMessage({
        clientId: selectedClient.clientId,
        projectId,
        messagesHistory: [newMessage]
      });

      addIncomingMessageForSelectedClient(newMessage);

      setInputAreaValue('');
      scrollToBottomOfWrapper(messagesHistoryContainerElement);
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

    addToInboxIncomingMessage({
      clientId: selectedClient.clientId,
      projectId,
      message: newMessage,
      timestamp,
      successCallback,
    });
  };

  const appointDialog = () => {
    const changeMessagesStatusData = {
      messagesStatus: 'opened',
      assignedTo: currentUser.email,
      projectId,
      clientId: selectedClient.clientId
    };
    
    changeMessagesStatus({
      ...changeMessagesStatusData,
      successCallback: () => {
        socket.emit('changeMessagesStatus', changeMessagesStatusData, (data: any) => console.log(data));
      },
    });
  };

  const checkForTemplates = (e: any) => {
    const inputAreaValue = e.target.value;
    
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
    const formattedMessage = replaceBrToWhiteSpace(message);
    setInputAreaValue(formattedMessage);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
    toggleTemplatesPopup(false);
  };

  const handleKeyPress = (e: any) => {
    const message = e.target.value;
    if (e.shiftKey) return;
    if (message.indexOf('\n') === 0) {
      setInputAreaValue('');
      return;
    }

    const formattedMessage = replaceWhiteSpaceToBr(message);
    if (formattedMessage && e.which === 13) {
      sendMessage(formattedMessage)
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
    fetchTemplates({ projectId });
  }, []);

  useEffect(() => {
    const textAreaElement = textareaRef.current;

    if (textAreaElement) {
      textAreaElement.focus();
    }

    scrollToBottomOfWrapper(messagesHistoryContainerElement);
  }, [selectedClient]);

  return (
    <>
      {
        isAssigned ?
        <div className={styles.messagesInputArea}>
          <Popup
            body={<Templates />}
            width='100%'
            isOpenPopup={isOpenTemplatesPopup}
            position='top'
          >
            <Textarea
              ref={textareaRef}
              classNames={styles.inputArea}
              value={inputAreaValue}
              placeholder='Введите символ /, чтобы использовать быстрые ответы'
              onKeyUp={(e) => checkForTemplates(e)}
              onChange={(e) => setInputAreaValue(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </Popup>
        </div> :
        <div className={styles.appointedContainer}>
          <div className={styles.appointedArea}>
            <Link
              to={`/project/${projectId}/inbox/opened`}
              onClick={appointDialog}
              className={styles.appointDialogLink}
            >
              Взять в работу
            </Link>

            <p className={styles.appointedNotice}>Диалог будет закреплен за вами</p>
          </div>
        </div>
      }
    </>
  );
}