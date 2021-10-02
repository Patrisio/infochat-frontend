import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';

import Button from 'ui/Button/Button';

import styles from './buttonsGroup.module.scss';
import { useActions } from 'hooks/useActions';
import { useTypedSelector } from 'hooks/useTypedSelector';

interface ButtonsGroupProps {
  hasChanges: boolean,
  toggleChanges: (bool: boolean) => void,
  setActiveTab?: (index: number) => void,
  resetBlockSettings: () => void,
  saveChangesCallback?: () => void,
}

export default function ButtonsGroup({
  hasChanges, toggleChanges, setActiveTab,
  resetBlockSettings, saveChangesCallback,
}: ButtonsGroupProps) {
  const [isOpenButtonsGroup, toggleState] = useState<boolean>(hasChanges);
  const { settings } = useTypedSelector(state => state.channels);
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
              saveChatSettings({ settings, projectId });
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