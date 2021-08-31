import { requestApiPost, requestApiGet } from './';

export async function inviteUser(payload: any) {
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

export async function fetchCurrentUser(payload: any) {
  return await requestApiGet('api_get_current_user', {}, payload.successCallback, payload.errorCallback);
}

export async function signIn(payload: any) {
  const { successCallback, ...loginCredentials } = payload;
  return await requestApiPost('api_auth_sign_in', loginCredentials, {}, successCallback);
}

export async function signUp(payload: any) {
  return await requestApiPost('api_auth_sign_up', payload);
}

export async function getTeammates(projectId: string) {
  return await requestApiGet('api_get_teammates', { projectId });
}

export async function teammateUpdate(payload: any) {
  const { projectId, successCallback, ...updatedTeammateData } = payload;
  return await requestApiPost('api_update_teammate', updatedTeammateData, { projectId }, successCallback);
}

export async function incomingMessagesFetch(payload: { projectId: string, clientId: string }) {
  const { clientId, projectId } = payload;

  if (clientId) {
    return await requestApiGet('api_get_messages_history', { projectId, clientId });
  }

  return await requestApiGet('api_get_messages_history_by_project_id', { projectId });
}

export async function selectedClientInfoGet(payload: {
  projectId: string,
  clientId: string,
  successCallback: (data: any) => void,
}) {
  const { projectId, clientId } = payload;
  return await requestApiGet('api_get_client_info', { projectId, clientId });
}

export async function messageToInboxAdd(payload: any) {
  return await requestApiPost('api_add_message', payload);
}

export async function messagesStatusUpdate(payload: any) {
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

export async function selectedClientUpdate(payload: any) {
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

export async function teammateAdd(payload: {
  email: string,
  projectId?: string,
  role: string,
  status: string,
  username: string,
}) {
  const { email, role, status, username, projectId } = payload;
  return await requestApiPost('api_add_teammate',
    {
      email,
      role,
      status,
      username,
    },
    {
      projectId,
    }
  );
}

export async function removeTeammate(payload: {email: string, projectId: string}) {
  const { email, projectId } = payload;
  return await requestApiPost('api_delete_teammate', { email }, { projectId });
}

export async function sendEmail(payload: { email: string, projectId: string }) {
  const { email, projectId } = payload;
  return await requestApiPost('api_send_email', { email }, { projectId });
}

export async function getChannels(projectId: string) {
  const { channels } = await requestApiGet('api_get_channels', { projectId });
  return channels
}

export async function channelAdd(payload: { projectId: string, name: string }) {
  const { projectId, name } = payload;
  return await requestApiPost('api_add_channel', { name }, { projectId });
}

export async function chatSettingsSave(payload: any, projectId: string) {
  return await requestApiPost('api_save_chat_settings', payload, { projectId });
}

export async function chatSettingsFetch(payload: { projectId: string, successCallback: (data: any) => {} }) {
  const { projectId, successCallback } = payload;
  return await requestApiGet('api_get_chat_settings', { projectId }, successCallback);
}

export async function templateAdd(payload: { id: string, name: string, message: string, projectId: string }) {
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

export async function templateDelete(payload: { templateId: string, projectId: string }) {
  const { templateId, projectId } = payload;
  return await requestApiPost('api_delete_template', { templateId }, { projectId });
}

export async function templateEdit(payload: { id: string, name: string, message: string, projectId: string }) {
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

export async function getTemplates(projectId: string) {
  return await requestApiGet('api_get_templates', { projectId });
}

export async function projectAdd(payload: { name: string, timezone: string, successCallback: () => void }) {
  const { successCallback, ...projectData } = payload;
  return await requestApiPost('api_add_project', projectData, {}, successCallback);
}

export async function tariffPlanFetch(projectId: string): Promise<{ code: number, tariffPlan: any }> {
  return await requestApiGet('api_get_tariff_plan', { projectId });
}

export async function tariffPlanUpdate(payload: any) {
  const { projectId, ...tariffPlan } = payload;
  return await requestApiPost('api_update_tariff_plan', tariffPlan, { projectId });
}

export async function noteAdd(payload: any) {
  const { successCallback, clientId, ...noteData } = payload;
  return await requestApiPost('api_add_note', noteData, { clientId }, successCallback);
}

export async function noteDelete(payload: any) {
  const { successCallback, ...noteData } = payload;
  return await requestApiPost('api_delete_note', noteData, {}, successCallback);
}

export async function clientAppealDelete(payload: any) {
  const { successCallback, ...clientData } = payload;
  return await requestApiPost('api_delete_client_appeal_by_client_id', {}, clientData, successCallback);
}