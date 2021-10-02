import { ChannelsActionTypes, ChannelsAction, Channel } from 'types/channels';
import {
  ChannelAddPayload, ChatSettingsSavePayload, GetChannelsPayload,
  ChatSettingsFetchPayload, 
} from 'api/types';

export const fetchChannels = (payload: GetChannelsPayload): ChannelsAction => ({
  type: ChannelsActionTypes.FETCH_CHANNELS,
  payload,
});

export const addChannels = (payload: Channel[]): ChannelsAction => ({
  type: ChannelsActionTypes.ADD_CHANNELS,
  payload,
});

export const addChannel = (payload: ChannelAddPayload): ChannelsAction => ({
  type: ChannelsActionTypes.ADD_CHANNEL,
  payload,
});

export const updateChannelSettings = (payload: any): ChannelsAction => ({
  type: ChannelsActionTypes.UPDATE_SETTINGS,
  payload,
});

export const saveChatSettings = (payload: ChatSettingsSavePayload): ChannelsAction => ({
  type: ChannelsActionTypes.SAVE_CHAT_SETTINGS,
  payload,
});

export const fetchChatSettings = (payload: ChatSettingsFetchPayload): ChannelsAction => ({
  type: ChannelsActionTypes.FETCH_CHAT_SETTINGS,
  payload,
});

export const updateChannelStatusByChannelName = (payload: any): ChannelsAction => ({
  type: ChannelsActionTypes.UPDATE_CHANNEL_STATUS_BY_CHANNEL_NAME,
  payload,
});