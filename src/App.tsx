import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import Router from './router/router';
import socket from './socket';
import { Context } from './context/Context';
import {
  addIncomingMessage, addIncomingMessageForSelectedClient,
  getCurrentUser
} from './actions';

import 'normalize.css';
import './scss/App.scss';

export default function App() {
  const dispatch = useDispatch();

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

      dispatch(addIncomingMessageForSelectedClient(incomingMessage));
      dispatch(addIncomingMessage(newClient));
    });

    return () => {
      socket.off('addIncomingMessage');
    };
  }, [socket]);

  const initialCurrentUser = {
    avatar: '',
    email: '',
    role: '',
    status: '',
    username: '',
    projectId: null,
    timezone: null,
    balance: null,
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
        console.log(currentUser, 'currentUser');
        setCurrentUser(currentUser);
        socket.emit('joinRoom', currentUser.projects[0].id);
        socket.on('msgToClient', (message: any) => {
          console.log(message);
        });
      };
      dispatch(getCurrentUser({ successCallback }));

      return () => {
        socket.off('msgToClient');
      };
    }
  }, []);
  

  return (
    <Context.Provider value={{ currentUser, setCurrentUser }}>
      <div className="App">
        { Router() }
      </div>
    </Context.Provider>
  );
}