import { IUser } from '../context/Context';
import { Role } from '../lib/utils/accessRights';
import { Settings } from '../pages/Channels/components/AutomationBlock/AutomationBlock';

interface FetchCurrentUserData extends IUser {}

export interface Response {
  status: 'success' | 'error',
  statusCode: number,
  message?: string,
  data?: FetchCurrentUserData
}

export interface Callbacks {
  successCallback: (response: Response) => void,
  errorCallback: (response: Response) => void,
}

export interface InviteUserPayload {
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
export interface IncomingMessagesFetchPayload {
  projectId: string,
  clientId: string
}
export interface SelectedClientInfoGetPayload extends Callbacks {
  projectId: string,
  clientId: string,
}
export interface MessagesStatusUpdatePayload {
  projectId: string,
  messagesStatus: string,
  assignedTo: string,
  clientId: string,
}
export interface SelectedClientUpdatePayload {
  projectId: string,
  clientId: string,
  assignedTo: string,
  avatarName: string,
  changeInFieldValue: string,
  email: string,
  isBlocked: boolean,
  phone: string,
  updatedBy: Role,
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
export interface MessageToInboxAddPayload extends Callbacks {
  clientId: string,
  projectId: string,
  message: string,
  avatarName: string,
  avatarColor: string,
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
export interface ChatSettingsFetchPayload extends Callbacks {
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
export interface NoteAddPayload extends Callbacks {
  clientId: string,
  madeBy: string,
  text: string,
}
export interface NoteDeletePayload extends Callbacks {
  id: number,
}
export interface ClientAppealDeletePayload extends Callbacks {
  clientId: string,
}
export interface JwtDecodePayload extends Callbacks {
  token: string,
}
export interface ToSelectedTeammateRemapDialogsPayload extends Callbacks {
  projectId: string,
  deletedTeammateEmail: string,
  teammateEmailForRemapDialogs: string,
}