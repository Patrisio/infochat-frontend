import {
  MESSAGES, INCOMING_MESSAGES, SELECT_CLIENT,
  INCOMING_MESSAGES_FOR_SELECTED_CLIENT,
  SELECTED_CLIENT_UPDATE, ASSIGNED_USER, CLIENT_DATA,
  SELECTED_CLIENT_GET_INFO
} from '../constants/inbox';
import { TEAMMATE } from '../constants/teammates';
import { CHANNELS, CHANNEL, CHAT } from '../constants/channels';
import { TEMPLATE, TEMPLATES } from '../constants/templates';
import { AUTH } from '../constants/auth';
import { PROJECT } from '../constants/projects';
import { TARIFF } from '../constants/tariff';

const authInvite = (payload: any) => ({
  type: AUTH.INVITE,
  payload,
});

const getCurrentUser = (payload: any) => ({
  type: AUTH.GET_CURRENT_USER,
  payload,
});

const authSignIn = (payload: any) => ({
  type: AUTH.SIGNIN,
  payload,
});

const authSignUp = (payload: any) => ({
  type: AUTH.SIGNUP,
  payload,
});

const addMessage = (message: any) => ({
  type: MESSAGES.ADD,
  message
});

const getClientInfo = (payload: any) => ({
  type: SELECTED_CLIENT_GET_INFO,
  payload
});

const addToInboxIncomingMessage = (payload: any) => ({
  type: INCOMING_MESSAGES.ADD_TO_INBOX,
  payload,
});

const fetchIncomingMessages = (incomingMessage: any) => ({
  type: INCOMING_MESSAGES.FETCH,
  incomingMessage
});

const changeMessagesStatus = (payload: any) => ({
  type: CLIENT_DATA.CHANGE_MESSAGES_STATUS,
  payload
});

const updateIncomingMessagesFilters = (filters: any) => ({
  type: INCOMING_MESSAGES.UPDATE_FILTERS,
  filters,
});

const updateClientData = (payload: any) => ({
  type: CLIENT_DATA.UPDATE,
  payload,
});

const addIncomingMessage = (incomingMessage: any) => ({
  type: INCOMING_MESSAGES.ADD,
  incomingMessage
});

const selectClient = (client: any) => ({
  type: SELECT_CLIENT,
  client
});

const fetchTemplates = (payload: { projectId: string }) => ({
  type: TEMPLATES.FETCH,
  payload
});

const addTemplate = (template: any, projectId: string) => ({
  type: TEMPLATE.ADD,
  template,
  projectId
});

const addTemplates = (templates: any) => ({
  type: TEMPLATES.ADD,
  templates
});

const editTemplate = (template: any, projectId: string) => ({
  type: TEMPLATE.EDIT,
  template,
  projectId,
});

const deleteTemplate = (templateId: string, projectId: string) => ({
  type: TEMPLATE.DELETE,
  templateId,
  projectId,
});

const addTeammate = (teammate: any) => ({
  type: TEAMMATE.ADD,
  teammate
});

const deleteTeammate = (teammate: any) => ({
  type: TEAMMATE.DELETE,
  teammate
});

// const assignTeammate = (payload: any) => ({
//   type: TEAMMATE.ASSIGN,
//   payload
// });

const updateTeammate = (payload: any) => ({
  type: TEAMMATE.UPDATE,
  payload
});

const addIncomingMessageForSelectedClient = (incomingMessage: any) => ({
  type: INCOMING_MESSAGES_FOR_SELECTED_CLIENT.ADD,
  incomingMessage
});

const updateIncomingMessage = (payload: any) => ({
  type: INCOMING_MESSAGES.UPDATE,
  payload
});

const updateSelectedClient = (payload: any) => ({
  type: SELECTED_CLIENT_UPDATE,
  payload
});

const fetchChannels = (payload: any) => ({
  type: CHANNELS.FETCH,
  payload
});

const addChannels = (payload: any) => ({
  type: CHANNELS.ADD,
  payload
});

const addChannel = (payload: any) => ({
  type: CHANNEL.ADD,
  payload
});

const updateChannelSettings = (payload: any) => ({
  type: CHANNELS.UPDATE_SETTINGS,
  payload
});

const saveChatSettings = (payload: any, projectId: string) => ({
  type: CHAT.SAVE_SETTINGS,
  payload,
  projectId
});

const fetchChatSettings = (payload: { projectId: string, successCallback?: (data: any) => void }) => ({
  type: CHAT.FETCH_SETTINGS,
  payload,
});

const fetchTeammates = (payload: any) => ({
  type: TEAMMATE.FETCH,
  payload
});

const addProject = (payload: any) => ({
  type: PROJECT.ADD,
  payload,
});

const updateTariffPlan = (payload: any) => ({
  type: TARIFF.UPDATE_PLAN,
  payload,
});

const updateTariffPeriod = (payload: any) => ({
  type: TARIFF.UPDATE_PERIOD,
  payload,
});

const fetchTariffPlan = (payload: any) => ({
  type: TARIFF.FETCH_PLAN,
  payload,
});

const saveTariffPlan = (payload: any) => ({
  type: TARIFF.SAVE_PLAN,
  payload,
});

export {
  authInvite,
  authSignIn,
  authSignUp,
  getCurrentUser,

  addMessage,
  addIncomingMessage,
  selectClient,
  addIncomingMessageForSelectedClient,
  updateIncomingMessage,
  updateSelectedClient,
  fetchIncomingMessages,
  updateClientData,
  addToInboxIncomingMessage,
  getClientInfo,
  changeMessagesStatus,
  updateIncomingMessagesFilters,

  fetchChannels,
  fetchChatSettings,
  addChannel,
  addChannels,
  updateChannelSettings,
  saveChatSettings,

  fetchTeammates,
  addTeammate,
  deleteTeammate,
  // assignTeammate,
  updateTeammate,

  fetchTemplates,
  addTemplate,
  addTemplates,
  editTemplate,
  deleteTemplate,

  addProject,

  updateTariffPlan,
  updateTariffPeriod,
  fetchTariffPlan,
  saveTariffPlan,
}