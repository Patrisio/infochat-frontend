import { ChannelsActionTypes, ChannelsAction } from '../../types/channels';

export const fetchChannels = (payload: any): ChannelsAction => ({
  type: ChannelsActionTypes.FETCH_CHANNELS,
  payload,
});

export const addChannels = (channels: any): ChannelsAction => ({
  type: ChannelsActionTypes.ADD_CHANNELS,
  channels,
});

export const addChannel = (payload: any): ChannelsAction => ({
  type: ChannelsActionTypes.ADD_CHANNEL,
  payload,
});

export const updateChannelSettings = (payload: any): ChannelsAction => ({
  type: ChannelsActionTypes.UPDATE_SETTINGS,
  payload,
});

export const saveChatSettings = (payload: any, projectId: string): ChannelsAction => ({
  type: ChannelsActionTypes.SAVE_CHAT_SETTINGS,
  payload,
  projectId,
});

export const fetchChatSettings = (payload: { projectId: string, successCallback?: (data: any) => void }): ChannelsAction => ({
  type: ChannelsActionTypes.FETCH_CHAT_SETTINGS,
  payload,
});

export const updateChannelStatusByChannelName = (payload: any): ChannelsAction => ({
  type: ChannelsActionTypes.UPDATE_CHANNEL_STATUS_BY_CHANNEL_NAME,
  payload,
});