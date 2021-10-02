import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

import { useActions } from 'hooks/useActions';
import { useTypedSelector } from 'hooks/useTypedSelector';

import socket from '../../socket';
import chatTriggerIcon from '../../assets/chat-trigger-icon.svg';
import { Settings } from '../../types/channels';

import styles from './chat.module.scss';
import colors from '../../scss/variables.module.scss';

interface ParamTypes {
  clientId: string,
  projectId: string
}

export default function ChatTrigger() {
  const { settings } = useTypedSelector(state => state.channels);
  const [isOpen, toggleOpen] = useState<boolean>(false);

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
    socket.on('transferChatSettingsToChatTrigger', (chatSettings: Settings) => {
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
            <FontAwesomeIcon icon={faTimes} color={colors.white1} />
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