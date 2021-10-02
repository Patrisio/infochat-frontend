import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

import Avatar from 'ui/Avatar/Avatar';

import { formatDateToCustomDate } from '../../../../lib/utils/date';
import styles from './note.module.scss';


interface NoteProps {
  id: number,
  madeBy: string,
  text: string,
  timestamp: number,
  confirmRemoveNote: (id: number, text: string) => void,
}

export default function Note({
  id,
  madeBy,
  text,
  timestamp,
  confirmRemoveNote
}: NoteProps) {
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
          onClick={() => confirmRemoveNote(id, text)}
        >
          <FontAwesomeIcon
            icon={faTimes}
            color='$orange-1'
          />
        </div>
      </div>

      <div>
        {text}
      </div>
    </div>
  );
}