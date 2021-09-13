import { InboxState, IIncomingMessage, InboxAction, InboxActionTypes, SelectedClient } from '../../types/inbox';
import { getLastUnreadMessagesCount } from '../../utils/clientData';
import cloneDeep from 'lodash/cloneDeep';

export const defaultSelectedClient: SelectedClient = {
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
  notes: [],
  changesHistory: [],
};

const initialState: InboxState = {
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
  isFetchingIncomingMessages: false,
  isFetchingSelectedClienInfo: false,
  selectedClient: defaultSelectedClient,
};

export const inboxReducer = (state = initialState, action: InboxAction): InboxState => {
  switch (action.type) {
    case InboxActionTypes.MESSAGES_ADD:
      const message: any = action.payload;
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
    
    case InboxActionTypes.INCOMING_MESSAGES_ADD:
      if (Array.isArray(action.payload)) {
        return cloneDeep({
          ...state,
          incomingMessages: action.payload,
        });
      } else {
        const client = state.incomingMessages.find(incMsg => incMsg?.clientId === action.payload.clientId) as IIncomingMessage;
        const clientIndex = state.incomingMessages.findIndex(incMsg => incMsg.clientId === action.payload.clientId);
        const isNewClient = !client;

        if (isNewClient) {
          return {
            ...state,
            incomingMessages: [action.payload].concat(state.incomingMessages),
          };
        } else {
          const incomingMessagesCopy = cloneDeep(state.incomingMessages);
          client?.messagesHistory.push(...action.payload.messagesHistory);
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

    case InboxActionTypes.INCOMING_MESSAGES_UPDATE_FILTERS:
      return {
        ...state,
        filters: { ...Object.assign(state.filters, action.payload) },
      };

    case InboxActionTypes.INCOMING_MESSAGES_FOR_SELECTED_CLIENT_ADD:
      if (action.payload.clientId === state.selectedClient.clientId) {
        const messagesHistory = state.selectedClient.messagesHistory;
        return { ...state, selectedClient: cloneDeep(Object.assign(state.selectedClient, { messagesHistory: [...messagesHistory, action.payload] })) };
      }

      return state;

    case InboxActionTypes.SELECT_CLIENT:
      return { ...state, selectedClient: action.payload };

    case InboxActionTypes.SELECTED_CLIENT_UPDATE:
      return cloneDeep({ ...state, selectedClient: Object.assign(state.selectedClient, action.payload) });

    case InboxActionTypes.INCOMING_MESSAGES_UPDATE:
      const client = state.incomingMessages.find(incMsg => incMsg?.clientId === action.payload.clientId) as IIncomingMessage;
      const clientIndex = state.incomingMessages.findIndex(incMsg => incMsg?.clientId === action.payload.clientId);

      if (client) {
        const updatedClient = Object.assign(client, action.payload);
        state.incomingMessages.splice(clientIndex, 1, updatedClient);
  
        return cloneDeep({
          ...state,
          incomingMessages: state.incomingMessages
        });
      }
      
      return state;

    case InboxActionTypes.INCOMING_MESSAGES_FETCHING:
      return {
        ...state,
        isFetchingIncomingMessages: !state.isFetchingIncomingMessages,
      };

    case InboxActionTypes.FETCHING_SELECTED_CLIENT_INFO:
      return {
        ...state,
        isFetchingSelectedClienInfo: !state.isFetchingSelectedClienInfo,
      };

    case InboxActionTypes.INCOMING_MESSAGES_DELETE_FROM_INBOX:
      return {
        ...state,
        incomingMessages: state.incomingMessages.filter((incMsg) => incMsg.clientId !== action.payload.clientId),
      };

    case InboxActionTypes.REMAP_DIALOGS_TO_SELECTED_TEAMMATE:
      const { deletedTeammateEmail, teammateEmailForRemapDialogs } = action.payload;
      
      return {
        ...state,
        incomingMessages: state.incomingMessages.map(incMsg =>
          incMsg.assignedTo === deletedTeammateEmail ?
            {
              ...incMsg,
              assignedTo: teammateEmailForRemapDialogs
            } :
            incMsg
        ),
      };
    
    default:
      return state;
  }
};