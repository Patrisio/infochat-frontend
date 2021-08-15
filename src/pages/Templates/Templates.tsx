import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';

import useForm from '../../hooks/useForm';

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
import validateForm from './validateForm';

interface ModalProps {
  show: boolean,
  title: string,
  body: React.ReactElement | null,
  footer: React.ReactElement | null,
  onClose: () => void,
  width: string,
  height?: string,
  errors?: any,
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
  errors?: { name: string, message: string }
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

  const makeTemplate = (template: any) => {
    dispatch(addTemplate({
      id: generateRandomHash(),
      ...template
    }, projectId));
    
    currentModal.onClose();
  };

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
                      type='submit'
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
                      type='submit'
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
                      type='submit'
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

  const changeTemplate = (id: string, values: any) => {
    dispatch(editTemplate({ id, ...values }, projectId));
    currentModal.onClose();
  };

  const removeTemplate = (id: string) => {
    dispatch(deleteTemplate(id, projectId));
    currentModal.onClose();
  };

  const ModalBody = ({ id, name, message, children }: ModalBodyProps) => {
    const { handleChange, handleSubmit, values, errors } = useForm(
      {
        name,
        message,
      },
      validateForm,
      id ? (values: any) => changeTemplate(id, values) : makeTemplate,
    );
    
    const formattedMessage = message?.split('<br />').join('\n')
    
    return (
      <form
        method='POST'
        className={styles.modalBody}
        onSubmit={handleSubmit}
      >
        <div className={styles.modalField}>
          <Input
            type='text'
            placeholder='Название шаблона'
            fluid
            name='name'
            value={name}
            errorMessage={errors?.name}
            onChange={handleChange}//(e) => setTemplate(prev => Object.assign(prev, { name: e.target.value }))}
          />
        </div>

        <div className={styles.modalField}>
          <Textarea
            placeholder='Текст сообщения'
            name='message'
            classNames={styles.textarea}
            value={formattedMessage}
            errorMessage={errors?.message}
            onChange={(e) => handleChange(e, 'textarea')}
            // (e) => {
            //   const message = e.target.value.split('\n').join('<br />');
            //   setTemplate(prev => Object.assign(prev, { message }));
            // }}
          />
        </div>

        { children }
      </form>
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