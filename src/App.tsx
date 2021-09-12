import React, { useEffect, useState, Suspense } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import Router from './router/router';
import socket from './socket';
import { Context, IUser } from './context/Context';
import { NotificationContext, NotificationInterface } from './context/NotificationContext';
import { useActions } from './hooks/useActions';
import { isProjectOwner } from './lib/utils/accessRights';
import Spin from './components/Spin/Spin';
import Notification from './components/Notification/Notification';

import 'normalize.css';
import './scss/App.scss';

export default function App() {
  const [hasAuthError, setAuthError] = useState(false);
  const {
    addIncomingMessage, addIncomingMessageForSelectedClient, getCurrentUser,
    updateTeammate, changeMessagesStatus, remapDialogsToSelectedTeammate,
    updateIncomingMessage, updateSelectedClient, deleteFromInboxIncomingMessage,
  } = useActions();
  const history = useHistory();
  const { projectId } = useParams<{ projectId: string }>();

  const currentUserDataIsNeeded = (url: string) => {
    const pagesWithoutCurrentUserData = ['iframe', 'signup', 'signin', 'invite'];
    return !pagesWithoutCurrentUserData.find((page: string) => url.includes(page));
  };
  const isNeedCurrentUserData = currentUserDataIsNeeded(window.location.href);

  const initialCurrentUser: IUser = {
    avatar: '',
    email: '',
    role: 'operator',
    status: '',
    username: '',
    projectId: null,
    timezone: null,
    balance: null,
    isOnline: true,
    projects: [],
  };

  const initialNotification: NotificationInterface = {
    isShow: false,
    text: null,
  };

  const [currentUser, setCurrentUser] = useState(initialCurrentUser);
  const [notification, updateNotification] = useState(initialNotification);

  useEffect(() => {
    if (isNeedCurrentUserData) {
      const successCallback = (currentUser: any) => {
        setCurrentUser(currentUser);
        setAuthError(false);
        socket.emit('joinRoom', currentUser.projects[0].id);
        socket.on('msgToClient', (message: any) => {
          console.log(message);
        });
      };
      const errorCallback = () => {
        setAuthError(true);
        history.push('/signin');
      };
      getCurrentUser({ successCallback, errorCallback });

      return () => {
        socket.off('msgToClient');
      };
    }
  }, [isNeedCurrentUserData]);

  useEffect(() => {
    socket.on('setActiveTeammateStatus', (teammateData: { email: string, username: string }) => {
      updateTeammate({
        status: 'active',
        oldEmail: teammateData.email,
        username: teammateData.username,
      });
    });

    socket.on('updateTeammateOnlineStatus', (teammateData: any) => {
      updateTeammate({
        oldEmail: teammateData.email,
        projectId,
        isOnline: teammateData.isOnline,
      });
    });

    socket.on('addIncomingMessage', (message: any) => {
      const newClient = {
        assignedTo: '',
        phone: '',
        email: '',
        clientId: message.clientId,
        messagesHistory: [message.message],
        avatarName: message.avatarName,
        avatarColor: message.avatarColor,
        messagesStatus: 'unread',
        isBlocked: false,
      };

      const incomingMessage = {
        ...message.message,
        clientId: message.clientId,
      };

      addIncomingMessageForSelectedClient(incomingMessage);
      addIncomingMessage(newClient);
    });

    socket.on('changeMessagesStatus', (payload: any) => {
      changeMessagesStatus(payload);
    });

    socket.on('remapDialogsToSelectedTeammate', (payload: any) => {
      remapDialogsToSelectedTeammate(payload);
      history.push('/signin');
    });

    socket.on('updateIncomingMessage', (payload: any) => {
      updateIncomingMessage(payload);
    });
    
    socket.on('updateSelectedClient', (payload: any) => {
      updateSelectedClient(payload);
    });

    socket.on('deleteFromInboxIncomingMessage', (payload: any) => {
      deleteFromInboxIncomingMessage(payload);
    });

    return () => {
      socket.off('disconnect');
      socket.off('addIncomingMessage');
      socket.off('updateTeammateOnlineStatus');
      socket.off('setActiveTeammateStatus');
      socket.off('changeMessagesStatus');
      socket.off('remapDialogsToSelectedTeammate');
      socket.off('updateIncomingMessage');
      socket.off('updateSelectedClient');
      socket.off('deleteFromInboxIncomingMessage');
    };
  }, [socket]);

  return (
    <Context.Provider value={{ currentUser, setCurrentUser }}>
      <NotificationContext.Provider value={{ notification, updateNotification }}>
        <div className='App'>
          <Suspense fallback={<Spin classNames='appLoader' />}>
            { notification.isShow && <Notification /> }
            {
              (currentUser.email || hasAuthError || !isNeedCurrentUserData) &&
              <Router isOwner={isProjectOwner(currentUser.role)} />
            }
          </Suspense>
        </div>
      </NotificationContext.Provider>
    </Context.Provider>
  );
}