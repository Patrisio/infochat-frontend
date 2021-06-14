import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';

import styles from './chat.module.scss';
import { updateChannelSettings } from '../../actions'; 
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
  let chatTrigger = useRef<HTMLDivElement>(null);

  let { clientId } = useParams<ParamTypes>();
  const dispatch = useDispatch();

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
      dispatch(updateChannelSettings(chatSettings));
    });

    return () => {
      socket.off('transferChatSettingsToChatTrigger');
    }
  }, [socket]);

  return (
    <div
      ref={chatTrigger}
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
        isOpen ?
        <FontAwesomeIcon icon={faTimes} color='#fff' /> :
        <img
          src={chatTriggerIcon}
          alt='chat-trigger-icon'
          className={styles.chatTriggerIcon}
        />
      }
    </div>
  );
}