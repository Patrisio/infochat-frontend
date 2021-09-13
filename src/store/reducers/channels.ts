import { Condition, ChannelsState, ChannelsAction, ChannelsActionTypes } from '../../types/channels';

import cloneDeep from 'lodash/cloneDeep';
import { generateRandomHash } from '../../utils/string';
import { DEFAULT_TIME_ZONE } from '../../lib/utils/date';

const DEFAULT_TIME_WITHOUT_ANSWER = 10;

const defaultCondition: Condition = {
  id: generateRandomHash(),
  variant: 'currentPageAddress',
  operator: 'contain',
  value: '',
};

const defaultRule = {
  id: generateRandomHash(),
  name: 'Приветствие',
  isActivate: false,
  conditions: [defaultCondition],
  result: 'Есть проблемы с вашей картой? Наша служба поддержки здесь. Спрашивай! Мы рады помочь!',
};

const initialState: ChannelsState = {
  channels: [],
  settings: {
    chatName: 'Чат на сайте',
    greeting: '',
    backgroundImage: 1,
    buttonLocation: 'right',
    buttonScale: '1',
    buttonText: '',
    buttonWidth: 0,
    infochatLinkEnabled: 1,
    customCss: '',
    operators: [],
    businessDays: [],
    timezone: DEFAULT_TIME_ZONE,
    responseTimeText: 'Автоматическое время ответа',
    requestText: 'Если клиент написал в нерабочие часы',
    rules: [defaultRule],
    timeWithoutAnswer: DEFAULT_TIME_WITHOUT_ANSWER,
  },
  fetching: false,
};

export const channelsReducer = (state = initialState, action: ChannelsAction): ChannelsState => {
  switch (action.type) {
    case ChannelsActionTypes.ADD_CHANNELS:
      return {
        ...state,
        channels: action.payload,
      };

    case ChannelsActionTypes.ADD_CHANNEL:
      return {
        ...state,
        channels: [...state.channels, { name: action.payload.name, status: 'pending' }]
      };

    case ChannelsActionTypes.TOGGLE_FETCHING_CHANNELS:
      return {
        ...state,
        fetching: !state.fetching,
      };

    case ChannelsActionTypes.UPDATE_SETTINGS:
      const updatedSettings = {
        settings: Object.assign(state.settings, action.payload),
      };

      return cloneDeep(Object.assign(state, updatedSettings));

    case ChannelsActionTypes.UPDATE_CHANNEL_STATUS_BY_CHANNEL_NAME:
      const { name, status } = action.payload;
      const foundChannel = state.channels.find(channel => channel.name === name);

      if (foundChannel) {
        foundChannel.status = status;
      }

      return cloneDeep(Object.assign(state, { channels: state.channels }));

    default:
      return state;
  }
}