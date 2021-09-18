import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';

import useForm from '../../hooks/useForm';

import Table from '../../components/Table/Table';
import Title from '../../components/Typography/Title/Title';
import Button from '../../components/Button/Button';
import Modal from '../../components/Modal/Modal';
import Input from '../../components/Input/Input';
import Textarea from '../../components/Textarea/Textarea';

import { useActions } from '../../hooks/useActions';
import { useTypedSelector } from '../../hooks/useTypedSelector';

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
  [key: string]: string,

  message: string,
  name: string,
}

interface ModalBodyProps {
  id?: string,
  name?: string,
  message?: string,
  errors?: { name: string, message: string }
  children?: React.ReactNode,
}

interface CellData {
  id: string,
  message: string,
  name: string,
}

export default function Templates() {
  const { templates } = useTypedSelector(state => state.templates);
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
  const { addTemplate, editTemplate, deleteTemplate, fetchTemplates } = useActions();

  const makeTemplate = (template: Template) => {
    addTemplate({
      id: generateRandomHash(),
      projectId,
      ...template,
    });
    
    closeModal();
  };

  const closeModal = () => setModalProps(prev => cloneDeep(Object.assign(prev, { show: false })));

  const columns = [
    {
      key: 'name',
      visible: true,
      headerComponent: () => (
        <Button
          type='button'
          background='transparent'
          classNames={styles.addNewTemplateBtn}
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
              onClose: closeModal,
              width: '520px',
            });
          }}
        >
          Добавить новый шаблон
        </Button>
      ),
      cellComponent: (data: CellData) => (
        <div className={styles.channelNameContainer}>
          <span className={styles.channelName}>{ data.name }</span>
        </div>
      ),
    },
    {
      key: 'message',
      cellComponent: (data: CellData) => (
        <span
          className={styles.channel}
          dangerouslySetInnerHTML={{ __html: data.message }}
        />
      ),
    },
    {
      key: 'action',
      visible: true,
      headerComponent: () => (
        <Button
          type='button'
          background='edit'
          classNames={styles.addTemplateBtn}
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
              onClose: closeModal,
              width: '520px',
            });
          }}
        >
          + Добавить
        </Button>
      ),
      cellComponent: (data: CellData) => (
        <Button
          type='button'
          background='edit'
          classNames={styles.changeTemplateBtn}
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
                      classNames={styles.deleteTemplateBtn}
                    >
                      Удалить шаблон
                    </Button>
                  </div>
                </ModalBody>
              ),
              footer: null,
              onClose: closeModal,
              width: '520px',
            });
          }}
        >
          Изменить
        </Button>
      ),
    },
  ];

  const changeTemplate = (id: string, values: Template) => {
    editTemplate({ id, projectId, ...values });
    closeModal();
  };

  const removeTemplate = (templateId: string) => {
    deleteTemplate({ templateId, projectId});
    closeModal();
  };

  const ModalBody = ({ id, name, message, children }: ModalBodyProps) => {
    const { handleChange, handleSubmit, values, errors } = useForm(
      {
        name,
        message,
      },
      validateForm,
      id ? (values: Template) => changeTemplate(id, values) : makeTemplate,
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
            onChange={handleChange}
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
          />
        </div>

        { children }
      </form>
    );
  };

  useEffect(() => {
    fetchTemplates({ projectId });
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