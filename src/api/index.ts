import { requestApi, GET, POST } from './apiCore';
import { Response } from 'api/types';

const VALUE_PATTERN = /\[.:\w+\]/g;
const PARAM_PATTERN_NAME = /:\w+/g;

export async function requestApiGet(
  routeID: string,
  getParams = {},
  successCallback?: (response: Response['data']) => void,
  errorCallback?: (response: Response) => void
): Promise<Response> {
  return requestApi({
    method: GET,
    url: await getRoute(routeID),
    getParams,
    successCallback,
    errorCallback,
  });
}

export async function requestApiPost(
  routeID: string,
  postBody: any = null,
  getParams: any = {},
  successCallback?: (response: Response['data']) => void,
  errorCallback?: (response: Response) => void
): Promise<Response> {
  return requestApi({
    method: POST,
    url: await getRoute(routeID),
    getParams,
    postBody,
    successCallback,
    errorCallback,
  });
}

async function loadRoutes(): Promise<{[key: string]: string}> {
  return {
    api_auth_invite: '/auth/invite/[*:inviteId]',
    api_get_current_user: '/auth/getCurrentUser',
    api_auth_sign_in: '/auth/signin',
    api_auth_sign_up: '/auth/signup',
    api_send_email: '/auth/project/[*:projectId]/sendEmail',
    api_decode_jwt: '/auth/[*:token]/decodeJwt',

    api_update_messages_status_by_client_id: '/inbox/project/[*:projectId]/client/[*:clientId]/updateMessagesStatusByClientId',
    api_update_selected_client_by_project_id: '/inbox/project/[*:projectId]/client/[*:clientId]/update',
    api_get_messages_history: '/inbox/project/[*:projectId]/chat/[*:clientId]/getMessagesHistory',
    api_get_messages_history_by_project_id: '/inbox/project/[*:projectId]/getMessagesHistoryByProject',
    api_get_client_info: '/inbox/project/[*:projectId]/client/[*:clientId]/getClientInfo',
    api_get_channels: '/inbox/project/[*:projectId]/getChannels',
    api_add_note: '/inbox/client/[*:clientId]/addNote',
    api_delete_note: '/inbox/client/[*:clientId]/deleteNote',
    api_add_channel: '/inbox/project/[*:projectId]/addChannel',
    api_add_message: '/inbox/addMessage',
    api_delete_client_appeal_by_client_id: '/inbox/project/[*:projectId]/client/[*:clientId]/deleteClientAppealByClientId',
    api_remap_dialogs_to_selected_teammate: '/inbox/project/[*:projectId]/remapDialogsToSelectedTeammate',

    api_add_teammate: '/teammates/project/[*:projectId]/settings/teammates/addTeammate',
    api_delete_teammate: '/teammates/project/[*:projectId]/settings/teammates/deleteTeammate',
    api_get_teammates: '/teammates/project/[*:projectId]/settings/teammates',
    api_update_teammate: '/teammates/project/[*:projectId]/settings/teammates/updateTeammate',
    
    api_save_chat_settings: '/channels/project/[*:projectId]/saveChatSettings',
    api_get_chat_settings: '/channels/project/[*:projectId]/getChatSettings',

    api_add_template: '/templates/project/[*:projectId]/settings/addTemplate',
    api_delete_template: '/templates/project/[*:projectId]/settings/deleteTemplate',
    api_update_template: '/templates/project/[*:projectId]/settings/updateTemplate',
    api_get_templates: '/templates/project/[*:projectId]/settings/getTemplates',

    api_add_project: '/projects/addProject',

    api_get_tariff_plan: '/projects/project/[*:projectId]/settings/getProjectTariffPlan',
    api_update_tariff_plan: '/projects/project/[*:projectId]/settings/updateProjectTariffPlan',
  };
}

function getRouteDataFromPattern(pattern: string): any {
  const valueRegexpStrings = pattern.match(VALUE_PATTERN);
  const valuesNames = pattern.match(PARAM_PATTERN_NAME);
  let params: any = {};

  if (!valueRegexpStrings || !valuesNames) {
    return params;
  }

  valuesNames.forEach((name: string, i: number) => {
    params[name.slice(1)] = valueRegexpStrings[i];
  });

  return params;
}

export function generateUrlWithGetParams(pattern: string, getParams: any): string {
  const patternData = getRouteDataFromPattern(pattern);
  let url = pattern;

  Object.keys(getParams).forEach((paramName) => {
    if (patternData[paramName]) {
      url = url.replace(patternData[paramName], getParams[paramName]);

      delete getParams[paramName];
    }
  });

  const query = serializeParams(getParams);

  return query ? `${url}/${query}` : url;
}

function serializeParams(params: any, prefix?: string): string {
  const result: any = [];

  Object.keys(params).forEach((key) => {
    const arg = prefix ?
      prefix + '[' + key + ']' :
      key;

    const v = params[key];
    const isObject = v !== null && typeof v === 'object';
    result.push(isObject ? serializeParams(v, arg) : encodeURIComponent(arg) + '=' + encodeURIComponent(v));
  });

  return result.join('&');
}

async function getRoute(routeID: string): Promise<string> {
  return (await loadRoutes())[routeID];
}