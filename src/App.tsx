import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Location } from 'history';

import Router from './router/router';
import socket from './socket';
import { Context } from './context/Context';
import {
  addIncomingMessage, addIncomingMessageForSelectedClient,
  assignTeammate, getCurrentUser
} from './actions';

import 'normalize.css';
import './App.css';

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    socket.on('updateAssignedToAnybody', (payload: any) => {
      dispatch(assignTeammate({
        username: payload.assigned_to,
        clientId: payload.clientId
      }));
    });

    socket.on('addIncomingMessage', (message: any) => {
      console.log('PPPPPPPPPPPPPP');
      console.log(message, 'MESSAGE');
      const newClient = {
        assignedTo: '',
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
      socket.off('updateAssignedToAnybody');
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
        socket.emit('joinRoom', currentUser.projectId);
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