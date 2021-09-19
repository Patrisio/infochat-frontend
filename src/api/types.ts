import { IUser } from '../context/Context';
import { Role } from '../lib/utils/accessRights';
import { Settings } from '../types/channels';
import { IMessagesHistory } from '../types/inbox';

interface FetchCurrentUserData extends IUser {}

export interface Response {
  status: 'success' | 'error',
  statusCode: number,
  message?: string,
  data: any,
}

export interface Callbacks {
  successCallback: (data: Response['data']) => void,
  errorCallback: (response: Response) => void,
}

export interface BotMessage {
  username: string,
  timestamp: number,
  message: string | React.ReactElement,
}

export interface Message {
  assignedTo: string | null
  avatarColor: string,
  avatarName: string,
  client_id: string,
  id: string,
  message: string,
  username: string,
}

export interface InviteUserPayload extends Callbacks {
  password: string,
  projectId: string,
  username: string,
  inviteId: string,
}
export interface FetchCurrentUserPayload extends Callbacks {}
export interface SignInPayload extends Callbacks {
  email: string,
  password: string,
}
export interface SignUpPayload extends Callbacks {
  email: string,
  password: string,
  phone: string,
  role: Role,
  status: string
  username: string,
}
export interface GetTeammatesPayload {
  projectId: string,
}
export interface TeammateUpdatePayload extends Callbacks {
  projectId: string,
  oldEmail: string,
  password?: string,
  role: Role
  username: string,
}
export interface IncomingMessagesFetchPayload extends Partial<Callbacks> {
  projectId: string,
  clientId?: string
}
export interface SelectedClientInfoGetPayload extends Partial<Callbacks> {
  projectId: string,
  clientId: string,
}
export interface MessagesStatusUpdatePayload extends Partial<Callbacks> {
  projectId: string,
  messagesStatus: string,
  assignedTo?: string | '' |  null,
  clientId: string,
}
export interface SelectedClientUpdatePayload extends Callbacks {
  [key: string]: any,

  projectId: string,
  clientId: string,
  assignedTo: string,
  avatarName: string,
  changeInFieldValue: string,
  email: string,
  isBlocked: boolean,
  phone: string,
  updatedBy: Role | 'client',
}
export interface TeammateAddPayload extends Callbacks {
  email: string,
  projectId: string,
  role: Role,
  status: string,
  username: string,
}
export interface RemoveTeammatePayload {
  email: string,
  projectId: string,
}
export interface SendEmailPayload {
  email: string,
  projectId: string,
}
export interface MessageToInboxAddPayload extends Partial<Callbacks> {
  clientId: string,
  projectId: string,
  message?: string | BotMessage,
  avatarName?: string,
  avatarColor?: string,
  messagesHistory: IMessagesHistory[],
}
export interface GetChannelsPayload {
  projectId: string,
}
export interface ChannelAddPayload {
  projectId: string,
  name: string,
}
export interface ChatSettingsSavePayload {
  projectId: string,
  settings: Settings,
}
export interface ChatSettingsFetchPayload extends Partial<Callbacks> {
  projectId: string,
}
export interface TemplateAddPayload {
  id: string,
  name: string,
  message: string,
  projectId: string,
}
export interface TemplateDeletePayload {
  templateId: string,
  projectId: string,
}
export interface TemplateEditPayload {
  id: string,
  name: string,
  message: string,
  projectId: string,
}
export interface GetTemplatesPayload {
  projectId: string,
}
export interface ProjectAddPayload extends Callbacks {
  name: string,
  timezone: string,
}
export interface TariffPlanFetchPayload {
  projectId: string,
}
export interface TariffPlanUpdatePayload {
  projectId: string,
  chatCount: number,
  infochatLinkCount: number,
  operatorsCount: number,
  templatesCount: number,
}
export interface NoteAddPayload extends Partial<Callbacks> {
  clientId: string,
  madeBy: string,
  text: string,
}
export interface NoteDeletePayload extends Partial<Callbacks> {
  id: number,
}
export interface ClientAppealDeletePayload extends Partial<Callbacks> {
  clientId: string,
  projectId?: string,
}
export interface JwtDecodePayload extends Callbacks {
  token: string,
}
export interface ToSelectedTeammateRemapDialogsPayload extends Partial<Callbacks> {
  projectId: string,
  deletedTeammateEmail: string,
  teammateEmailForRemapDialogs: string | null,
}