import React, { useState, useEffect, useContext } from 'react';
import { useDispatch } from 'react-redux';

import Note from '../../../Note/Note';
import Textarea from '../../../../../../components/Textarea/Textarea';
import Button from '../../../../../../components/Button/Button';
import { ModalProps } from '../../../../../../components/Modal/Modal';

import { Context } from '../../../../../../context/Context';
import { useActions } from '../../../../../../hooks/useActions';
import { InboxState } from '../../../../../../types/inbox';
import styles from './notes.module.scss';
import socket from '../../../../../../socket';

interface NotesProps {
  selectedClient: InboxState['selectedClient'],
  setModalProps: (data: ModalProps) => void,
  closeModal: ModalProps['onClose'],
}

export default function Notes({ selectedClient, setModalProps, closeModal }: NotesProps) {
  const [isOpenedNotesTextarea, toggleNotesTextarea] = useState<boolean>(false);
  const [noteText, setNoteText] = useState<string>('');
  const [notes, setNotes] = useState(selectedClient.notes);

  const { currentUser } = useContext(Context);
  const { updateSelectedClient, addNote, deleteNote } = useActions();

  const removeNote = (id: number) => {
    const notes = selectedClient.notes.filter((note) => note.id !== id);

    deleteNote({
      id,
      successCallback: () => {
        updateSelectedClient({ notes });
        socket.emit('updateSelectedClient', { notes });
      }
    });
    
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
        const notes = selectedClient.notes.concat({
          id,
          ...noteData,
          timestamp,
        });
        
        updateSelectedClient({ notes });
        socket.emit('updateSelectedClient', { notes })
        setNoteText('');
        toggleNotesTextarea(prev => !prev);
      };

      addNote({
        ...noteData,
        clientId: selectedClient.clientId,
        successCallback: addNewNote
      });
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

  useEffect(() => {
    setNotes(selectedClient.notes);
    console.log('UPDATED_STATE');
  }, [selectedClient.notes]);

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
        notes &&
        notes.map(({ id, madeBy, text, timestamp }) => {
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