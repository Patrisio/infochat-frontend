import {
  InboxActionTypes, InboxAction, Filters, IncomingMessage,
  IIncomingMessage, SelectedClient, IMessagesHistory,
} from '../../types/inbox';
import {
  SelectedClientInfoGetPayload, ClientAppealDeletePayload, MessageToInboxAddPayload,
  IncomingMessagesFetchPayload, MessagesStatusUpdatePayload, SelectedClientUpdatePayload,
  NoteAddPayload, NoteDeletePayload, ToSelectedTeammateRemapDialogsPayload, BotMessage, Message,
} from 'api/types';

export const addMessage = (payload: Partial<MessageToInboxAddPayload> | BotMessage | Message[] | string): InboxAction => ({
  type: InboxActionTypes.MESSAGES_ADD,
  payload,
});

export const getClientInfo = (payload: SelectedClientInfoGetPayload): InboxAction => ({
  type: InboxActionTypes.SELECTED_CLIENT_GET_INFO,
  payload,
});

export const deleteClientAppeal = (payload: ClientAppealDeletePayload): InboxAction => ({
  type: InboxActionTypes.DELETE_CLIENT_APPEAL,
  payload,
});

export const addToInboxIncomingMessage = (payload: MessageToInboxAddPayload | IIncomingMessage | IncomingMessage): InboxAction => ({
  type: InboxActionTypes.INCOMING_MESSAGES_ADD_TO_INBOX,
  payload,
});

export const deleteFromInboxIncomingMessage = (payload: ClientAppealDeletePayload): InboxAction => ({
  type: InboxActionTypes.INCOMING_MESSAGES_DELETE_FROM_INBOX,
  payload,
});

export const fetchIncomingMessages = (payload: IncomingMessagesFetchPayload): InboxAction => ({
  type: InboxActionTypes.INCOMING_MESSAGES_FETCH,
  payload,
});

export const changeMessagesStatus = (payload: MessagesStatusUpdatePayload): InboxAction => ({
  type: InboxActionTypes.CLIENT_DATA_CHANGE_MESSAGES_STATUS,
  payload,
});

export const updateIncomingMessagesFilters = (payload: Partial<Filters>): InboxAction => ({
  type: InboxActionTypes.INCOMING_MESSAGES_UPDATE_FILTERS,
  payload,
});

export const updateClientData = (payload: Partial<SelectedClientUpdatePayload>): InboxAction => ({
  type: InboxActionTypes.CLIENT_DATA_UPDATE,
  payload,
});

export const addIncomingMessage = (payload: MessageToInboxAddPayload): InboxAction => ({
  type: InboxActionTypes.INCOMING_MESSAGES_ADD,
  payload,
});

export const selectClient = (payload: SelectedClient): InboxAction => ({
  type: InboxActionTypes.SELECT_CLIENT,
  payload,
});

export const addIncomingMessageForSelectedClient = (payload: IMessagesHistory): InboxAction => ({
  type: InboxActionTypes.INCOMING_MESSAGES_FOR_SELECTED_CLIENT_ADD,
  payload,
});

export const updateIncomingMessage = (payload: any): InboxAction => ({
  type: InboxActionTypes.INCOMING_MESSAGES_UPDATE,
  payload,
});

export const updateSelectedClient = (payload: MessagesStatusUpdatePayload | Partial<SelectedClient>): InboxAction => ({
  type: InboxActionTypes.SELECTED_CLIENT_UPDATE,
  payload,
});

export const addNote = (payload: NoteAddPayload): InboxAction => ({
  type: InboxActionTypes.NOTE_ADD,
  payload,
});

export const deleteNote = (payload: NoteDeletePayload): InboxAction => ({
  type: InboxActionTypes.NOTE_DELETE,
  payload,
});

export const remapDialogsToSelectedTeammate = (payload: ToSelectedTeammateRemapDialogsPayload): InboxAction => ({
  type: InboxActionTypes.REMAP_DIALOGS_TO_SELECTED_TEAMMATE,
  payload,
});