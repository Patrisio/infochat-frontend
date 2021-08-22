import React, { useState, useContext } from 'react';
import { useDispatch } from 'react-redux';

import Note from '../../../Note/Note';
import Textarea from '../../../../../../components/Textarea/Textarea';
import Button from '../../../../../../components/Button/Button';
import { ModalProps } from '../../../../../../components/Modal/Modal';

import { Context } from '../../../../../../context/Context';
import {
  updateSelectedClient, addNote, deleteNote
} from '../../../../../../actions';
import { State } from '../../../../../../reducers/inbox';
import styles from './notes.module.scss';

interface NotesProps {
  selectedClient: State['selectedClient'],
  setModalProps: (data: ModalProps) => void,
  closeModal: ModalProps['onClose'],
}

export default function Notes({ selectedClient, setModalProps, closeModal }: NotesProps) {
  const [isOpenedNotesTextarea, toggleNotesTextarea] = useState<boolean>(false);
  const [noteText, setNoteText] = useState<string>('');

  const { currentUser } = useContext(Context);
  const dispatch = useDispatch();

  const removeNote = (id: number) => {
    dispatch(deleteNote({
      id,
      successCallback: () => dispatch(updateSelectedClient({
        notes: selectedClient.notes.filter((note) => note.id !== id),
      }))
    }));
    closeModal();
  };

  const ModalBody = ({ text }: { text: string }) => {
    return (
      <p className={styles.modalBody}>
        Вы действительно хотите удалить заметку "<span className={styles.noteText}>{text}</span>"?
      </p>
    );
  };

  const ModalFooter = ({ noteId }: { noteId: number}) => {
    return (
      <div className={styles.modalFooter}>
        <Button
          type='button'
          classNames={`${styles.button} ${styles.marginRight}`}
          background='edit'
          onClick={() => closeModal()}
        >
          Отмена
        </Button>

        <Button
          type='button'
          classNames={styles.button}
          onClick={() => removeNote(noteId)}
        >
          Удалить
        </Button>
      </div>
    );
  };

  const makeNote = () => {
    if (noteText) {
      const noteData = {
        text: noteText,
        madeBy: currentUser.username,
      };
      const addNewNote = ({ id, timestamp }: { id: number, timestamp: number }) => {
        dispatch(updateSelectedClient({
          notes: selectedClient.notes.concat({
            id,
            ...noteData,
            timestamp,
          })
        }));
        setNoteText('');
        toggleNotesTextarea(prev => !prev);
      };

      dispatch(addNote({
        ...noteData,
        clientId: selectedClient.clientId,
        successCallback: addNewNote
      }));
    }
  };

  const confirmRemoveNote = (id: number, text: string) => {
    setModalProps({
      show: true,
      title: 'Удалить заметку?',
      body: <ModalBody text={text} />,
      footer: <ModalFooter noteId={id} />,
      width: '500px',
      position: 'top',
      onClose: closeModal,
    });
  };

  const displayNotesTextarea = (e: any) => {
    e.stopPropagation();
    toggleNotesTextarea(prev => !prev);
  };

  return (
    <>
      <Button
        type='button'
        background='transparent'
        classNames={styles.addNoteBtn}
        onClick={displayNotesTextarea}
      >
        Добавить
      </Button>

      {
        isOpenedNotesTextarea &&
        <>
          <Textarea
            placeholder='Сделайте запись'
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
          />

          <div className={styles.butonsGroup}>
            <Button
              type='button'
              classNames={styles.makeNoteBtn}
              onClick={makeNote}
            >
              Создать
            </Button>
            <Button
              type='button'
              background='edit'
              classNames={styles.cancelBtn}
              onClick={() => toggleNotesTextarea(prev => !prev)}
            >
              Отмена
            </Button>
          </div>
        </>
      }

      {
        selectedClient.notes &&
        selectedClient.notes.map(({ id, madeBy, text, timestamp }) => {
          return (
            <Note
              key={id}
              id={id}
              madeBy={madeBy}
              text={text}
              timestamp={timestamp}
              confirmRemoveNote={confirmRemoveNote}
            />
          );
        })
      }
    </>
  );
}