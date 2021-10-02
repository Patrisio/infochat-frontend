import {
  SelectedClientInfoGetPayload, ClientAppealDeletePayload, MessageToInboxAddPayload,
  IncomingMessagesFetchPayload, MessagesStatusUpdatePayload, SelectedClientUpdatePayload,
  NoteAddPayload, NoteDeletePayload, ToSelectedTeammateRemapDialogsPayload, BotMessage,
  Message, Callbacks,
} from 'api/types';

export type Noop<T> = (arg: T) => void;

export type DialogType = 'assigned' | 'closed' | 'opened' | 'unread' | 'all';

export interface InboxMessages {
  unread: {
    clientIds: InboxState['incomingMessages'],
    count: number,
  },
  opened: {
    clientIds: InboxState['incomingMessages'],
    count: number,
  },
  closed: {
    clientIds: InboxState['incomingMessages'],
    count: number,
  },
  assigned: {
    clientIds: InboxState['incomingMessages'],
    count: number,
  },
  all?: {
    clientIds: InboxState['incomingMessages'],
    count: number,
  },
}

export interface IMessagesHistory {
  message: string | React.ReactNode,
  username: string,
  timestamp: number,
  assignedTo?: string | null,
  clientId?: string,
}

export interface ModificationInterface {
  before: string | null,
  after: string,
  changeInFieldValue: string,
  timestamp: number,
}

export interface Note {
  id: number,
  madeBy: string,
  text: string,
  timestamp: number,
}

export interface IncomingMessage extends Partial<Callbacks> {
  clientId: string,
  projectId: string,
  message: IMessagesHistory,
  timestamp?: number,
  avatarName?: string,
  avatarColor?: string,
}

export interface IIncomingMessage extends Partial<Callbacks> {
  [key: string]: any,
  
  projectId: string,
  clientId: string,
  messagesHistory: IMessagesHistory[],
  assignedTo: string | null,
  phone: string,
  email: string,
  avatarName: string,
  avatarColor: string,
  messagesStatus: 'unread' | 'opened' | 'closed',
  message?: IMessagesHistory,
  timestamp?: number,
}

export interface SelectedClient extends IIncomingMessage {
  notes: Note[],
  changesHistory: ModificationInterface[],
}

export interface Filters {
  searchBy: {
    value: string,
    tag: string,
  },
  channel: string,
  assigned: string,
}

export interface InboxState {
  filters: Filters,
  messages: IMessagesHistory[],
  incomingMessages: IIncomingMessage[],
  isFetchingIncomingMessages: boolean,
  isFetchingSelectedClienInfo: boolean,
  selectedClient: SelectedClient,
}

export enum InboxActionTypes {
  MESSAGES_ADD = 'ADD_MESSAGE',

  INCOMING_MESSAGES_ADD = 'ADD_INCOMING_MESSAGES',
  INCOMING_MESSAGES_UPDATE = 'UPDATE_INCOMING_MESSAGE',
  INCOMING_MESSAGES_FETCH = 'FETCH_INCOMING_MESSAGES',
  INCOMING_MESSAGES_FETCHING = 'FETCHING_INCOMING_MESSAGES',
  INCOMING_MESSAGES_ADD_TO_INBOX = 'ADD_TO_INBOX_INCOMING_MESSAGE',
  INCOMING_MESSAGES_DELETE_FROM_INBOX = 'INCOMING_MESSAGES_DELETE_FROM_INBOX',
  INCOMING_MESSAGES_UPDATE_FILTERS = 'UPDATE_FILTERS',

  REMAP_DIALOGS_TO_SELECTED_TEAMMATE = 'REMAP_DIALOGS_TO_SELECTED_TEAMMATE',

  SELECT_CLIENT = 'SELECT_CLIENT',

  INCOMING_MESSAGES_FOR_SELECTED_CLIENT_ADD = 'ADD_INCOMING_MESSAGES_FOR_SELECTED_CLIENT',

  DELETE_CLIENT_APPEAL = 'DELETE_CLIENT_APPEAL',

  CLIENT_DATA_UPDATE = 'CLIENT_DATA_UPDATE',
  CLIENT_DATA_CHANGE_MESSAGES_STATUS = 'CHANGE_MESSAGES_STATUS',

  SELECTED_CLIENT_UPDATE = 'SELECTED_CLIENT_UPDATE',

  SELECTED_CLIENT_GET_INFO = 'SELECTED_CLIENT_GET_INFO',
  FETCHING_SELECTED_CLIENT_INFO = 'FETCHING_SELECTED_CLIENT_INFO',

  NOTE_ADD = 'ADD_NOTE',
  NOTE_DELETE = 'DELETE_NOTE',
}

interface AddMessageAction {
  type: InboxActionTypes.MESSAGES_ADD,
  payload: Partial<MessageToInboxAddPayload> | BotMessage | Message[] | string,
}
interface addIncomingMessageAction {
  type: InboxActionTypes.INCOMING_MESSAGES_ADD,
  payload: MessageToInboxAddPayload | IIncomingMessage,
}
interface updateIncomingMessageAction {
  type: InboxActionTypes.INCOMING_MESSAGES_UPDATE,
  payload: any,
}
interface fetchIncomingMessagesAction {
  type: InboxActionTypes.INCOMING_MESSAGES_FETCH,
  payload: IncomingMessagesFetchPayload,
}
interface fetchingIncomingMessagesAction {
  type: InboxActionTypes.INCOMING_MESSAGES_FETCHING,
  payload?: any,
}
interface addToInboxIncomingMessageAction {
  type: InboxActionTypes.INCOMING_MESSAGES_ADD_TO_INBOX,
  payload: MessageToInboxAddPayload | IIncomingMessage | IncomingMessage,
}
interface deleteFromInboxIncomingMessageAction {
  type: InboxActionTypes.INCOMING_MESSAGES_DELETE_FROM_INBOX,
  payload: ClientAppealDeletePayload,
}
interface updateIncomingMessagesFiltersAction {
  type: InboxActionTypes.INCOMING_MESSAGES_UPDATE_FILTERS,
  payload: Partial<Filters>,
}
interface deleteClientAppeal {
  type: InboxActionTypes.DELETE_CLIENT_APPEAL,
  payload: ClientAppealDeletePayload,
}
interface selectClientAction {
  type: InboxActionTypes.SELECT_CLIENT,
  payload: SelectedClient,
}
interface addIncomingMessageForSelectedClientAction {
  type: InboxActionTypes.INCOMING_MESSAGES_FOR_SELECTED_CLIENT_ADD,
  payload: IMessagesHistory,
}
interface updateClientDataAction {
  type: InboxActionTypes.CLIENT_DATA_UPDATE,
  payload: Partial<SelectedClientUpdatePayload>,
}
interface changeMessagesStatusAction {
  type: InboxActionTypes.CLIENT_DATA_CHANGE_MESSAGES_STATUS,
  payload: MessagesStatusUpdatePayload,
}
interface updateSelectedClientAction {
  type: InboxActionTypes.SELECTED_CLIENT_UPDATE,
  payload: MessagesStatusUpdatePayload | Partial<SelectedClient>,
}
interface getClientInfoAction {
  type: InboxActionTypes.SELECTED_CLIENT_GET_INFO,
  payload: SelectedClientInfoGetPayload,
}
interface fetchingSelectedClientGetInfoAction {
  type: InboxActionTypes.FETCHING_SELECTED_CLIENT_INFO,
  payload?: any,
}
interface addNoteAction {
  type: InboxActionTypes.NOTE_ADD,
  payload: NoteAddPayload,
}
interface deleteNoteAction {
  type: InboxActionTypes.NOTE_DELETE,
  payload: NoteDeletePayload,
}
interface remapDialogsToSelectedTeammate {
  type: InboxActionTypes.REMAP_DIALOGS_TO_SELECTED_TEAMMATE,
  payload: ToSelectedTeammateRemapDialogsPayload,
}

export type InboxAction =
  AddMessageAction
  | addIncomingMessageAction
  | updateIncomingMessageAction
  | fetchIncomingMessagesAction
  | fetchingIncomingMessagesAction
  | addToInboxIncomingMessageAction
  | deleteFromInboxIncomingMessageAction
  | updateIncomingMessagesFiltersAction
  | deleteClientAppeal
  | selectClientAction
  | addIncomingMessageForSelectedClientAction
  | updateClientDataAction
  | changeMessagesStatusAction
  | updateSelectedClientAction
  | getClientInfoAction
  | fetchingSelectedClientGetInfoAction
  | addNoteAction
  | deleteNoteAction
  | remapDialogsToSelectedTeammate