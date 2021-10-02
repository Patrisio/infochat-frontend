import { requestApiPost, requestApiGet } from './';
import {
  Response,
  InviteUserPayload,
  FetchCurrentUserPayload,
  SignInPayload,
  SignUpPayload,
  GetTeammatesPayload,
  TeammateUpdatePayload,
  IncomingMessagesFetchPayload,
  SelectedClientInfoGetPayload,
  MessagesStatusUpdatePayload,
  SelectedClientUpdatePayload,
  TeammateAddPayload,
  RemoveTeammatePayload,
  SendEmailPayload,
  MessageToInboxAddPayload,
  GetChannelsPayload,
  ChannelAddPayload,
  ChatSettingsSavePayload,
  ChatSettingsFetchPayload,
  TemplateAddPayload,
  TemplateDeletePayload,
  TemplateEditPayload,
  GetTemplatesPayload,
  ProjectAddPayload,
  TariffPlanFetchPayload,
  TariffPlanUpdatePayload,
  NoteAddPayload,
  NoteDeletePayload,
  ClientAppealDeletePayload,
  JwtDecodePayload,
  ToSelectedTeammateRemapDialogsPayload,
} from 'types';

export async function inviteUser(payload: InviteUserPayload): Promise<Response> {
  const { username, password, projectId, inviteId } = payload;
  return await requestApiPost(
    'api_auth_invite',
    {
      username,
      password,
      projectId,
    },
    {
      inviteId,
    }
  );
}

export async function fetchCurrentUser(payload: FetchCurrentUserPayload): Promise<Response> {
  const { successCallback, errorCallback } = payload;
  return await requestApiGet('api_get_current_user', {}, successCallback, errorCallback);
}

export async function signIn(payload: SignInPayload): Promise<Response> {
  const { successCallback, errorCallback, ...loginCredentials } = payload;
  return await requestApiPost('api_auth_sign_in', loginCredentials, {}, successCallback, errorCallback);
}

export async function signUp(payload: SignUpPayload): Promise<Response> {
  const { errorCallback, ...signUpCredentials } = payload;
  return await requestApiPost('api_auth_sign_up', signUpCredentials, {}, () => {}, errorCallback);
}

export async function getTeammates(payload: GetTeammatesPayload): Promise<Response> {
  return await requestApiGet('api_get_teammates', payload);
}

export async function teammateUpdate(payload: Partial<TeammateUpdatePayload>): Promise<Response> {
  const { projectId, successCallback, ...updatedTeammateData } = payload;
  return await requestApiPost('api_update_teammate', updatedTeammateData, { projectId }, successCallback);
}

export async function incomingMessagesFetch(payload: IncomingMessagesFetchPayload): Promise<Response> {
  const { clientId, projectId } = payload;

  if (clientId) {
    return await requestApiGet('api_get_messages_history', { projectId, clientId });
  }

  return await requestApiGet('api_get_messages_history_by_project_id', { projectId });
}

export async function selectedClientInfoGet(payload: SelectedClientInfoGetPayload): Promise<Response> {
  const { projectId, clientId } = payload;
  return await requestApiGet('api_get_client_info', { projectId, clientId });
}

export async function messageToInboxAdd(payload: MessageToInboxAddPayload): Promise<Response> {
  return await requestApiPost('api_add_message', payload);
}

export async function messagesStatusUpdate(payload: MessagesStatusUpdatePayload): Promise<Response> {
  const { projectId, messagesStatus, assignedTo, clientId } = payload;
  return await requestApiPost(
    'api_update_messages_status_by_client_id',
    {
      messagesStatus,
      assignedTo: assignedTo ? assignedTo : null,
    },
    {
      projectId,
      clientId,
    }
  );
}

export async function selectedClientUpdate(payload: SelectedClientUpdatePayload): Promise<Response> {
  const { projectId, clientId, ...restPayloadData } = payload;
  return await requestApiPost(
    'api_update_selected_client_by_project_id',
    restPayloadData,
    {
      projectId,
      clientId,
    }
  );
}

export async function teammateAdd(payload: TeammateAddPayload): Promise<Response> {
  const { email, role, status, username, projectId, errorCallback } = payload;
  return await requestApiPost('api_add_teammate',
    {
      email,
      role,
      status,
      username,
    },
    {
      projectId,
    },
    () => {},
    errorCallback
  );
}

export async function removeTeammate(payload: RemoveTeammatePayload): Promise<Response> {
  const { email, projectId } = payload;
  return await requestApiPost('api_delete_teammate', { email }, { projectId });
}

export async function sendEmail(payload: SendEmailPayload): Promise<Response> {
  const { email, projectId } = payload;
  return await requestApiPost('api_send_email', { email }, { projectId });
}

export async function getChannels(payload: GetChannelsPayload): Promise<Response> {
  return await requestApiGet('api_get_channels', payload);
}

export async function channelAdd(payload: ChannelAddPayload): Promise<Response> {
  const { projectId, name } = payload;
  return await requestApiPost('api_add_channel', { name }, { projectId });
}

export async function chatSettingsSave(payload: ChatSettingsSavePayload): Promise<Response> {
  const { projectId, settings } = payload;
  return await requestApiPost('api_save_chat_settings', settings, { projectId });
}

export async function chatSettingsFetch(payload: ChatSettingsFetchPayload): Promise<Response> {
  const { projectId, successCallback } = payload;
  return await requestApiGet('api_get_chat_settings', { projectId }, successCallback);
}

export async function templateAdd(payload: TemplateAddPayload): Promise<Response> {
  const { id, name, message, projectId } = payload;
  return await requestApiPost('api_add_template',
    {
      id,
      name,
      message,
    },
    {
      projectId,
    }
  );
}

export async function templateDelete(payload: TemplateDeletePayload): Promise<Response> {
  const { templateId, projectId } = payload;
  return await requestApiPost('api_delete_template', { templateId }, { projectId });
}

export async function templateEdit(payload: TemplateEditPayload): Promise<Response> {
  const { id, name, message, projectId } = payload;
  return await requestApiPost('api_update_template',
    {
      id,
      name,
      message,
    },
    {
      projectId,
    }
  );
}

export async function getTemplates(payload: GetTemplatesPayload): Promise<Response> {
  const { projectId } = payload;
  return await requestApiGet('api_get_templates', { projectId });
}

export async function projectAdd(payload: ProjectAddPayload): Promise<Response> {
  const { successCallback, ...projectData } = payload;
  return await requestApiPost('api_add_project', projectData, {}, successCallback);
}

export async function tariffPlanFetch(payload: TariffPlanFetchPayload): Promise<Response> {
  const { projectId } = payload;
  return await requestApiGet('api_get_tariff_plan', { projectId });
}

export async function tariffPlanUpdate(payload: TariffPlanUpdatePayload): Promise<Response> {
  const { projectId, ...tariffPlan } = payload;
  return await requestApiPost('api_update_tariff_plan', tariffPlan, { projectId });
}

export async function noteAdd(payload: NoteAddPayload): Promise<Response> {
  const { successCallback, clientId, ...noteData } = payload;
  return await requestApiPost('api_add_note', noteData, { clientId }, successCallback);
}

export async function noteDelete(payload: NoteDeletePayload): Promise<Response> {
  const { successCallback, ...noteData } = payload;
  return await requestApiPost('api_delete_note', noteData, {}, successCallback);
}

export async function clientAppealDelete(payload: ClientAppealDeletePayload): Promise<Response> {
  const { successCallback, ...clientData } = payload;
  return await requestApiPost('api_delete_client_appeal_by_client_id', {}, clientData, successCallback);
}

export async function jwtDecode(payload: JwtDecodePayload): Promise<Response> {
  const { successCallback, token } = payload;
  return await requestApiGet('api_decode_jwt', { token }, successCallback);
}

export async function toSelectedTeammateRemapDialogs(payload: ToSelectedTeammateRemapDialogsPayload): Promise<Response> {
  const { successCallback, projectId, ...teammatesEmails } = payload;
  return await requestApiPost('api_remap_dialogs_to_selected_teammate', teammatesEmails, { projectId }, successCallback);
}