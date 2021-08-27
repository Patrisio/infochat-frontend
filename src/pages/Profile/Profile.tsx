import React, { useState, useEffect, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';

import InboxSidebar from '../Inbox/components/InboxSidebar/InboxSidebar';
import Title from '../../components/Typography/Title/Title';
import Header from '../../components/Header/Header';
import Button from '../../components/Button/Button';
import Input from '../../components/Input/Input';
import EditableUserForm from '../../modules/EditableUserForm/EditableUserForm';

import { Context } from '../../context/Context';
import { getAllInboxMessages } from '../../lib/utils/messages';
import { getTimezones, getTimezoneByCode, USER_TIME_ZONE } from '../../lib/utils/date';
import { useActions } from '../../hooks/useActions';
import styles from './profile.module.scss';

export default function Profile() {
  const { currentUser, setCurrentUser } = useContext<any>(Context);
  let { projectId } = useParams<{ projectId: string }>()

  const incomingMessages = useSelector((state: any) => state.inbox.incomingMessages);
  const { updateTeammate } = useActions();

  const [formData, setFormData] = useState({
    email: currentUser.email,
    password: 'fakePassword123',
    name: '',
    surname: '',
    timezone: currentUser.timezone || USER_TIME_ZONE,
  });

  const inboxMessages = getAllInboxMessages(incomingMessages, currentUser);

  const saveData = (data: any) => {
    const { name, surname, ...restFormData } = data;
    const username = `${name} ${surname}`;

    updateTeammate({
      ...restFormData,
      timezone: formData.timezone,
      username,
      oldEmail: currentUser.email,
      projectId,
      successCallback: () => setCurrentUser((prev: any) => {
        return {
          ...prev,
          username,
          timezone: formData.timezone,
          ...restFormData,
        };
      }),
    });
  };

  const updateTimezone = (timezone: string | number) => {
    setFormData((prev: any) => {
      return {
        ...prev,
        timezone,
      };
    });
  };

  const timezones = getTimezones();

  const EditableUserFormBody = () => {
    return (
      <Input
        type='text'
        classNames={styles.timezones}
        fixedSelect
        data={timezones}
        fluid
        value={getTimezoneByCode(formData.timezone)}
        readOnly
        onSelect={updateTimezone}
      />
    );
  };

  useEffect(() => {
    const [name, surname] = currentUser.username.split(' ');
    setFormData({
      email: currentUser.email,
      password: 'fakePassword123',
      name,
      surname,
      timezone: currentUser.timezone || USER_TIME_ZONE,
    });
  }, [currentUser]);

  return (
    <div className={styles.profileContainer}>
      <InboxSidebar
        inboxMessages={inboxMessages}
      />
      <div className={styles.contentContainer}>
        <Header />
        <div className={styles.channelsContainer}>
          <Title level='1' weight='bold'>Настройки профиля</Title>

          <div className={styles.formContainer}>
            <EditableUserForm
              saveData={saveData}
              setFormData={setFormData}
              email={formData.email}
              password={formData.password}
              name={formData.name}
              surname={formData.surname}
              body={<EditableUserFormBody />}
            />
          </div>
        </div>
      </div>
    </div>
  );
}