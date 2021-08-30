import React, { useEffect, useState, Suspense } from 'react';
import { useHistory } from 'react-router-dom';

import Router from './router/router';
import socket from './socket';
import { Context, IUser } from './context/Context';
import { useActions } from './hooks/useActions';
import { isProjectOwner } from './lib/utils/accessRights';
import Spin from './components/Spin/Spin';

import 'normalize.css';
import './scss/App.scss';

export default function App() {
  const [hasAuthError, setAuthError] = useState(false);
  const { addIncomingMessage, addIncomingMessageForSelectedClient, getCurrentUser } = useActions();
  const history = useHistory();

  const currentUserDataIsNeeded = (url: string) => {
    const pagesWithoutCurrentUserData = ['iframe', 'signup', 'signin'];
    return !pagesWithoutCurrentUserData.find((page: string) => url.includes(page));
  };
  const isNeedCurrentUserData = currentUserDataIsNeeded(window.location.href);

  useEffect(() => {
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
      };

      const incomingMessage = {
        ...message.message,
        clientId: message.clientId,
      };

      addIncomingMessageForSelectedClient(incomingMessage);
      addIncomingMessage(newClient);
    });

    return () => {
      socket.off('addIncomingMessage');
    };
  }, [socket]);

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

  const [currentUser, setCurrentUser] = useState(initialCurrentUser);

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
  }, []);

  return (
    <Context.Provider value={{ currentUser, setCurrentUser }}>
      <div className='App'>
      <Suspense fallback={<Spin classNames='appLoader' />}>
        {
          (currentUser.email || hasAuthError || !isNeedCurrentUserData) &&
          <Router isOwner={isProjectOwner(currentUser.role)} />
        }
        </Suspense>
      </div>
    </Context.Provider>
  );
}