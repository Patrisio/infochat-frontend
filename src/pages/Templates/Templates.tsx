import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';

import Table from '../../components/Table/Table';
import Title from '../../components/Typography/Title/Title';
import Button from '../../components/Button/Button';
import Modal from '../../components/Modal/Modal';
import Input from '../../components/Input/Input';
import Textarea from '../../components/Textarea/Textarea';

import { addTemplate, editTemplate, deleteTemplate, fetchTemplates } from '../../actions';
import styles from './templates.module.scss';
import cloneDeep from 'lodash/cloneDeep';
import { generateRandomHash } from '../../utils/string';

interface ModalProps {
  show: boolean,
  title: string,
  body: React.ReactNode | null,
  footer: React.ReactNode | null,
  onClose: () => void,
  width: string,
  height?: string,
}

interface Template {
  [key: string]: string
}

interface Templates {
  templates: Template[],
}

interface RootState {
  templates: Templates,
}

interface ModalBodyProps {
  id?: string,
  name?: string,
  message?: string,
  children?: React.ReactNode,
}

export default function Templates() {
  const templates = useSelector((state: RootState) => state.templates.templates);
  const [currentModal, setModalProps] = useState<ModalProps>({
    show: false,
    title: '',
    body: null,
    footer: null,
    onClose: () => setModalProps(Object.assign(currentModal, { show: false })),
    width: '',
    height: '',
  });

  const [template, setTemplate] = useState<{ name: string, message: string }>({
    name: '',
    message: '',
  });

  let { projectId } = useParams<{ projectId: string }>();
  const dispatch = useDispatch();

  const columns = [
    {
      key: 'name',
      visible: true,
      headerComponent: (data: any) => (
        <Button
          type='button'
          background='transparent'
          stylesList={{
            fontSize: '14px',
            fontWeight: 500,
            color: '#0a86f9',
            padding: '0',
          }}
          onClick={() => {
            setModalProps({
              show: true,
              title: 'Новый шаблон',
              body: (
                <ModalBody>
                  <div className={styles.modalField}>
                    <Button
                      type='button'
                      onClick={makeTemplate}
                      fluid
                    >
                      Создать
                    </Button>
                  </div>
                </ModalBody>
              ),
              footer: null,
              onClose: () => setModalProps(prev => cloneDeep(Object.assign(prev, { show: false }))),
              width: '520px',
            });
          }}
        >
          Добавить новый шаблон
        </Button>
      ),
      cellComponent: (data: any) => (
        <div className={styles.channelNameContainer}>
          <span className={styles.channelName}>{ data.name }</span>
        </div>
      ),
    },
    {
      key: 'message',
      cellComponent: (data: any) => (
        <span
          className={styles.channel}
          dangerouslySetInnerHTML={{ __html: data.message }}
        />
      ),
    },
    {
      key: 'action',
      visible: true,
      headerComponent: (data: any) => (
        <Button
          type='button'
          background='edit'
          stylesList={{
            background: '#fff',
            color: '#0a86f9',
            fontWeight: 400,
            padding: '10px',
            fontSize: '13px',
          }}
          onClick={() => {
            setModalProps({
              show: true,
              title: 'Новый шаблон',
              body: (
                <ModalBody>
                  <div className={styles.modalField}>
                    <Button
                      type='button'
                      onClick={makeTemplate}
                      fluid
                    >
                      Создать
                    </Button>
                  </div>
                </ModalBody>
              ),
              footer: null,
              onClose: () => setModalProps(prev => cloneDeep(Object.assign(prev, { show: false }))),
              width: '520px',
            });
          }}
        >
          + Добавить
        </Button>
      ),
      cellComponent: (data: any) => (
        <Button
          type='button'
          background='edit'
          stylesList={{
            fontWeight: 500,
            fontSize: '13px',
            padding: '10px 14px',
          }}
          onClick={() => {
            setTemplate({
              name: data.name,
              message: data.message,
            });
            setModalProps({
              show: true,
              title: 'Изменить шаблон',
              body: (
                <ModalBody
                  id={data.id}
                  name={data.name}
                  message={data.message}
                >
                  <div className={styles.modalField}>
                    <Button
                      type='button'
                      onClick={() => changeTemplate(data.id)}
                      fluid
                    >
                      Изменить
                    </Button>
                  </div>

                  <div className={styles.modalField}>
                    <Button
                      type='button'
                      onClick={() => removeTemplate(data.id)}
                      fluid
                      background='transparent'
                      stylesList={{ paddingBottom: 0 }}
                    >
                      Удалить шаблон
                    </Button>
                  </div>
                </ModalBody>
              ),
              footer: null,
              onClose: () => setModalProps(prev => cloneDeep(Object.assign(prev, { show: false }))),
              width: '520px',
            });
          }}
        >
          Изменить
        </Button>
      ),
    },
  ];

  const makeTemplate = () => {
    dispatch(addTemplate({
      id: generateRandomHash(),
      ...template
    }, projectId));
    
    currentModal.onClose();
  };

  const changeTemplate = (id: string) => {
    setTemplate(prev => {
      dispatch(editTemplate({ id, ...prev }, projectId));
      return prev;
    });
    
    currentModal.onClose();
  };

  const removeTemplate = (id: string) => {
    dispatch(deleteTemplate(id, projectId));
    currentModal.onClose();
  };

  const ModalBody = ({ id, name, message, children }: ModalBodyProps) => {
    const formattedMessage = message?.split('<br />').join('\n')
    
    return (
      <div
        className={styles.modalBody}
      >
        <div className={styles.modalField}>
          <Input
            type='text'
            placeholder='Название шаблона'
            fluid
            value={name}
            onChange={(e) => setTemplate(prev => Object.assign(prev, { name: e.target.value }))}
          />
        </div>

        <div className={styles.modalField}>
          <Textarea
            placeholder='Текст сообщения'
            classNames={styles.textarea}
            value={formattedMessage}
            onChange={(e) => {
              const message = e.target.value.split('\n').join('<br />');
              setTemplate(prev => Object.assign(prev, { message }));
            }}
          />
        </div>

        { children }
      </div>
    );
  };

  useEffect(() => {
    dispatch(fetchTemplates({ projectId }));
  }, []);

  return (
    <div className={styles.channelsContainer}>
      <Title level='1' weight='bold'>Шаблоны ответов</Title>

      <Table
        columns={columns}
        data={templates}
      />

      <Modal
        {...currentModal}
      />
    </div>
  );
}