interface Channel {
  name: string
}

interface Operator {
  name: string,
  id: string,
}

export interface BusinessDay {
  businessDayId: string,
  weekday: string,
  timeFrom: string,
  timeTo: string,
}

export interface Rule {
  id: string,
  name: string,
  isActivate: boolean,
  conditions: Condition[],
  result: string,
}

export interface Settings {
  chatName: string,
  greeting: string,
  backgroundImage: number,
  buttonLocation: string,
  buttonScale: string,
  buttonText: string,
  buttonWidth: number,
  infochatLinkEnabled: number,
  customCss: string,
  operators: Operator[],
  businessDays: BusinessDay[],
  responseTimeText: string,
  requestText: string,
  timezone: string,
  rules: Rule[],
  timeWithoutAnswer: number,
}

export interface ChannelsState {
  channels: Channel[],
  settings: Settings,
  fetching: boolean,
}

export interface Condition {
  id: string,
  variant: string,
  operator: string,
  value: string,
}

export enum ChannelsActionTypes {
  ADD_CHANNELS = 'ADD_CHANNELS',
  UPDATE_SETTINGS = 'UPDATE_SETTINGS',
  FETCH_CHANNELS = 'FETCH_CHANNELS',
  TOGGLE_FETCHING_CHANNELS = 'TOGGLE_FETCHING_CHANNELS',
  ADD_CHANNEL = 'ADD_CHANNEL',
  SAVE_CHAT_SETTINGS = 'SAVE_CHAT_SETTINGS',
  FETCH_CHAT_SETTINGS = 'FETCH_CHAT_SETTINGS',
}

interface addChannelsAction {
  type: ChannelsActionTypes.ADD_CHANNELS,
  channels: any,
}
interface updateChannelSettingsAction {
  type: ChannelsActionTypes.UPDATE_SETTINGS,
  payload: any,
}
interface addChannelAction {
  type: ChannelsActionTypes.ADD_CHANNEL,
  payload: any,
}
interface fetchChannelsAction {
  type: ChannelsActionTypes.FETCH_CHANNELS,
  payload: any,
}
interface toggleFetchingChannelsAction {
  type: ChannelsActionTypes.TOGGLE_FETCHING_CHANNELS,
}
interface saveChatSettingsAction {
  type: ChannelsActionTypes.SAVE_CHAT_SETTINGS,
  payload: any,
  projectId: any,
}
interface fetchChatSettingsAction {
  type: ChannelsActionTypes.FETCH_CHAT_SETTINGS,
  payload: any,
}

export type ChannelsAction = 
  addChannelsAction
  | updateChannelSettingsAction
  | addChannelAction
  | fetchChannelsAction
  | toggleFetchingChannelsAction
  | saveChatSettingsAction
  | fetchChatSettingsAction