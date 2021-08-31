import { InboxActionTypes, InboxAction } from '../../types/inbox';

export const addMessage = (message: any): InboxAction => ({
  type: InboxActionTypes.MESSAGES_ADD,
  message,
});

export const getClientInfo = (payload: any): InboxAction => ({
  type: InboxActionTypes.SELECTED_CLIENT_GET_INFO,
  payload,
});

export const deleteClientAppeal = (payload: any): InboxAction => ({
  type: InboxActionTypes.DELETE_CLIENT_APPEAL,
  payload,
});

export const addToInboxIncomingMessage = (payload: any): InboxAction => ({
  type: InboxActionTypes.INCOMING_MESSAGES_ADD_TO_INBOX,
  payload,
});

export const deleteFromInboxIncomingMessage = (payload: any): InboxAction => ({
  type: InboxActionTypes.INCOMING_MESSAGES_DELETE_FROM_INBOX,
  payload,
});

export const fetchIncomingMessages = (incomingMessage: any): InboxAction => ({
  type: InboxActionTypes.INCOMING_MESSAGES_FETCH,
  incomingMessage,
});

export const changeMessagesStatus = (payload: any): InboxAction => ({
  type: InboxActionTypes.CLIENT_DATA_CHANGE_MESSAGES_STATUS,
  payload,
});

export const updateIncomingMessagesFilters = (filters: any): InboxAction => ({
  type: InboxActionTypes.INCOMING_MESSAGES_UPDATE_FILTERS,
  filters,
});

export const updateClientData = (payload: any): InboxAction => ({
  type: InboxActionTypes.CLIENT_DATA_UPDATE,
  payload,
});

export const addIncomingMessage = (incomingMessage: any): InboxAction => ({
  type: InboxActionTypes.INCOMING_MESSAGES_ADD,
  incomingMessage,
});

export const selectClient = (client: any): InboxAction => ({
  type: InboxActionTypes.SELECT_CLIENT,
  client,
});

export const addIncomingMessageForSelectedClient = (incomingMessage: any): InboxAction => ({
  type: InboxActionTypes.INCOMING_MESSAGES_FOR_SELECTED_CLIENT_ADD,
  incomingMessage,
});

export const updateIncomingMessage = (payload: any): InboxAction => ({
  type: InboxActionTypes.INCOMING_MESSAGES_UPDATE,
  payload,
});

export const updateSelectedClient = (payload: any): InboxAction => ({
  type: InboxActionTypes.SELECTED_CLIENT_UPDATE,
  payload,
});

export const addNote = (payload: any): InboxAction => ({
  type: InboxActionTypes.NOTE_ADD,
  payload,
});

export const deleteNote = (payload: any): InboxAction => ({
  type: InboxActionTypes.NOTE_DELETE,
  payload,
});