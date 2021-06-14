import { CHANNELS, CHANNEL, CHAT } from '../constants/channels';
import cloneDeep from 'lodash/cloneDeep';
import { generateRandomHash } from '../utils/string';
import { responseTime, request } from '../pages/Channels/components/ClockBlock/constants';
import { DEFAULT_TIME_ZONE } from '../lib/utils/date';

interface Channel {
  name: string
}

interface Operator {
  name: string,
  id: string,
}

interface BusinessDay {
  businessDayId: string,
  weekday: string,
  timeFrom: string,
  timeTo: string,
}

interface Rule {
  id: string,
  name: string,
  isActivate: boolean,
  conditions: Condition[],
  result: string,
}

interface Settings {
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

interface State {
  channels: Channel[],
  settings: Settings,
  fetching: boolean,
}

interface Condition {
  id: string,
  variant: string,
  operator: string,
  value: string,
}

const DEFAULT_TIME_WIHTOUT_ANSWER = 10;

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

const initialState: State = {
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
    timeWithoutAnswer: DEFAULT_TIME_WIHTOUT_ANSWER,
  },
  fetching: false,
};

export const channelsReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case CHANNELS.ADD:
      return {
        ...state,
        channels: action.channels
      };

    case CHANNEL.ADD:
      return {
        ...state,
        channels: [...state.channels, { name: action.payload.name, status: 'pending' }]
      };

    case CHANNELS.TOGGLE_FETCHING:
      return {
        ...state,
        fetching: !state.fetching,
      };

    case CHANNELS.UPDATE_SETTINGS:
      const updatedSettings = {
        settings: Object.assign(state.settings, action.payload),
      };

      return cloneDeep(Object.assign(state, updatedSettings));

    default:
      return state;
  }
}