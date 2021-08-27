import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';

import Button from '../../../../components/Button/Button';

import styles from './buttonsGroup.module.scss';
import { useActions } from '../../../../hooks/useActions';

interface Props {
  hasChanges: Boolean,
  toggleChanges: (bool: boolean) => void,
  setActiveTab?: (index: number) => void,
  resetBlockSettings: () => void,
  saveChangesCallback?: () => void,
}

interface Settings {
  chatName: '',
  greeting: '',
  backgroundImage: 1,
  buttonLocation: '',
  buttonScale: '',
  buttonText: '',
  infochatLinkEnabled: 1,
  customCss: '',
}

interface State {
  channels: [],
  settings: Settings,
}

interface RootState {
  channels: State,
}

export default function ButtonsGroup({ hasChanges, toggleChanges, setActiveTab, resetBlockSettings, saveChangesCallback }: Props) {
  const [isOpenButtonsGroup, toggleState] = useState(hasChanges);
  const settings = useSelector((state: RootState) => state.channels.settings);
  const { saveChatSettings } = useActions();
  let { projectId } = useParams<{ projectId: string }>();

  useEffect(() => {
    toggleState(hasChanges);
  }, [hasChanges]);

  return (
    <div className={styles.footer}>
      {
        isOpenButtonsGroup ? 
        <>
          <Button
            type='button'
            fluid
            classNames={styles.saveBtn}
            onClick={() => {
              saveChatSettings(settings, projectId);
              saveChangesCallback && saveChangesCallback();
              toggleChanges(false);
            }}
          >
            Сохранить
          </Button>
          <Button
            type='button'
            background='edit'
            fluid
            classNames={styles.cancelBtn}
            onClick={() => {
              toggleChanges(false);
              setActiveTab && setActiveTab(-1);
              resetBlockSettings();
            }}
          >
            Отмена
          </Button>
        </> :
        <Button
          type='button'
          background='edit'
          classNames={styles.closeBtn}
          onClick={() => setActiveTab && setActiveTab(-1)}
        >
          Закрыть
        </Button>
      }
    </div>
  );
}