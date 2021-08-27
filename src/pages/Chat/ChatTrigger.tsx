import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';

import styles from './chat.module.scss';
import { useActions } from '../../hooks/useActions'; 
import socket from '../../socket';
import chatTriggerIcon from '../../assets/chat-trigger-icon.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

interface ParamTypes {
  clientId: string,
  projectId: string
}

export default function ChatTrigger() {
  const settings = useSelector((state: any) => state.channels.settings);
  const [isOpen, toggleOpen] = useState(false);

  let { clientId } = useParams<ParamTypes>();
  const { updateChannelSettings } = useActions();

  const sendPostMessage = () => {
    toggleOpen(prev => !prev);
    window.parent.postMessage({
      event: 'updateChatWindowIsOpen',
      chatWindowIsOpen: !isOpen
    }, '*');
  };

  useEffect(() => {
    socket.emit('joinRoom', clientId);
  }, []);

  useEffect(() => {
    socket.on('transferChatSettingsToChatTrigger', (chatSettings: any) => {
      updateChannelSettings(chatSettings);
    });

    return () => {
      socket.off('transferChatSettingsToChatTrigger');
    }
  }, [socket]);

  return (
    <div
      className={`
        ${styles.chatTrigger}
        ${settings.buttonText ? styles.ellipsisChatTriggerStyles : styles.roundChatTriggerStyles}
      `}
      onClick={sendPostMessage}
    >
      {
        settings.buttonText ?
        <div className={styles.triggerContent}>
          <span className={styles.triggerText}>{ settings.buttonText }</span>
          <img src={chatTriggerIcon} alt='chat-trigger-icon' />
        </div> :
        <>
          <div className={`
            ${styles.closeTriggerIcon}
            ${isOpen ? styles.closeTriggerIconVisible : styles.closeTriggerIconHidden}
          `}>
            <FontAwesomeIcon icon={faTimes} color='$white-1' />
          </div>
          <img
            src={chatTriggerIcon}
            alt='chat-trigger-icon'
            className={`
              ${styles.chatTriggerIcon}
              ${isOpen ? styles.chatTriggerIconHidden : styles.chatTriggerIconVisible}
            `}
          />
        </>
      }
    </div>
  );
}