import {
  ChannelAddPayload, ChatSettingsSavePayload, GetChannelsPayload,
  ChatSettingsFetchPayload,
} from 'api/types';

export interface Channel {
  name: string
  status: any,
}

export interface Operator {
  name: string,
  id: string,
}

type OperatorSign = 'contain' | 'not contain' | 'not' | 'moreThan' | 'lessThan';
type Variant = 'currentPageAddress' | 'timeOnCurrentPage' | 'allOperatorsAreOffline' | 'referralLink';

export interface Condition {
  id: number | string,
  operator: OperatorSign,
  value: string,
  variant: Variant,
}

export interface BusinessDay {
  businessDayId: string,
  weekday: string,
  timeFrom: string,
  timeTo: string,
}

export interface Rule {
  id: string,
  conditions: Condition[],
  isActivate: boolean,
  name: string,
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

export enum ChannelsActionTypes {
  ADD_CHANNELS = 'ADD_CHANNELS',
  UPDATE_SETTINGS = 'UPDATE_SETTINGS',
  FETCH_CHANNELS = 'FETCH_CHANNELS',
  TOGGLE_FETCHING_CHANNELS = 'TOGGLE_FETCHING_CHANNELS',
  ADD_CHANNEL = 'ADD_CHANNEL',
  SAVE_CHAT_SETTINGS = 'SAVE_CHAT_SETTINGS',
  FETCH_CHAT_SETTINGS = 'FETCH_CHAT_SETTINGS',
  UPDATE_CHANNEL_STATUS_BY_CHANNEL_NAME = 'UPDATE_CHANNEL_STATUS_BY_CHANNEL_NAME',
}

interface addChannelsAction {
  type: ChannelsActionTypes.ADD_CHANNELS,
  payload: Channel[],
}
interface updateChannelSettingsAction {
  type: ChannelsActionTypes.UPDATE_SETTINGS,
  payload: Partial<Settings>,
}
interface addChannelAction {
  type: ChannelsActionTypes.ADD_CHANNEL,
  payload: ChannelAddPayload,
}
interface fetchChannelsAction {
  type: ChannelsActionTypes.FETCH_CHANNELS,
  payload: GetChannelsPayload,
}
interface toggleFetchingChannelsAction {
  type: ChannelsActionTypes.TOGGLE_FETCHING_CHANNELS,
  payload?: any,
}
interface saveChatSettingsAction {
  type: ChannelsActionTypes.SAVE_CHAT_SETTINGS,
  payload: ChatSettingsSavePayload,
}
interface fetchChatSettingsAction {
  type: ChannelsActionTypes.FETCH_CHAT_SETTINGS,
  payload: ChatSettingsFetchPayload,
}
interface updateChannelStatusByChannelName {
  type: ChannelsActionTypes.UPDATE_CHANNEL_STATUS_BY_CHANNEL_NAME,
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
  | updateChannelStatusByChannelName