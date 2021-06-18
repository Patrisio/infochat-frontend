import { MESSAGES, INCOMING_MESSAGES, SELECT_CLIENT,
         INCOMING_MESSAGES_FOR_SELECTED_CLIENT,
         SELECTED_CLIENT_UPDATE, CLIENT_DATA
        } from '../constants/inbox';
import { TEAMMATE } from '../constants/teammates';
import { getLastUnreadMessagesCount } from '../utils/clientData';

import cloneDeep from 'lodash/cloneDeep';

export interface IMessagesHistory {
  message: string | React.ReactNode,
  username: string,
  timestamp: number
}

export interface IIncomingMessage {
  id: string,
  projectId: string,
  clientId: string,
  messagesHistory: IMessagesHistory[],
  assignedTo: string | null,
  phone: string,
  email: string,
  avatarName: string,
  avatarColor: string,
  messagesStatus: 'unread' | 'opened' | 'closed',
}

interface Filters {
  searchBy: {
    value: string,
    tag: string,
  },
  channel: string,
  assigned: string,
}

interface State {
  filters: Filters,
  messages: IMessagesHistory[],
  incomingMessages: IIncomingMessage[],
  selectedClient: IIncomingMessage,
}

const initialState: State = {
  filters: {
    searchBy: {
      value: '',
      tag: 'text',
    },
    channel: 'all',
    assigned: 'all',
  },
  messages: [],
  incomingMessages: [],
  selectedClient: {
    id: '',
    projectId: '',
    clientId: '',
    messagesHistory: [],
    assignedTo: '',
    phone: '',
    email: '',
    avatarName: '',
    avatarColor: '',
    messagesStatus: 'unread',
  },
};

export const inboxReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case MESSAGES.ADD:
      const message: any = action.message;
      let newMessages: any;

      if (Array.isArray(message)) {
        newMessages = message;
      } else {
        newMessages = [message];
      }

      return {
        ...state,
        messages: [
          ...state.messages,
          ...newMessages
        ]
      };
    
    case INCOMING_MESSAGES.ADD:
      if (Array.isArray(action.incomingMessage)) {
        return cloneDeep({
          ...state,
          incomingMessages: action.incomingMessage
        });
      } else {
        console.log(action.incomingMessage, 'action.incomingMessage');
        const client = state.incomingMessages.find(incMsg => incMsg?.clientId === action.incomingMessage.clientId) as IIncomingMessage;
        const clientIndex = state.incomingMessages.findIndex(incMsg => incMsg.clientId === action.incomingMessage.clientId);
        const isNewClient = !client;

        if (isNewClient) {
          return {
            ...state,
            incomingMessages: [action.incomingMessage].concat(state.incomingMessages),
          };
        } else {
          const incomingMessagesCopy = cloneDeep(state.incomingMessages);
          client?.messagesHistory.push(...action.incomingMessage.messagesHistory);
          if (getLastUnreadMessagesCount(client)) {
            incomingMessagesCopy.splice(clientIndex, 1);
            incomingMessagesCopy.unshift(client);
          } else {
            incomingMessagesCopy.splice(clientIndex, 1, client);
          }
          
          return cloneDeep({
            ...state,
            incomingMessages: incomingMessagesCopy
          });
        }
      }

    case INCOMING_MESSAGES.UPDATE_FILTERS:
      return {
        ...state,
        filters: { ...action.filters }
      };

    case INCOMING_MESSAGES_FOR_SELECTED_CLIENT.ADD:
      console.log('__INTRO__');
      if (action.incomingMessage.clientId === state.selectedClient.clientId) {
        const messagesHistory = state.selectedClient.messagesHistory;
        return { ...state, selectedClient: cloneDeep(Object.assign(state.selectedClient, { messagesHistory: [...messagesHistory, action.incomingMessage] })) };
      }

      return state;

    case SELECT_CLIENT:
      return { ...state, selectedClient: action.client };

    case SELECTED_CLIENT_UPDATE:
      return cloneDeep({ ...state, selectedClient: Object.assign(state.selectedClient, action.payload) });

    case INCOMING_MESSAGES.UPDATE:
      const client = state.incomingMessages.find(incMsg => incMsg?.clientId === action.payload.clientId) as IIncomingMessage;
      const clientIndex = state.incomingMessages.findIndex(incMsg => incMsg?.clientId === action.payload.clientId);

      // client.assigned_to = action.payload.assignedTo;
      console.log(client);
      const updatedClient = Object.assign(client, action.payload);
      console.log(updatedClient);
      state.incomingMessages.splice(clientIndex, 1, updatedClient);

      return cloneDeep({
        ...state,
        incomingMessages: state.incomingMessages
      });

    // case TEAMMATE.ASSIGN:
    //   const incomingMessageIndex = state.incomingMessages.findIndex(incomingMessage => incomingMessage.clientId === action.payload.clientId);
    //   state.incomingMessages[incomingMessageIndex].assignedTo = action.payload.username;

    //   return {
    //     ...state,
    //     incomingMessages: state.incomingMessages,
    //     selectedClient: cloneDeep(Object.assign(state.selectedClient, { assigned_to: action.payload.username }))
    //   };
    
    default:
      return state;
  }
};