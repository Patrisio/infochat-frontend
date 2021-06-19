import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

import Avatar from '../../../../components/Avatar/Avatar';

import { formatDateToCustomDate } from '../../../../lib/utils/date';
import styles from './note.module.scss';


interface NoteProps {
  id: number,
  madeBy: string,
  text: string,
  timestamp: number,
  removeNote: (id: number) => void,
}

export default function Note({ id, madeBy, text, timestamp, removeNote }: NoteProps) {
  return (
    <div className={styles.noteContainer}>
      <div className={styles.noteHeader}>
        <div className={styles.avatarNameContainer}>
          <Avatar
            name={madeBy}
            size='small'
          />
          <span className={styles.teammateName}>{madeBy}</span>
        </div>

        <div className={styles.date}>
          {formatDateToCustomDate(timestamp, 'DD.MM.YYYY')}
        </div>
        <div
          className={styles.deleteIcon}
          onClick={() => removeNote(id)}
        >
          <FontAwesomeIcon
            icon={faTimes}
            color='#ee6953'
          />
        </div>
      </div>

      <div>
        {text}
      </div>
    </div>
  );
}