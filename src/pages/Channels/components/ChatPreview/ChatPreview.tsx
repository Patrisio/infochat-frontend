import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import styles from './chatPreview.module.scss';
import fakeAvatar from '../../../../assets/fake-avatar.jpg';
import chatTriggerIcon from '../../../../assets/chat-trigger-icon.svg';
import theme1 from '../../../../assets/theme1-big.png';
import theme2 from '../../../../assets/theme2-big.png';
import theme3 from '../../../../assets/theme3-big.png';

import { updateChannelSettings } from '../../../../actions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSmileBeam, faPaperclip, faTimes } from '@fortawesome/free-solid-svg-icons'

interface State{
  channels: [],
  settings: {
    chatName: string,
    greeting: string,
    backgroundImage: number,
    buttonLocation: string,
    buttonScale: string,
    buttonText: string,
    infochatLinkEnabled: number,
    customCss: string,
    responseTimeText: { id: string, value: string },
  },
}

interface RootState {
  channels: State,
}

interface Background {
  id: number,
  path: string,
}

export default function ChatPreview() {
  const settings = useSelector((state: RootState) => state.channels.settings);
  let dispatch = useDispatch();
  const buttonTrigger = useRef<HTMLDivElement>(null);

  const backgrounds: Background[] = [
    {
      id: 1,
      path: theme1,
    },
    {
      id: 2,
      path: theme2,
    },
    {
      id: 3,
      path: theme3,
    },
    {
      id: 4,
      path: '',
    },
  ];

  const getBackgroundImageSettings = () => {
    const imagePath = backgrounds.find((bg: Background) => bg.id === settings.backgroundImage)?.path;

    if (imagePath) return {
      backgroundImage: `url(${imagePath})`,
      backgroundSize: 'cover',
    };

    return {};
  };

  useEffect(() => {
    const triggerRef = buttonTrigger.current;

    if (triggerRef) {
      const buttonWidth = Math.ceil((triggerRef.getBoundingClientRect().width) / parseFloat(settings.buttonScale));
      console.log(buttonWidth);
      dispatch(updateChannelSettings({ buttonWidth }));
    }
  }, [settings.buttonText, settings.buttonScale]);

  return (
    <div className={styles.chatPreviewContainer}>
      <div className={styles.chatPreview}>
        <div className={styles.chatPreviewHeader}>
          <div className={styles.chatName}>{ settings.chatName }</div>
          <div className={styles.responseTimeText}>{ settings.responseTimeText }</div>
          {
            settings.greeting &&
            <div>{ settings.greeting }</div>
          }
        </div>

        <div
          className={styles.chatPreviewBody}
          style={getBackgroundImageSettings()}
        >
          <div className={styles.fakeMessageContainer}>
            <div className={styles.fakeAvatar}>
              <img
                className={styles.image}
                src={fakeAvatar}
                alt='fake-teammate-avatar'
              />
            </div>
            <div className={styles.fakeMessage}>
              Привет.<br />Могу я вам помочь.
            </div>
          </div>

          {
            Boolean(settings.infochatLinkEnabled) &&
            <p className={styles.infochatLink}>Работает на технологии <span className={styles.link}>InfoChat</span></p>
          }
        </div>

        <div className={styles.chatPreviewInputArea}>
          <span>Напишите нам…</span>
          <div>
            <FontAwesomeIcon icon={faSmileBeam} className={styles.emojiIcon}/>
            <FontAwesomeIcon icon={faPaperclip} />
          </div>
        </div>
      </div>

      <div
        className={`
          ${styles.chatPreviewTrigger}
          ${settings.buttonText ? styles.buttonTextExistStyles : styles.buttonTextNotExistStyles}
          ${settings.buttonLocation === 'left' ? styles.leftPosition :  styles.rightPosition}
        `}
        style={{
          transform: `scale(${settings.buttonScale})`,
        }}
      >
        <div>
          {
            settings.buttonText ?
            <div
              ref={buttonTrigger}
              className={styles.triggerContent}
            >
              <span className={styles.triggerText}>{ settings.buttonText }</span>
              <img src={chatTriggerIcon} alt='chat-trigger-icon' />
            </div> :
            <FontAwesomeIcon
              icon={faTimes}
              color='$white-1'
              size='lg'
            />
          }
        </div>
      </div>
    </div>
  );
}