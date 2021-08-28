import React, { useEffect, useState } from 'react';

import Router from './router/router';
import socket from './socket';
import { Context, IUser } from './context/Context';
import { useActions } from './hooks/useActions';
import { isProjectOwner } from './lib/utils/accessRights';

import 'normalize.css';
import './scss/App.scss';

export default function App() {
  const { addIncomingMessage, addIncomingMessageForSelectedClient, getCurrentUser } = useActions();

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

  const currentUserDataIsNeeded = (url: string) => {
    const pagesWithoutCurrentUserData = ['iframe', 'signup', 'signin'];
    return !pagesWithoutCurrentUserData.find((page: string) => url.includes(page));
  };

  useEffect(() => {
    if (currentUserDataIsNeeded(window.location.href)) {
      const successCallback = (currentUser: any) => {
        setCurrentUser(currentUser);
        socket.emit('joinRoom', currentUser.projects[0].id);
        socket.on('msgToClient', (message: any) => {
          console.log(message);
        });
      };
      getCurrentUser({ successCallback });

      return () => {
        socket.off('msgToClient');
      };
    }
  }, []);

  return (
    <Context.Provider value={{ currentUser, setCurrentUser }}>
      <div className="App">
        {
          currentUser.email &&
          <Router isOwner={isProjectOwner(currentUser.role)} />
        }
      </div>
    </Context.Provider>
  );
}